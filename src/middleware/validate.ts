import { query } from 'express-validator';

export const commonValidate = () => {
  return [
    query('name').optional().isString().trim(),
    query('offset').optional().isNumeric(),
    query('limit').optional().isNumeric(),
  ];
};
