import { EAN13Barcode } from './scan.entity';

export type ProductPurchase = {
  quantity: number;
  code: EAN13Barcode;
  name: string;
  price?: number;
};

export type Product = {
  code: EAN13Barcode;
  name: string;
  price?: number;
};

export type Purchase = {
  code: EAN13Barcode;
  quantity: number;
};
