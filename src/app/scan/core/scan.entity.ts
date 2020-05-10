export function isValidBarcode(barcode: string): boolean {
  if (barcode.length !== 13) {
    return false;
  } else {
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
  }
}
