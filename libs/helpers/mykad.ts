const REGION_SOUTHEAST_ASIA = 'SOUTHEAST_ASIA';
const REGION_BRITISH_ISLES = 'BRITISH_ISLES';
const REGION_SOVIET_REPUBLIC = 'SOVIET_REPUBLIC';
const REGION_EAST_ASIA = 'EAST_ASIA';
const REGION_SOUTH_ASIA = 'SOUTH_ASIA';
const REGION_AFRICA = 'AFRICA';
const REGION_SOUTH_AMERICA = 'SOUTH_AMERICA';
const REGION_NORTH_AMERICA = 'NORTH_AMERICA';
const REGION_OCEANIA = 'OCEANIA';
const REGION_MIDDLE_EAST = 'MIDDLE_EAST';
const REGION_EUROPE = 'EUROPE';
const REGION_MIDDLE_AMERICA = 'MIDDLE_AMERICA';
const REGION_MISCELLANEOUS = 'MISCELLANEOUS';

const countryCodePairs = {
  '60': { country: 'BN', region: REGION_SOUTHEAST_ASIA },
  '61': { country: 'ID', region: REGION_SOUTHEAST_ASIA },
  '62': { country: 'KH', region: REGION_SOUTHEAST_ASIA },
  '63': { country: 'LA', region: REGION_SOUTHEAST_ASIA },
  '64': { country: 'MM', region: REGION_SOUTHEAST_ASIA },
  '65': { country: 'PH', region: REGION_SOUTHEAST_ASIA },
  '66': { country: 'SG', region: REGION_SOUTHEAST_ASIA },
  '67': { country: 'TH', region: REGION_SOUTHEAST_ASIA },
  '68': { country: 'VN', region: REGION_SOUTHEAST_ASIA },

  '71': { country: 'FOREIGN_UNKNOWN', region: null },
  '72': { country: 'FOREIGN_UNKNOWN', region: null },

  '74': { country: 'CN', region: REGION_EAST_ASIA },
  '75': { country: 'IN', region: REGION_SOUTH_ASIA },
  '76': { country: 'PK', region: REGION_SOUTH_ASIA },
  '77': { country: 'SA', region: REGION_MIDDLE_EAST },
  '78': { country: 'LK', region: REGION_SOUTH_ASIA },
  '79': { country: 'BD', region: REGION_SOUTH_ASIA },

  '83': {
    country: 'AS|AU|CX|CC|CK|FJ|PF|GU|HM|MH|FM|NC|NZ|NU|NF|PG|TL|TK|UM|WF',
    region: REGION_OCEANIA,
  },
  '84': {
    country: 'AI|AR|AW|BO|BR|CL|CO|EC|GF|GP|GY|PY|PE|GS|ST|UY|VE',
    region: REGION_SOUTH_AMERICA,
  },
  '85': {
    country:
      'DZ|AO|BW|BI|CM|CF|CG|CD|DG|EG|ER|ET|GA|GM|GN|KE|LR|MW|ML|MR|YT|' +
      'MA|MZ|NA|NE|NG|RW|RE|SN|SL|SO|SD|SZ|TZ|TG|TO|TN|UG|ME|ZR|ZM|ZW',
    region: REGION_AFRICA,
  },
  '86': {
    country:
      'AM|AT|BE|CY|DK|FO|FR|FI|DE|DD|GR|VA|IT|LU|' +
      'MK|MT|MC|NL|NO|PT|MD|SK|SI|ES|SE|CH|GG|JE|IM',
    region: REGION_EUROPE,
  },
  '87': {
    country: 'GB|IE',
    region: REGION_BRITISH_ISLES,
  },
  '88': {
    country: 'BH|IR|IQ|PS|JO|KW|OM|QA|YE|SY|TR|YE|YD|',
    region: REGION_MIDDLE_EAST,
  },
  '89': {
    country: 'JP|KP|KR|TW',
    region: REGION_EAST_ASIA,
  },
  '90': {
    country:
      'BS|BB|BZ|CR|CU|DM|DO|SV|GD|GT|HT|HN|' +
      'JM|MQ|MX|NI|PA|PR|KN|LC|VC|TT|TC|VI',
    region: REGION_MIDDLE_AMERICA,
  },
  '91': {
    country: 'CA|GL|AN|PM|US',
    region: REGION_NORTH_AMERICA,
  },
  '92': {
    country: 'AL|BY|BA|BG|HR|CZ|CS|EE|GE|HU|LV|LT|ME|PL|XK|RO|RU|RS|UA',
    region: REGION_SOVIET_REPUBLIC,
  },
  '93': {
    country:
      'AF|AD|AQ|AG|AZ|BJ|BM|BT|IO|BF|CV|KY|KM|DY|GQ|TF|GI|GW|HK|' +
      'IS|CI|KZ|KI|KG|LS|LY|LI|MO|MG|MV|MU|MN|MS|NR|NP|MP|PW|PS|' +
      'PN|SH|LC|VC|WS|SM|ST|SC|SB|SJ|TJ|TM|TV|HV|UZ|VU|VA|VG|YU',
    region: REGION_MISCELLANEOUS,
  },

  '98': { country: 'STATELESS', region: null },
  '99': { country: 'UNSPECIFIED', region: null },
};

