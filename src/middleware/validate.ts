import { query } from 'express-validator';

export const commonValidate = () => {
  return [
    query('query').optional().isString().trim(),
    query('offset').optional().isNumeric(),
    query('limit').optional().isNumeric(),
  ];
};
