import { Request, Response, NextFunction } from 'express';

import { getDoc } from 'services/sheet';

export async function getProducts(req: Request, res: Response) {
  const { name } = req.query;
  const sheet = (await getDoc('products')) || [];

  //   const product = sheet.find()
  console.log('sheet.', sheet);
  return res.status(200).json({ data: sheet });
}
