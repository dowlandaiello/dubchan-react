import { useEffect } from "react";

type RenderParameters = {
  sitekey: string;
  theme?: "light" | "dark";
  callback?(token: string): void;
};

declare global {
  interface Window {
    captchaCallback?: any;
    turnstile: {
      render(container: string | HTMLElement, params: RenderParameters): void;
    };
  }
}

export const Captcha = ({
  onSuccess,
}: {
  onSuccess: (token: string) => void;
}) => {
  useEffect(() => {
    if (!window.turnstile) return;

    // Render the captcha
    window.turnstile.render("#captcha", {
      sitekey: "0x4AAAAAAAKUQflEBg4_Jffo",
      callback: onSuccess,
    });
  }, [window.turnstile]);

  return <div id="captcha" />;
};
