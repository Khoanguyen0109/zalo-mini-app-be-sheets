import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

import { getDoc } from 'services/sheet';

export async function getCategories(req, res, next) {
  const sheet = (await getDoc('categories')) as GoogleSpreadsheetWorksheet;
  const data = await sheet.getRows();

  return res.status(200).json({ data });
}
