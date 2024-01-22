import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export function mapProduct(item: GoogleSpreadsheetRow<Record<string, any>>) {
  return {
    ...item.toObject(),
    image: item
      .get('image')
      .split(',')
      .map((item) => ({ image: item })),
  };
}

export function mapArray(items: GoogleSpreadsheetRow<Record<string, any>>[]) {
  return items.map((item) => item.toObject());
}
