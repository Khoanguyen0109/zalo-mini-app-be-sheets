import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export function mapProduct(item: GoogleSpreadsheetRow<Record<string, any>>) {
  return item.toObject();
}

export function mapArray(items: GoogleSpreadsheetRow<Record<string, any>>[]) {
  return items.map((item) => item.toObject());
}
