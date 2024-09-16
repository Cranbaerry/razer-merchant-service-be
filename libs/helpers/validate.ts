import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
import { myKad } from '.';

export const validate = {
  phoneNo(phoneNo: string, countryCode: CountryCode) {
    return isValidPhoneNumber(phoneNo, countryCode);
  },
  email(input: string) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      input,
    );
  },
  url(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  icNo(input: string) {
    return myKad.isValid(input);
  },
};
