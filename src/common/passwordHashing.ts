import { config } from '../../config';
const cryptoJS = require('crypto-js');

export class passwordHasing {

  encryption(data: any) {
    return new Promise((resolve, reject) => {
      try {

        if (!data) {
          console.log("Encryption Error: Input data is undefined.");
          return reject("Input data is undefined");
        }

        const encryptedData = cryptoJS.AES.encrypt(JSON.stringify(data), process.env.AES_SECRETKEY, { mode: cryptoJS.mode.ECB, padding: cryptoJS.pad.Pkcs7 });

        console.log(encryptedData.toString());

        return resolve(encryptedData.toString());

      } catch (error) {
        console.log(`\nEncryption catch error ->> ${error}`);
        return reject(error);
      }
    });
  }


  decryption(data: any) {
    return new Promise((resolve, reject) => {
      try {

        if (!data) {
          console.log("Decryption Error: Input data is empty or undefined.");
          return reject("Input data is empty or undefined.");
        }

        if (typeof data !== 'string') {
          console.log("Converting data to string for decryption...");
          data = data.toString();
        }

        const secretKey = process.env.AES_SECRETKEY;
        if (!secretKey) {
          console.log("Decryption Error: AES secret key is not provided.");
          return reject("AES secret key is not provided.");
        }

        const decryptedData = cryptoJS.AES.decrypt(data, secretKey, { mode: cryptoJS.mode.ECB, padding: cryptoJS.pad.Pkcs7 });
        const decryptedString = decryptedData.toString(cryptoJS.enc.Utf8);

        // Check if decrypted data is empty
        if (!decryptedString) {
          console.log("Decryption Error: Decrypted data is empty.",decryptedString);
          return reject("Decrypted data is empty.");
        }

        // Parse decrypted data and resolve
        const parsedData = JSON.parse(decryptedString);
        return resolve(parsedData);
      } catch (error) {
        console.log("Decryption Error:", error.message);
        return reject(error.message);
      }
    });
  }


  passwordHashing(password: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        return resolve(cryptoJS.SHA256(password).toString());
      } catch (error) {
        console.log(`\nPasswordHashing catch error ->> ${error}`);
        return reject(error);
      }
    });
  }
}
