import { User } from "../model/user";
import { Timestamp } from "../model/timestamp";
import { createContext } from "react";

export const VoteContext = createContext<
  [
    { [postId: number]: number },
    (postId: number, optionId: number) => void,
    (postId: number, optionId: number) => void
  ]
>([{}, () => {}, () => {}]);

export const addVote = (postId: number, optionId: number) => {
  const now = new Date();
  let time = now.getTime();
  const expireTime = time + 1000 * 36000 * 7 * 51;
  now.setTime(expireTime);

  document.cookie = `${postId}-${optionId};expires=${now.toUTCString()}`;
};

export const removeVote = (postId: number) => {
  document.cookie = `${postId}=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

export const loadVotes = (): { [postId: number]: number } =>
  document.cookie
    .split("; ")
    .filter((s) => s.length > 0)
    .filter((s) => s.includes("-") && !s.includes("="))
    .map((pair) => pair.split("-"))
    .map(([post, vote]) => [parseInt(post), parseInt(vote)])
    .reduce((map, [post, vote]) => {
      return {
        [post]: vote,
        ...map,
      };
    }, {});

export const addIdentity = (
  serverStartTime: Timestamp,
  username: string,
  password: string,
  token: string
) => {
  const now = new Date();
  let time = now.getTime();
  const expireTime = time + 1000 * 36000 * 7;
  now.setTime(expireTime);

  document.cookie = `${username}_${password}=${token}:${
    serverStartTime.secs_since_epoch
  };expires=${now.toUTCString()}`;
};

export const removeIdentity = (username: string) => {
  document.cookie = `${username}=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

export const loadIdentities = (
  serverStartTime: Timestamp
): {
  users: { [username: string]: User };
} =>
  document.cookie
    .split("; ")
    .filter((s) => s.length > 0)
    .filter((s) => s.includes("="))
    .map((pair) => pair.split("="))
    .map(([username, token]) => [...username.split("_"), token])
    .map(([username, password, token]) => [
      username,
      password,
      token.split(":") as string[],
    ])
    .reduce(
      (map, [username, password, token]) => {
        const [tokenValue, effectiveDate, ..._]: string[] = Array.isArray(token)
          ? token
          : [token, "0"];
        const effectiveDateNorm = effectiveDate ?? "0";

        if (
          (typeof effectiveDateNorm === "number"
            ? effectiveDateNorm
            : parseInt(effectiveDateNorm)) < serverStartTime.secs_since_epoch
        ) {
          removeIdentity(username as string);

          return map;
        }

        return {
          users: {
            ...map.users,
            [username as string]: {
              username: username,
              password: password,
              token: tokenValue,
            },
          },
        };
      },
      { users: {} }
    );
