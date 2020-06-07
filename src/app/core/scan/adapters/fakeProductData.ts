import { parseToEAN13BarCode } from '../scan.entity';
import { Product } from '../product.entity';

export const productFakeData: Product[] = [
  {
    name: 'Brioche Tranchée',
    code: parseToEAN13BarCode('3270190207924'),
    price: 0.75,
  },
  {
    name: 'Eau minérale naturelle',
    code: parseToEAN13BarCode('3257971309114'),
    price: 1.5,
  },
];
