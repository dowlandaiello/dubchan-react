import { routeSsr } from "./http";
import { User } from "../model/user";
import { IncomingMessage } from "http";
import { useState, useEffect } from "react";
import { Timestamp } from "../model/timestamp";
import { cookies } from "next/headers";

export const useServerStartTimeSsr = (req: IncomingMessage) => {
  const [serverStartTime, setServerStartTime] = useState<Timestamp>({
    secs_since_epoch: 0,
    nanos_since_epoch: 0,
  });

  useEffect(() => {
    (async () => {
      const startedAt = await (await fetch(routeSsr("/admin/started_at", req)))
        .json()
        .catch(() => {
          return { secs_since_epoch: 0, nanos_since_epoch: 0 };
        });
      setServerStartTime(startedAt);
    })();
  }, []);

  return serverStartTime;
};

export const useIdentitiesSsr = (
  req: IncomingMessage
): { users: { [username: string]: User } } => {
  const cookieStore = cookies();
  const serverStartTime = useServerStartTimeSsr(req);

  return cookieStore
    .getAll()
    .filter((s) => s.value.length > 0)
    .map((pair) => [pair.name, pair.value])
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
