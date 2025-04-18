// utils/encryption.js (AES Encryption Helper)
// Encrypt and decrypt diary content using user's password

import CryptoJS from "crypto-js";

export const encryptContent = (content, key) => {
  return CryptoJS.AES.encrypt(content, key).toString();
};

export const decryptContent = (encryptedContent, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
