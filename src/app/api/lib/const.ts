import zlib from 'zlib';

export const comprimirString = async (inputString: string): Promise<string> => {
  const buffer = Buffer.from(inputString, 'utf-8');
  return await new Promise((resolve, reject) => {
    zlib.deflate(buffer, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
};

export const descomprimirString = async (inputHex: string): Promise<string> => {
  const buffer = Buffer.from(inputHex, 'hex');
  return await new Promise((resolve, reject) => {
    zlib.inflate(buffer, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('utf-8'));
      }
    });
  });
};
