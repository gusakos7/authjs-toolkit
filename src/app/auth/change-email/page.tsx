import { ChangeEmailForm } from "@/components/auth/change-email-form";
import { Suspense } from "react";

export default function ChangeEmailPage() {
  return (
    <Suspense>
      <ChangeEmailForm />
    </Suspense>
  );
}
