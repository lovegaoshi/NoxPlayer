export default async (url: string, params?: RequestInit) => {
  console.log(params);
  return fetch(url);
};
