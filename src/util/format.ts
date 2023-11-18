import { Timestamp } from "../model/timestamp";

export const timestampToUnix = (timestamp: Timestamp): number =>
  timestamp.secs_since_epoch * 1000;

export const formatTimestampRelative = (timestamp: Timestamp) => {
  const unix = timestamp.secs_since_epoch * 1000;

  const date = new Date(unix);
  const now = new Date();

  const daysSince = Math.floor(Math.abs(+date - +now) / 864e5);
  const hoursSince = Math.floor(Math.abs(+date - +now) / 36e5);
  const minutesSince = Math.floor(Math.abs(+date - +now) / 60000);
  const secondsSince = Math.floor(Math.abs(+date - +now) / 1000);

  if (daysSince == 1) return `${daysSince} day ago`;
  if (daysSince > 1) return `${daysSince} days ago`;
  if (hoursSince == 1) return `${hoursSince} hour ago`;
  if (hoursSince > 1) return `${hoursSince} hours ago`;
  if (minutesSince == 1) return `${minutesSince} minute ago`;
  if (minutesSince > 1) return `${minutesSince} minutes ago`;
  if (secondsSince == 1) return `${secondsSince} second ago`;
  return `${secondsSince} seconds ago`;
};

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
