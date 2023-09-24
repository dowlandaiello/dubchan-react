import { Timestamp } from "../model/timestamp";
import { route } from "./http";
import { useState, useEffect } from "react";

export const useServerStartTime = () => {
  const [serverStartTime, setServerStartTime] = useState<Timestamp>({
    secs_since_epoch: 0,
    nanos_since_epoch: 0,
  });

  useEffect(() => {
    (async () => {
      const startedAt = await (await fetch(route("/admin/started_at")))
        .json()
        .catch(() => {
          return { secs_since_epoch: 0, nanos_since_epoch: 0 };
        });
      setServerStartTime(startedAt);
    })();
  }, []);

  return serverStartTime;
};
