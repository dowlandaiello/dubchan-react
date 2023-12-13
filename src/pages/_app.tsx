import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import {
  AuthenticationContext,
  AuthenticationState,
} from "../components/AccountSelection";
import { wsPath } from "../util/http";
import {
  VoteContext,
  loadVotes,
  addVote as insertVote,
  removeVote as deleteVote,
} from "../util/cookie";
import { loadIdentities } from "../util/cookie";
import { KeyPairContext, KeyPair } from "../model/key_pair";
import { useServerStartTime, WebsocketContext } from "../util/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const [authState, setAuthState] = useState<AuthenticationState>({
    users: {},
  });
  const [voteState, setVoteState] = useState<{ [postId: number]: number }>({});
  const [keypairState, setKeypairState] = useState<{
    [username: string]: KeyPair;
  }>({});
  const [sock, setSock] = useState<WebSocket | null>(null);

  const serverStartTime = useServerStartTime();

  useEffect(() => {
    if (serverStartTime.secs_since_epoch === 0) return;

    const identities = loadIdentities(serverStartTime);
    setAuthState(identities);
  }, [serverStartTime.secs_since_epoch]);

  useEffect(() => {
    setVoteState(loadVotes);
  }, []);

  useEffect(() => {
    const sock = new WebSocket(wsPath());
    setSock(sock);
  }, []);

  const addVote = (postId: number, optionId: number) => {
    setVoteState((votes) => {
      return { ...votes, [postId]: optionId };
    });
    insertVote(postId, optionId);
  };

  const removeVote = (postId: number, choice: number) => {
    setVoteState((votes) => {
      const { [postId]: chosen, ...rest } = votes;

      if (chosen !== choice) return votes;

      return rest;
    });

    deleteVote(postId);
  };

  return (
    <AuthenticationContext.Provider value={[authState, setAuthState]}>
      <VoteContext.Provider value={[voteState, addVote, removeVote]}>
        <KeyPairContext.Provider value={[keypairState, setKeypairState]}>
          <WebsocketContext.Provider value={[sock, setSock]}>
            <Component {...pageProps} />
          </WebsocketContext.Provider>
        </KeyPairContext.Provider>
      </VoteContext.Provider>
    </AuthenticationContext.Provider>
  );
}
