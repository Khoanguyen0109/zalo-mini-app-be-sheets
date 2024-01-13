import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';

export async function getBanners(req, res, next) {
  const sheet = (await getDoc('banners')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).map((item) => item.toObject());
  return res.status(200).json({ data });
}

export async function getScoreRank(req, res, next) {
  const sheet = (await getDoc('score')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).map((item) => item.toObject());
  return res.status(200).json({ data });
}
