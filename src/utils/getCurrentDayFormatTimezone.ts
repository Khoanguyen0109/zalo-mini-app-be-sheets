import { DateTime } from 'luxon';

const getCurrentDateWithTimezone = (tz = 'Asia/Ho_Chi_Minh') => {
  const date = DateTime.local();

  var rezoned = date.setZone('Asia/Ho_Chi_Minh');
  return rezoned.toFormat('dd/MM/yyyy, HH:mm');
};

export default getCurrentDateWithTimezone;
