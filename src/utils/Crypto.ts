// TODO: fix this
const Aes = {
  encrypt: (a: any, b: any) => crypto.subtle.encrypt('AES128CBC', a, b),
};

export { Aes };

export default {};
