import { Timestamp } from "../model/timestamp";
import { route } from "./http";
import {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

export const WebsocketContext = createContext<
  [WebSocket | null, Dispatch<SetStateAction<WebSocket>>]
>([null, () => {}]);

export const useSocket = () => {
  const [ctx] = useContext(WebsocketContext);

  if (ctx === null) return null;

  return ctx;
};

export const useServerStartTime = () => {
  const [serverStartTime, setServerStartTime] = useState<Timestamp>({
    secs_since_epoch: 0,
    nanos_since_epoch: 0,
  });

  useEffect(() => {
    if (serverStartTime.secs_since_epoch != 0) return;

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
