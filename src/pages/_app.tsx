import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import {
  AuthenticationContext,
  AuthenticationState,
} from "../components/AccountSelection";
import { loadIdentities } from "../util/cookie";
import { useServerStartTime } from "../util/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const [authState, setAuthState] = useState<AuthenticationState>({
    users: {},
  });

  const serverStartTime = useServerStartTime();

  useEffect(() => {
    if (serverStartTime.secs_since_epoch === 0) return;

    const identities = loadIdentities(serverStartTime);
    setAuthState(identities);
  }, [serverStartTime.secs_since_epoch]);

  return (
    <AuthenticationContext.Provider value={[authState, setAuthState]}>
      <Component {...pageProps} />
    </AuthenticationContext.Provider>
  );
}
