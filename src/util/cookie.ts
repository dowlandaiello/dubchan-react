import { User } from "../model/user";

export const addIdentity = (username: string, token: string) => {
  const now = new Date();
  let time = now.getTime();
  const expireTime = time + 1000 * 36000;
  now.setTime(expireTime);

  document.cookie = `${username}=${token};expires=${now.toUTCString()}`;
};

export const removeIdentity = (username: string) => {
  document.cookie = `${username}=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

export const loadIdentities = (): {
  users: { [username: string]: User };
} =>
  document.cookie
    .split("; ")
    .filter((s) => s.length > 0)
    .map((pair) => pair.split("="))
    .reduce(
      (map, [username, token]) => {
        return {
          ...map,
          users: {
            ...map.users,
            [username]: { username: username, token: token },
          },
        };
      },
      { users: {} }
    );
