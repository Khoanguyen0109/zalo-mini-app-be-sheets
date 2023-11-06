import { validationResult } from 'express-validator';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { v4 as uuidv4 } from 'uuid';

import { getDoc } from 'services/sheet';
import { STATUS } from 'utils/constants';
import getCurrentDateWithTimezone from 'utils/getCurrentDayFormatTimezone';

export async function addUserAddress(req, res, next) {
  const { userId } = req.params;
  const { address, province, district, ward, phone, name, type } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  const sheet = (await getDoc('user_addresses')) as GoogleSpreadsheetWorksheet;
  const newAddress = {
    id: uuidv4(),
    address,
    province,
    district,
    ward,
    phone,
    name,
    user_id: userId,
    type,
    status: STATUS.ACTIVE,
    created_at: getCurrentDateWithTimezone(),
  };
  await sheet.addRow(newAddress);
  return res.status(200).json({ data: newAddress });
}

export async function getUserAddress(req, res, next) {
  const { userId } = req.params;
  const sheet = (await getDoc('user_addresses')) as GoogleSpreadsheetWorksheet;
  const data = (await sheet.getRows()).filter((item) => item.get('user_id') === userId).map((item) => item.toObject());
  return res.status(200).json({ data });
}

export async function updateUserAddress(req, res, next) {
  const { userId, addressId } = req.params;
  const sheet = (await getDoc('user_addresses')) as GoogleSpreadsheetWorksheet;
  const rows = await sheet.getRows();
  const dataIndex = rows.findIndex((item) => item.get('user_id') === userId && item.get('id') === addressId);

  rows[dataIndex].assign({ ...req.body });
  await rows[dataIndex].save();
  return res.status(200).json({ data: { ...rows[dataIndex].toObject(), ...req.body } });
}
