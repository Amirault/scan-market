import { EAN13Barcode } from './scan.entity';

export const productFakeData = [
  {
    name: 'Brioche Tranchée',
    code: (3270190207924 as unknown) as EAN13Barcode,
    price: 0.75,
  },
  {
    name: 'Eau minérale naturelle',
    code: (3257971309114 as unknown) as EAN13Barcode,
    price: 1.5,
  },
];
