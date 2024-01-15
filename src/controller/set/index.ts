import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';

export async function getSettings(req, res, next) {
  const sheet = (await getDoc('settings')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).map((item) => item.toObject());
  return res.status(200).json({ data });
}
