import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import {
  AuthenticationContext,
  AuthenticationState,
} from "../components/AccountSelection";
import {
  VoteContext,
  loadVotes,
  addVote as insertVote,
  removeVote as deleteVote,
} from "../util/cookie";
import { loadIdentities } from "../util/cookie";
import { useServerStartTime } from "../util/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const [authState, setAuthState] = useState<AuthenticationState>({
    users: {},
  });
  const [voteState, setVoteState] = useState<{ [postId: number]: number }>({});

  const serverStartTime = useServerStartTime();

  useEffect(() => {
    if (serverStartTime.secs_since_epoch === 0) return;

    const identities = loadIdentities(serverStartTime);
    setAuthState(identities);
  }, [serverStartTime.secs_since_epoch]);

  useEffect(() => {
    setVoteState(loadVotes);
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
        <Component {...pageProps} />
      </VoteContext.Provider>
    </AuthenticationContext.Provider>
  );
}
