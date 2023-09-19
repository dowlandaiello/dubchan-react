import { Timestamp } from "../model/timestamp";
import { formatTimestamp } from "../util/format";
import style from "./TimestampLabel.module.css";

/// A representation of a timestamp.
export const TimestampLabel = ({ timestamp }: { timestamp: Timestamp }) => (
  <p className={style.label}>{formatTimestamp(timestamp)}</p>
);
