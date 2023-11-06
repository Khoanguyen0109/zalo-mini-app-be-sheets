import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

import { getDoc } from 'services/sheet';
import { fullTextSearch } from 'utils';
import getCurrentDateWithTimezone from 'utils/getCurrentDayFormatTimezone';
import { mapProduct } from 'services/products';

export async function getOrders(req, res) {
  const { query, offset, limit } = req.query;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('orders')) as GoogleSpreadsheetWorksheet;
  let data = [];
  switch (true) {
    case Boolean(query):
      const array = await sheet.getRows();
      data = fullTextSearch(array, query);
      break;
    default:
      data = await sheet.getRows({ offset: offset, limit: limit });
      break;
  }
  const total = sheet.gridProperties.rowCount;

  return res.status(200).json({ data, total });
}

export async function getOrdersByUser(req, res) {
  const { userId } = req.params;
  const { query, offset = 0, limit = 10 } = req.query;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('orders')) as GoogleSpreadsheetWorksheet;

  const data = (await sheet.getRows()).filter((item) => item.get('user_id') === userId);

  const total = sheet.gridProperties.rowCount;

  return res.status(200).json({ data: data.map((item) => mapProduct(item)), total });
}

export async function getOrderDetail(req, res, next) {
  const { orderId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('orders')) as GoogleSpreadsheetWorksheet;

  const array = await sheet.getRows();
  const doc = array.find((item) => item.get('id') === orderId);
  if (doc) {
    const sheetDetail = (await getDoc('order_details')) as GoogleSpreadsheetWorksheet;
    const arrayDetail = await sheetDetail.getRows();

    const detail = arrayDetail.filter((item) => item.get('order_id') === orderId);
    return res.status(200).json({
      data: {
        ...doc.toObject(),
        detail: detail.map((item) => ({ product: item.toObject(), quantity: item.get('quantity') })),
      },
    });
  }
  return res.status(404).json({ message: 'Not Found' });
}

export async function createOrder(req, res, next) {
  const { orderId: orderIdParams, userId, discountId, items, user, total, paymentMethod, address, note } = req.body;
  const orderId = orderIdParams || nanoid();
  const sheetUser = (await getDoc('users')) as GoogleSpreadsheetWorksheet;
  const userExist = (await sheetUser.getRows()).find((item) => item.get('id') === userId);
  if (!userExist) {
    await sheetUser.addRow({
      id: user.id,
      name: user.name,
      idByOA: user.idByOA,
      phone: user?.phone,
    });
  }

  const sheet = (await getDoc('orders')) as GoogleSpreadsheetWorksheet;
  const row = {
    id: orderId,
    user_id: userId,
    discount_id: discountId,
    total,
    payment_method: paymentMethod,
    note,
    address,
    created_at: getCurrentDateWithTimezone(),
  };

  await sheet.addRow(row);
  const orderDetail = items.map((item) => ({
    id: uuidv4(),
    created_at: getCurrentDateWithTimezone(),
    order_id: orderId,
    user_id: userId,
    ...item,
  }));
  const sheetDetail = (await getDoc('order_details')) as GoogleSpreadsheetWorksheet;
  await sheetDetail.addRows(orderDetail);

  return res.status(200).json({ data: 'success' });
}
