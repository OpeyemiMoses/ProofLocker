import CryptoJS from "crypto-js";

// Generate SHA256 hash of a file
export const hashFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
      const hash = CryptoJS.SHA256(wordArray).toString();
      resolve(hash);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};