export default async (url: string, params?: RequestInit) =>
  fetch(url, {
    ...params,
    // 412 precondition failed
    credentials: undefined,
  });