function numisBetween(num, lower, upper) {
  return (num - lower) * (num - upper) <= 0;
}

function isMalaysia(code) {
  return numisBetween(code, 1, 16) || numisBetween(code, 21, 59) || code == 82;
}

function isForeign(code) {
  return countryCodePairs[code] != undefined;
}

function isValidRegion(code) {
  return isMalaysia(code) || isForeign(code);
}

// Check if date is before disregarding year.
function dateIsBefore(before, max) {
  const bNorm = new Date(0, before.getMonth(), before.getDate());
  const mNorm = new Date(0, max.getMonth(), max.getDate());

  return bNorm < mNorm;
}

function codeToDate(year, month, day): Date | null {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  const age = today.getFullYear() - birthDate.getFullYear();

  // Works for now. Update this in year 2099.
  // For same year, checks if date has passed.
  if (age > 100 || (age == 100 && dateIsBefore(birthDate, today))) {
    birthDate.setFullYear(birthDate.getFullYear() + 100);
  }

  // Check valid date.
  if (birthDate.getDate() == day && birthDate.getMonth() == month - 1) {
    return birthDate;
  }
  return null;
}

function codeToGender(code) {
  return code % 2 === 0 ? 'female' : 'male';
}

function extractParts(icNum) {
  const regex = /^(\d{2})(\d{2})(\d{2})-?(\d{2})-?(\d{3})(\d{1})$/;
  const parts = icNum.match(regex);

  if (!parts) {
    throw new Error('Invalid MyKad number format');
  }

  return parts;
}

function isValid(icNum) {
  let parts;

  try {
    parts = extractParts(icNum);
  } catch (error) {
    return false;
  }

  const birthDate = codeToDate(parts[1], parts[2], parts[3]);
  return !!birthDate && isValidRegion(parts[4]);
}

type MyKadParseResults = {
  birthDate: Date;
  gender: 'female' | 'male';
};

function parse(
  icNum,
  cb?: (error: unknown, data: MyKadParseResults) => MyKadParseResults,
): MyKadParseResults | null {
  let parts;

  try {
    parts = extractParts(icNum);
  } catch (error) {
    if (!cb) throw error;
    return cb(error, null);
  }

  const parsedData: MyKadParseResults = {
    birthDate: codeToDate(parts[1], parts[2], parts[3]),
    gender: codeToGender(parts[6]),
  };

  if (cb) {
    return cb(null, parsedData);
  }

  return parsedData;
}

export const myKad = {
  isValid,
  parse,
};
