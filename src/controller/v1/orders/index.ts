import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

import { getDoc } from 'services/sheet';
import { fullTextSearch } from 'utils';

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
  const {userId} = req.params
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


export async function getOrderDetail(req, res, next) {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('orders')) as GoogleSpreadsheetWorksheet;

  const array = await sheet.getRows();
  const doc = array.find((item) => item.get('id') === id);
  if (doc) {
    const sheetDetail = (await getDoc('order_details')) as GoogleSpreadsheetWorksheet;
    const arrayDetail = await sheetDetail.getRows();

    const detail = arrayDetail.filter((item) => item.get('product_id') === id);
    return res.status(200).json({ data: { ...doc, detail: detail } });
  }
  return res.status(404).json({ message: 'Not Found' });
}
