import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { getDoc } from 'services/sheet';
import getCurrentDateWithTimezone from 'utils/getCurrentDayFormatTimezone';
import { v4 as uuidv4 } from 'uuid';

export async function getCurrentCart(req, res, next) {
  const { userId } = req.params;
  const sheet = (await getDoc('carts')) as GoogleSpreadsheetWorksheet;
  const cart = (await sheet.getRows()).find((item) => item.get('user_id') === userId);
  return res.status(200).json({ data: { cartId: cart.get('id') } });
}

export async function getCartDetail(req, res, next) {
  const { userId, cartId } = req.params;
  const sheet = (await getDoc('cart_items')) as GoogleSpreadsheetWorksheet;
  const cartDetail = (await sheet.getRows()).filter((item) => item.get('cart_id') === cartId) || [];
  return res.status(200).json({ data: { ...cartDetail } });
}

export async function createCart(req, res, next) {
  const { userId } = req.params;

  const { total, items } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('carts')) as GoogleSpreadsheetWorksheet;
  const cartId = uuidv4();
  const row = {
    id: cartId,
    user_id: userId,
    created_at: getCurrentDateWithTimezone(),
    total,
  };
  await sheet.addRow(row);
  const cartDetail = items.map((item) => ({
    id: uuidv4(),
    created_at: getCurrentDateWithTimezone(),
    cart_id: cartId,
    ...item,
  }));
  const sheetDetail = (await getDoc('cart_items')) as GoogleSpreadsheetWorksheet;
  await sheetDetail.addRows(cartDetail);
  return res.status(200).json({ data: { ...row, items: cartDetail } });
}

export async function addProductToCart(req, res, next) {
  const { cartId } = req.params;
  const { user_id, items } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('carts')) as GoogleSpreadsheetWorksheet;
  const rows = await sheet.getRows();
  const rowIndex = rows.findIndex((item) => item.get('id') === cartId);
  let cartDetail = [];
  if (rowIndex !== -1) {
    rows[rowIndex].set('total', parseInt(rows[rowIndex].get('total')) + items.length);
    const sheetDetail = (await getDoc('cart_items')) as GoogleSpreadsheetWorksheet;
    cartDetail = items.map((item) => ({
      id: uuidv4(),
      created_at: getCurrentDateWithTimezone(),
      cart_id: cartId,
      user_id,
      ...item,
    }));
    await sheetDetail.addRows(cartDetail);
  }

  return res.status(200).json({ data: { ...rows[rowIndex], items: cartDetail } });
}

export async function removeProductFromCart(req, res, next) {
  const { cartId } = req.params;
  const { user_id, itemIds } = req.body;
  const sheet = (await getDoc('carts')) as GoogleSpreadsheetWorksheet;
  const sheetDetail = (await getDoc('cart_items')) as GoogleSpreadsheetWorksheet;

  const rows = await sheet.getRows();
  const rowIndex = rows.findIndex((item) => item.get('id') === cartId);
  if (rowIndex !== -1) {
    if (parseInt(rows[rowIndex].get('total')) - itemIds.length === 0) {
      rows[rowIndex].delete();
    } else {
      rows[rowIndex].set('total', parseInt(rows[rowIndex].get('total')) - itemIds.length);
    }
    const itemRows = await sheetDetail.getRows();
    const deleteIndex = [];
    itemIds.map((id) => {
      const index = itemRows.findIndex((i) => i.get('cart_id') === id);
      deleteIndex.push(itemRows[index].delete());
    });

    await Promise.all(deleteIndex);
    return res.status(200).json({ message: 'success' });
  }
}

export async function clearCart() {}
