import { customAlphabet } from 'nanoid';
import { STORAGE_KEYS } from './storage-keys';

const { sync } = chrome.storage;

const nanoid = customAlphabet(
  '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
);

export enum GenerationMethod {
  randID = 1,
  timestamp,
}

export const generate = (
  email: string,
  length: number,
  method: GenerationMethod
) => {
  const [handle, domain] = email.split('@');

  const suffix = (() => {
    switch (method) {
      case GenerationMethod.randID:
        return nanoid(length);
      case GenerationMethod.timestamp:
        return Date.now();
    }
  })();

  return `${handle}+${suffix}@${domain}`;
};

export const generateEmail = async () => {
  const data = await sync.get([
    STORAGE_KEYS.email,
    STORAGE_KEYS.id_length,
    STORAGE_KEYS.generation_method,
  ]);
  const email = data[STORAGE_KEYS.email] || '';
  const idLength = data[STORAGE_KEYS.id_length] || 8;
  const generationMethod: GenerationMethod =
    data[STORAGE_KEYS.generation_method] || GenerationMethod.randID;

  return generate(email, idLength || 8, generationMethod);
};

export default generateEmail;
