import { User } from "../model/user";
import { Timestamp } from "../model/timestamp";

export const addIdentity = (
  serverStartTime: Timestamp,
  username: string,
  token: string
) => {
  const now = new Date();
  let time = now.getTime();
  const expireTime = time + 1000 * 36000;
  now.setTime(expireTime);

  document.cookie = `${username}=${token}:${
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
    .map((pair) => pair.split("="))
    .map(([username, token]) => [username, token.split(":") as string[]])
    .reduce(
      (map, [username, token]) => {
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
            [username as string]: { username: username, token: tokenValue },
          },
        };
      },
      { users: {} }
    );
