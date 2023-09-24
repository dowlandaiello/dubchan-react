import { useEffect, useState } from "react";

/// Formats a route under the current page's API.
export const route = (route: string): string => {
  if (window.location) {
    if (window.location.hostname.includes("dubchan")) {
      return `https://api.dubchan.net${route}`;
    }

    return `${window.location.protocol}//${window.location.hostname}${route}`;
  }

  return "http://localhost";
};

export const useUiRoute = (route: string): string => {
  const [base, setBase] = useState<string>("http://localhost:3000");

  useEffect(() => {
    if (window.location)
      setBase(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
      );
  }, [typeof window]);

  return `${base}${route}`;
};

/// Converts a youtube or youtu.be link to an embed
export const getYtEmbed = (url: string): string =>
  "https://www.youtube.com/embed/" + url.split("v=")[1];
