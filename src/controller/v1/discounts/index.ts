import { DateTime } from 'luxon';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';

export async function validateVoucher(req, res, next) {
  const { voucher } = req.body;
  const sheet = (await getDoc('discount')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).find((item) => item.get('voucher') === voucher).toObject();
  const now = DateTime.now();

  if (!data || (data.expired && DateTime(data.expired) < now)) {
    return res.status(404).json({ message: 'Not Found' });
  }
  return res.status(200).json({ data });
}
