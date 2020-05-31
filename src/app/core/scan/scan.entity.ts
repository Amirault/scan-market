const EAN13BarcodeSymbol = Symbol();
export type EAN13Barcode = string & { [EAN13BarcodeSymbol]: true };

export function parseToEAN13BarCode(
  barcode: string | undefined
): EAN13Barcode | undefined {
  if (barcode === undefined) {
    return undefined;
  } else if (validEAN13BarCode(barcode)) {
    return barcode as EAN13Barcode;
  } else {
    return undefined;
  }
}
function validEAN13BarCode(barcode: string) {
  if (barcode.length === 13) {
    const lastDigit = Number(barcode.substring(barcode.length - 1));
    if (isNaN(lastDigit)) {
      return false;
    } else {
      const arr = barcode
        .substring(0, barcode.length - 1)
        .split('')
        .reverse();
      let oddTotal = 0;
      let evenTotal = 0;

      for (let i = 0; i < arr.length; i++) {
        const n = Number(arr[i]);
        if (isNaN(n)) {
          return false;
        } else if (i % 2 === 0) {
          oddTotal += n * 3;
        } else {
          evenTotal += n;
        }
      }
      const checkSum = (10 - ((evenTotal + oddTotal) % 10)) % 10;
      return checkSum === lastDigit;
    }
  } else {
    return false;
  }
}
