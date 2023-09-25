import { routeSsr } from "./http";
import { User } from "../model/user";
import { IncomingMessage } from "http";

export const useServerStartTimeSsr = async (req: IncomingMessage) => {
  const startedAt = await (await fetch(routeSsr("/admin/started_at", req)))
    .json()
    .catch(() => {
      return { secs_since_epoch: 0, nanos_since_epoch: 0 };
    });

  return startedAt;
};

export const useIdentitiesSsr = async (
  req: IncomingMessage
): Promise<{ users: { [username: string]: User } }> => {
  const cookies = req.headers.cookie ?? "";
  const serverStartTime = await useServerStartTimeSsr(req);

  return cookies
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
};
