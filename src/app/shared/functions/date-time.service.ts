import * as moment from "moment";
const SECONDS = 1000;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MIN = 60;
const TEN_SECONDS = 10;
export function timeSince(date: string | number | Date) {
  const seconds = Math.floor(
    (new Date().valueOf() - new Date(date).valueOf()) / SECONDS,
  );
  let interval = seconds / SECONDS_IN_DAY;
  if (interval > 1) {
    return moment(date).format('DD/MM/YYYY, HH:mm:ss');
  }
  interval = seconds / SECONDS_IN_HOUR;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / SECONDS_IN_MIN;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  if (seconds > TEN_SECONDS) {
    return 'Few seconds ago';
  }
  return 'Just now';
}
