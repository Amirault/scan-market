import { EAN13Barcode } from './scan.entity';

export type ScannedProduct = {
  code: EAN13Barcode;
  name: string;
  price: number;
};
