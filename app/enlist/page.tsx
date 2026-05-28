"use client";
import React, { Suspense } from "react";
import { RegistroForm } from "./RegistroForm";
import { useIntl } from 'react-intl';

function LoadingFallback() {
  const intl = useIntl();
  return <div>{intl.formatMessage({ id: 'register.loading' })}</div>;
}

export default function Registro() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegistroForm />
    </Suspense>
  );
}