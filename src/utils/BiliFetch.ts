import { parseBodyParams, DEFAULT_UA } from '@APM/utils/BiliFetch';

export default async (
  url: string,
  params: RequestInit = { method: 'GET', headers: {} },
) => {
  params.headers = new Headers({
    'User-Agent': DEFAULT_UA,
    ...params.headers,
  });
  if (
    params.body &&
    params.headers.get('Content-Type') === 'application/x-www-form-urlencoded'
  ) {
    params.body = parseBodyParams(params.body);
  }
  return fetch(url, {
    ...params,
    // 412 precondition failed
    credentials: undefined,
  });
};
