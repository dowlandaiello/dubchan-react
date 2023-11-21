import { useEffect, useState } from "react";
import { IncomingMessage } from "http";

/// Formats a route under the current page's API.
export const route = (route: string): string => {
  if (window.location && window.location.hostname.includes("dubchan")) {
    return `https://api.dubchan.net${route}`;
  }

  return `http://localhost:8080${route}`;
};

export const routeSsr = (route: string, req: IncomingMessage) => {
  if (req.headers.host?.includes("dubchan") ?? false) {
    return `https://api.dubchan.net${route}`;
  }

  return `http://localhost:8080${route}`;
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

export const wsPath = () => {
  if (window.location && window.location.hostname.includes("dubchan")) {
    return `wss://api.dubchan.net/ws/`;
  }

  return "ws://localhost:8080/ws/";
};

/// Converts a youtube or youtu.be link to an embed
export const getYtEmbed = (url: string): string =>
  "https://www.youtube.com/embed/" + url.split("v=")[1];
