const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const bignumberError = '[BigNumber Error] '
const BASE = 1e14
const LOG_BASE = 14
const MAX_SAFE_INTEGER = 0x1fffffffffffff         // 2^53 - 1
// const MAX_INT32 = 0x7fffffff                   // 2^31 - 1
const POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13]
const SQRT_BASE = 1e7
const MAX = 1E9
const MIN_EXP = -1e7
const MAX_EXP = 1e7

export function BigNumber(n, b) {
  var alphabet, c, e, i, isNum, len, str,
    x = this;

  // Enable constructor usage without new.
  if (!(x instanceof BigNumber)) {

    // Don't throw on constructor call without new (#81).
    // '[BigNumber Error] Constructor call without new: {n}'
    //throw Error(bignumberError + ' Constructor call without new: ' + n);
    return new BigNumber(n, b);
  }

  if (b == null) {

    // Duplicate.
    if (n instanceof BigNumber) {
      x.s = n.s;
      x.e = n.e;
      x.c = (n = n.c) ? n.slice() : n;
      return;
    }

    isNum = typeof n == 'number';

    if (isNum && n * 0 == 0) {

      // Use `1 / n` to handle minus zero also.
      x.s = 1 / n < 0 ? (n = -n, -1) : 1;

      // Faster path for integers.
      if (n === ~~n) {
        for (e = 0, i = n; i >= 10; i /= 10, e++);
        x.e = e;
        x.c = [n];
        return;
      }

      str = n + '';
    } else {
      if (!isNumeric.test(str = n + '')) return parseNumeric(x, str, isNum);
      x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
    }

  } else {

    // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
    intCheck(b, 2, ALPHABET.length, 'Base');
    str = n + '';

    // Allow exponential notation to be used with base 10 argument, while
    // also rounding to DECIMAL_PLACES as with other bases.
    if (b == 10) {
      x = new BigNumber(n instanceof BigNumber ? n : str);
      return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
    }

    isNum = typeof n == 'number';

    if (isNum) {

      // Avoid potential interpretation of Infinity and NaN as base 44+ values.
      if (n * 0 != 0) return parseNumeric(x, str, isNum, b);

      x.s = 1 / n < 0 ? (str = str.slice(1), -1) : 1;

      // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
      if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
        throw Error
          (tooManyDigits + n);
      }

      // Prevent later check for length on converted number.
      isNum = false;
    } else {
      x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;

      // Allow e.g. hexadecimal 'FF' as well as 'ff'.
      if (b > 10 && b < 37) str = str.toLowerCase();
    }

    alphabet = ALPHABET.slice(0, b);
    e = i = 0;

    // Check that str is a valid base b number.
    // Don't use RegExp so alphabet can contain special characters.
    for (len = str.length; i < len; i++) {
      if (alphabet.indexOf(c = str.charAt(i)) < 0) {
        if (c == '.') {

          // If '.' is not the first character and it has not be found before.
          if (i > e) {
            e = len;
            continue;
          }
        }

        return parseNumeric(x, n + '', isNum, b);
      }
    }

    str = convertBase(str, b, 10, x.s);
  }

  // Decimal point?
  if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

  // Exponential form?
  if ((i = str.search(/e/i)) > 0) {

    // Determine exponent.
    if (e < 0) e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {

    // Integer.
    e = str.length;
  }

  // Determine leading zeros.
  for (i = 0; str.charCodeAt(i) === 48; i++);

  // Determine trailing zeros.
  for (len = str.length; str.charCodeAt(--len) === 48;);

  str = str.slice(i, ++len);

  if (str) {
    len -= i;

    // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
    if (isNum && BigNumber.DEBUG &&
      len > 15 && (n > MAX_SAFE_INTEGER || n !== mathfloor(n))) {
      throw Error
        (tooManyDigits + (x.s * n));
    }

    e = e - i - 1;

    // Overflow?
    if (e > MAX_EXP) {

      // Infinity.
      x.c = x.e = null;

      // Underflow?
    } else if (e < MIN_EXP) {

      // Zero.
      x.c = [x.e = 0];
    } else {
      x.e = e;
      x.c = [];

      // Transform base

      // e is the base 10 exponent.
      // i is where to slice str to get the first element of the coefficient array.
      i = (e + 1) % LOG_BASE;
      if (e < 0) i += LOG_BASE;

      if (i < len) {
        if (i) x.c.push(+str.slice(0, i));

        for (len -= LOG_BASE; i < len;) {
          x.c.push(+str.slice(i, i += LOG_BASE));
        }

        str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }

      for (; i--; str += '0');
      x.c.push(+str);
    }
  } else {

    // Zero.
    x.c = [x.e = 0];
  }
}

function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== (n < 0 ? mathceil(n) : mathfloor(n))) {
    throw Error
     (bignumberError + (name || 'Argument') + (typeof n == 'number'
       ? n < min || n > max ? ' out of range: ' : ' not an integer: '
       : ' not a primitive number: ') + n);
  }
}