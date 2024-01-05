import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

import { getDoc } from 'services/sheet';
import { fullTextSearch } from 'utils';
import { isNumber } from 'lodash';
import { mapArray, mapProduct } from 'services/products';
import { omit } from 'lodash';
export async function getProducts(req, res, next) {
  const { query, name, offset, limit, categories } = req.query;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const sheet = (await getDoc('products')) as GoogleSpreadsheetWorksheet;
  let data = [];
  const total = sheet?.gridProperties?.rowCount - 1;
  if (total) {
    switch (true) {
      case Boolean(query):
        const array = await sheet.getRows();
        data = fullTextSearch(array, query);
        break;
      case Boolean(categories):
        data = (await sheet.getRows()).filter((item) => item.get('category_id'));
        break;
      case isNumber(offset) && isNumber(limit):
        data = await sheet.getRows({ offset: offset, limit: limit });
        break;
      default:
        data = await sheet.getRows();
        break;
    }
  }

  return res.status(200).json({ data: data.map((item) => mapProduct(item)), total });
}

export async function getProductDetail(req, res, next) {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('products')) as GoogleSpreadsheetWorksheet;

  const array = await sheet.getRows();
  const doc = array.find((item) => item.get('id') === id);
  if (doc) {
    if (doc.get('has_inventories')) {
      const sheetDetail = (await getDoc('product_inventories')) as GoogleSpreadsheetWorksheet;
      const arrayDetail = await sheetDetail.getRows();

      const detail = arrayDetail.filter((item) => item.get('product_id') === id);
      const groupVariants = detail.reduce((acc, item) => {
        const object = omit(item.toObject(), [
          'id',
          'product_id',
          'inventory_quantity',
          'discount',
          'price',
          'image',
          'active',
          'created_at',
          'updated_at',
          'deleted_at',
        ]);

        for (const [key, value] of Object.entries(object)) {
          if (value !== '') {
            if (acc[key]) {
              if (!acc[key].includes(value)) {
                acc[key].push(value);
              }
            } else {
              acc[key] = [value];
            }
          }
        }

        return acc;
      }, {});
      return res.status(200).json({
        data: {
          ...doc.toObject(),
          image: doc
            .get('image')
            .split(',')
            .map((item) => ({ image: item })),
          inventories: mapArray(detail),
          variants: groupVariants,
        },
      });
    } else {
      return res.status(200).json({
        data: {
          ...doc.toObject(),
          image: doc
            .get('image')
            .split(',')
            .map((item) => ({ image: item })),
          inventories: [],
          variants: [],
        },
      });
    }
  }
  return res.status(404).json({ message: 'Not Found' });
}
