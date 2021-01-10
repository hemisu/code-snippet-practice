import CryptoJS from 'crypto-js';
console.log('%c 🥓 CryptoJS: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', CryptoJS);
export function desDecryptId(word) {
  // const key = CryptoJS.enc.Utf8.parse('zh#2020#key#331#');
  const key = 'zh#2020#key#331#';
  const decrypted = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypted).toString();
}