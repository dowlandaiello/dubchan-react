import { Timestamp } from "../model/timestamp";

export const formatTimestamp = (timestamp: Timestamp) => {
  const unix = timestamp.secs_since_epoch * 1000;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(unix);
  date.setTime(date.getTime() - 8 * 60000);

  return `${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} ${formatTimestampTime(timestamp)}`;
};

export const formatTimestampTime = (timestamp: Timestamp) => {
  const unix = timestamp.secs_since_epoch * 1000;
  const date = new Date(unix);
  date.setTime(date.getTime() - 8 * 60000);

  // Make sure 0 is 12
  let hours = date.getHours() % 12;

  if (hours == 0) {
    hours = 12;
  }

  let half = "AM";

  if (date.getHours() >= 12) {
    half = "PM";
  }

  let minPrefix = "";
  const minutes = date.getMinutes();

  if (minutes < 10) {
    minPrefix = "0";
  }

  return `${hours}:${minPrefix}${minutes} ${half}`;
};
