import { GoogleSpreadsheetRow } from "google-spreadsheet";

export function mapProduct(item: GoogleSpreadsheetRow<Record<string, any>>) {
    return item.toObject()
}
