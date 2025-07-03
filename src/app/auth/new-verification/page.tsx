import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

export default function NewVerificationToken() {
  return (
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
}
