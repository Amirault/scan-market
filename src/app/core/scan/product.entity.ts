import { EAN13Barcode } from './scan.entity';

export type ScannedProduct = {
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
