import { AxiosResponse } from 'axios';

export function getData<T>(response: AxiosResponse<T>): T {
  return response.data;
}
