import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from "react";
import { route } from "../util/http";
import { AuthenticationContext } from "../components/AccountSelection";

export interface KeyPair {
  user_id: string;
  pub_key: string;
  priv_key: string;
}

/// A global cache of keypairs for users.
export const KeyPairContext = createContext<
  [
    { [username: string]: KeyPair },
    Dispatch<SetStateAction<{ [username: string]: KeyPair }>>
  ]
>([{}, () => {}]);

export const useKeypair = (username?: string): KeyPair | undefined => {
  const [keypairs, setKeypairs] = useContext(KeyPairContext);
  const [{ activeUser, users }] = useContext(AuthenticationContext);

  useEffect(() => {
    if (!username) return;
    if (!activeUser) return;
    if (keypairs[username]) return;

    if (username === activeUser) {
      (async () => {
        try {
          const kp = await (
            await fetch(route(`/users/${username}/keypair`), {
              headers: { Authorization: users[activeUser].token },
            })
          ).json();
          setKeypairs((keypairs) => {
            return { ...keypairs, [username ?? ""]: kp };
          });
        } catch (e) {
          console.warn(e);
        }
      })();

      return;
    }

    (async () => {
      try {
        const kp = await (
          await fetch(route(`/users/${username}/keypair`))
        ).json();
        setKeypairs((keypairs) => {
          return { ...keypairs, [username ?? ""]: kp };
        });
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [username, activeUser]);

  return keypairs[username ?? ""];
};
