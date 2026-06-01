import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { getSupabaseAdmin } from "../../utils/supabase/admin";
import { checkRateLimit, RATE_LIMITS } from "../../utils/rateLimit";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting: max 5 req/min per user
  const rl = checkRateLimit(`validate-deposits:${user.id}`, RATE_LIMITS.validateDeposits);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  const body = await req.json();
  const { expectedAmount, txid } = body;

  if (!expectedAmount || isNaN(expectedAmount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!txid || !/^[a-fA-F0-9]{64}$/.test(txid)) {
    return NextResponse.json({ error: "Invalid TXID" }, { status: 400 });
  }

  const DESTINATION_WALLET = process.env.DESTINATION_WALLET;
  if (!DESTINATION_WALLET) {
    // Generic error for client - do not expose internal config details
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
  }

  try {
    let transactions: any[] = [];
    let hasMore = true;
    let fingerprint: string | undefined = undefined;

    while (hasMore && transactions.length < 100) {
      const url: string = `https://api.trongrid.io/v1/accounts/${DESTINATION_WALLET}/transactions/trc20` +
        (fingerprint ? `?fingerprint=${fingerprint}` : '');
      const response: Response = await fetch(url, { headers: { "Content-Type": "application/json", Accept: "application/json" } });
      const json: any = await response.json();
      transactions = transactions.concat(json?.data || []);
      fingerprint = json.meta?.fingerprint;
      hasMore = !!fingerprint;
      if (transactions.some((tx: any) => tx.transaction_id?.toLowerCase() === txid.toLowerCase())) break;
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron transacciones en la wallet destino" },
        { status: 404 }
      );
    }

    const matchingTx = transactions.find((tx: any) => {
      const txidOnChain = tx.transaction_id?.toLowerCase();
      const decimals = tx.token_info?.decimals || 6;
      const amount = parseFloat(tx.value) / Math.pow(10, decimals);

      return (
        txidOnChain === txid.toLowerCase() &&
        tx.token_info?.symbol === "USDT" &&
        tx.to === DESTINATION_WALLET &&
        Math.abs(amount - expectedAmount) < 0.0001
      );
    });

    if (!matchingTx) {
      return NextResponse.json(
        { error: "No se encontró una transacción con ese TXID y monto" },
        { status: 404 }
      );
    }

    const { data: existingTx, error: checkError } = await supabase
      .from("transactions")
      .select("id")
      .eq("transactionid", matchingTx.transaction_id)
      .single();

    if (!existingTx && (!checkError || checkError.code === "PGRST116")) {
      const valueInUSDT = parseFloat(matchingTx.value) / Math.pow(10, matchingTx.token_info?.decimals || 6);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("trc20balance, flujo, hasinvested")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "Error al obtener el perfil del usuario" },
          { status: 500 }
        );
      }

      const currentBalance = parseFloat(profile.trc20balance || "0");
      const currentFlujo = parseFloat(profile.flujo || "0");
      const newBalance = currentBalance + valueInUSDT;
      const newFlujo = currentFlujo + valueInUSDT;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ trc20balance: newBalance, flujo: newFlujo })
        .eq("id", user.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Error al actualizar el balance del usuario" },
          { status: 500 }
        );
      }

      // Registrar movimiento de saldo (depósito)
      await supabase.from("balance_movements").insert({
        user_id: user.id,
        type: "deposit",
        amount: valueInUSDT,
        previous_balance: currentBalance,
        new_balance: newBalance,
        ref_id: matchingTx.transaction_id,
        note: "Depósito confirmado",
        metadata: { wallet: matchingTx.to, decimals: matchingTx.token_info?.decimals || 6 },
      });

      // Recompensas de referido solo en la primera inversión confirmada
      const baseAmount = valueInUSDT;
      const isFirstInvestment = !profile.hasinvested;

      if (isFirstInvestment) {
        // Obtener el perfil del inversor para ver quién lo refirió
        const { data: investorProfile } = await supabase
          .from("profiles")
          .select("id, referredby")
          .eq("id", user.id)
          .single();

        if (investorProfile) {
          // Nivel 1
          let firstReferrer: any = null;
          if (investorProfile.referredby) {
            const { data: fRef } = await getSupabaseAdmin()
              .from("profiles")
              .select("id, referralcode, referredby, trc20balance, flujo")
              .eq("referralcode", investorProfile.referredby)
              .single();
            firstReferrer = fRef || null;
          }

          // Nivel 2
          let secondReferrer: any = null;
          if (firstReferrer?.referredby) {
            const { data: sRef } = await getSupabaseAdmin()
              .from("profiles")
              .select("id, referralcode, referredby, trc20balance, flujo")
              .eq("referralcode", firstReferrer.referredby)
              .single();
            secondReferrer = sRef || null;
          }

          // Nivel 3
          let thirdReferrer: any = null;
          if (secondReferrer?.referredby) {
            const { data: tRef } = await getSupabaseAdmin()
              .from("profiles")
              .select("id, referralcode, referredby, trc20balance, flujo")
              .eq("referralcode", secondReferrer.referredby)
              .single();
            thirdReferrer = tRef || null;
          }

          const creditReferral = async (referrer: any, level: number, percent: number) => {
            const reward = +(baseAmount * percent).toFixed(2);
            if (!referrer || reward <= 0) return;

            const prevBalance = parseFloat(referrer.trc20balance || "0");
            const prevFlow = parseFloat(referrer.flujo || "0");
            const newBal = prevBalance + reward;
            const newFlow = prevFlow + reward;

            await getSupabaseAdmin()
              .from("profiles")
              .update({ trc20balance: newBal, flujo: newFlow })
              .eq("id", referrer.id);

            await getSupabaseAdmin()
              .from("referrals")
              .insert({
                referred_id: user.id,
                referrer_id: referrer.id,
                level,
                reward_amount: reward,
                date: new Date().toISOString(),
                status: "paid",
              });

            await getSupabaseAdmin()
              .from("balance_movements")
              .insert({
                user_id: referrer.id,
                type: "earning_referral",
                amount: reward,
                previous_balance: prevBalance,
                new_balance: newBal,
                ref_id: matchingTx.transaction_id,
                note: `Recompensa de referido nivel ${level}`,
                metadata: { referred_id: user.id, level, base_amount: baseAmount },
              });
          };

          await creditReferral(firstReferrer, 1, 0.1); // 10% Nivel 1
          await creditReferral(secondReferrer, 2, 0.03); // 3% Nivel 2
          await creditReferral(thirdReferrer, 3, 0.01); // 1% Nivel 3

          await supabase
            .from("profiles")
            .update({ hasinvested: true, first_deposit_amount: baseAmount })
            .eq("id", user.id);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Transacción validada correctamente",
        amount: valueInUSDT,
        transaction_id: matchingTx.transaction_id,
        new_balance: newBalance,
      });
    }

    return NextResponse.json(
      { error: "La transacción ya fue utilizada" },
      { status: 400 }
    );
  } catch (err) {
    // Log internally but do not expose details to client
    console.error("TronGrid query error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: "Transaction verification failed. Please try again later." },
      { status: 500 }
    );
  }
}
