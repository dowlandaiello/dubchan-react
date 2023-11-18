import { Timestamp } from "../model/timestamp";
import { formatTimestamp, formatTimestampRelative } from "../util/format";
import style from "./TimestampLabel.module.css";

/// A representation of a timestamp.
export const TimestampLabel = ({
  timestamp,
  relative,
  prefix,
}: {
  timestamp: Timestamp;
  relative?: boolean;
  prefix?: string;
}) =>
  relative ? (
    <p className={style.label}>
      {prefix || ""}
      {formatTimestampRelative(timestamp)}
    </p>
  ) : (
    <p className={style.label}>{formatTimestamp(timestamp)}</p>
  );
