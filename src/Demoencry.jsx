import React from 'react'
import CryptoJS from "crypto-js";
export default function Demoencry() {

    const generateRandomKey = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 16; i++) {
          key += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return key;
      };
    
      const encryptData = (data, key) => {
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key,{
          mode:CryptoJS.mode.CBC,
          padding:CryptoJS.pad.Pkcs7
        }).toString();
        return ciphertext;
      };
    
      const encryptKey = (keyToEncrypt, encryptionKey) => {
        const encryptedKey = CryptoJS.AES.encrypt(keyToEncrypt, encryptionKey).toString();
        return encryptedKey;
      };
    
      const jsonData = { "example": "data" };
    
    const encryptionKey = generateRandomKey();
    
    const keyToEncrypt = generateRandomKey();
    
    // const encryptedKey = encryptKey(keyToEncrypt, encryptionKey);
    const encryptedData = encryptData(jsonData, keyToEncrypt);
    const data = {"key":keyToEncrypt,"data":encryptedData};
    
    console.log(data);
    // const ans = btoa(btoa(btoa(data)));
    const text = btoa(encryptedData);
    const ans = btoa(JSON.stringify(data));
    console.log(text);

    // console.log(encryptedKey);
    // console.log(encryptedData);

  return (
    <div>
      hi
      {/* {jsonData}
      {data}
      {ans} */}
    </div>
  )
}
