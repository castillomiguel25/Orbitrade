-- Drop orphaned engagement tables from removed features
-- Safe to run: these tables belong to arcade/roulette/ZRV features that are no longer in the codebase.

-- Drop Galaxian game table (was created by galaxian_table.sql)
DROP TABLE IF EXISTS galaxian_table;

-- Drop roulette/tickets tables (were created by spin-roulette feature)
DROP TABLE IF EXISTS roulette_spins;
DROP TABLE IF EXISTS ticket_transactions;

-- The ZRVS balance column (migration_add_zrvs_balance.sql) added a column to profiles.
-- Keeping the column inert rather than dropping it to avoid schema breakage.
-- If safe to drop after verifying no active queries, run:
-- ALTER TABLE profiles DROP COLUMN IF EXISTS zrvs_balance;
