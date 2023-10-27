import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

import { getDoc } from 'services/sheet';

export async function getCategories(req, res, next) {
  const sheet = (await getDoc('categories')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).map(item=>({
    id: item.get('id'),
    name: item.get('name'),
    desc: item.get('desc'),
    image: item.get('image'),
    created_at: item.get('created_at')
  }));

  return res.status(200).json({ data });
}
