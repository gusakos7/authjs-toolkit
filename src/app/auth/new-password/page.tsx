import { NewPasswordForm } from "@/components/auth/new-password-form";
import React, { Suspense } from "react";

export default function NewPasswordPage() {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
}
