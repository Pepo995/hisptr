"use client";
import { type ReactNode, useCallback, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RecaptchaComponent = ({
  children,
  validate,
  action,
}: {
  children: ReactNode;
  validate:
    | ((token: string) => Promise<{
        status: string;
        message?: string;
      }>)
    | React.Dispatch<React.SetStateAction<string | undefined>>;
  action: string;
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      return;
    }
    try {
      const token = await executeRecaptcha(action);
      await validate(token);
    } catch (error) {
      setTimeout(() => void handleReCaptchaVerify(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executeRecaptcha]);

  useEffect(() => {
    void handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  return <div onClick={handleReCaptchaVerify}>{children}</div>;
};

export default RecaptchaComponent;
