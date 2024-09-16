const reservedKeywords = [
  'abstract',
  'else',
  'import',
  'show',
  'as',
  'enum',
  'in',
  'static',
  'assert',
  'export',
  'interface',
  'super',
  'async',
  'extends',
  'is',
  'switch',
  'await',
  'extension',
  'late',
  'sync',
  'break',
  'external',
  'library',
  'this',
  'case',
  'factory',
  'mixin',
  'throw',
  'catch',
  'false',
  'new',
  'true',
  'class',
  'final',
  'null',
  'try',
  'const',
  'finally',
  'on',
  'typedef',
  'continue',
  'for',
  'operator',
  'var',
  'covariant',
  'Function',
  'part',
  'void',
  'default',
  'get',
  'required',
  'while',
  'deferred',
  'hide',
  'rethrow',
  'with',
  'do',
  'if',
  'return',
  'yield',
  'dynamic',
  'implements',
  'set',
  'override',
];

const correctedIllegalChar: Record<string, string> = {
  S$: 'sgd',
  '₫': 'vn',
  '฿': 'th',
  '₱': 'ph',
  '៛': 'kh',
};

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

function dartIs(value: string): {
  is: { reserved: boolean; illegal: boolean };
} {
  const isReserved = reservedKeywords.includes(value);
  const illegalChar = correctedIllegalChar[value];
  return { is: { reserved: isReserved, illegal: !!illegalChar } };
}

function correctParameterNameIfInvalid(parameterName: string): {
  newValue: string;
  isInvalid?: boolean;
} {
  if (parameterName.includes(' ') || parameterName.includes('-')) {
    return {
      newValue: parameterName.replaceAll(/ /g, '_').replaceAll('-', '_'),
    };
  } else if (isNumeric(parameterName)) {
    return { newValue: 'n_' + parameterName, isInvalid: true };
  } else if (reservedKeywords.includes(parameterName)) {
    return {
      newValue: parameterName + '_',
      isInvalid: true,
    };
  } else if (parameterName.startsWith('_')) {
    return { newValue: parameterName.replace('_', ''), isInvalid: true };
  } else {
    const { is } = dartIs(parameterName);
    if (is.illegal) {
      const ret = correctedIllegalChar[parameterName];
      return { newValue: ret, isInvalid: true };
    } else {
      return { newValue: parameterName };
    }
  }
}

export { dartIs, correctParameterNameIfInvalid };
