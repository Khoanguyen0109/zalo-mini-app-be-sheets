// import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

// export async function clearCart(cartId) {
//   const sheet = (await getDoc('carts')) as GoogleSpreadsheetWorksheet;
//   const sheetDetail = (await getDoc('cart_items')) as GoogleSpreadsheetWorksheet;

//   const rows = await sheet.getRows();
//   const rowIndex = rows.findIndex((item) => item.get('id') === cartId);
//   if (rowIndex !== -1) {
//     if (parseInt(rows[rowIndex].get('total')) - itemIds.length === 0) {
//       rows[rowIndex].delete();
//     } else {
//       rows[rowIndex].set('total', parseInt(rows[rowIndex].get('total')) - itemIds.length);
//     }
//     const itemRows = await sheetDetail.getRows();
//     const deleteIndex = [];
//     itemIds.map((id) => {
//       const index = itemRows.findIndex((i) => i.get('cart_id') === id);
//       deleteIndex.push(itemRows[index].delete());
//     });

//     await Promise.all(deleteIndex);
//     return res.status(200).json({ message: 'success' });
//   }
// }
