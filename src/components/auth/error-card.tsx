import React from "react";
import { CardWrapper } from "./card-wrapper";
import { BsExclamationTriangle } from "react-icons/bs";

export const ErrorCard = () => {
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      headerLabel="Oops! Something went wrong."
    >
      <div className="w-full flex items-center justify-center">
        <BsExclamationTriangle className="text-destructive w-4 h-4" />
      </div>
    </CardWrapper>
  );
};
