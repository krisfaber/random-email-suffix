import { customAlphabet } from 'nanoid';
import { STORAGE_KEYS } from './storage-keys';

const nanoid = customAlphabet(
  '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
);

export enum GenerationMethod {
  randID = 1,
  timestamp,
}

export function generate(
  email: string,
  mode: GenerationMethod.randID,
  length: number
): string;
export function generate(
  email: string,
  mode: GenerationMethod.timestamp
): string;

export function generate(
  email: string,
  mode: GenerationMethod,
  length?: number
) {
  const [handle, domain] = email.split('@');

  const suffix = (() => {
    switch (mode) {
      case GenerationMethod.randID:
        return nanoid(length);
      case GenerationMethod.timestamp:
        return Date.now();
    }
  })();

  return `${handle}+${suffix}@${domain}`;
}

export const generateEmail = async () => {
  const { sync } = chrome.storage;

  const data = await sync.get([
    STORAGE_KEYS.email,
    STORAGE_KEYS.id_length,
    STORAGE_KEYS.generation_method,
  ]);
  
  const email = data[STORAGE_KEYS.email] || '';
  const idLength = data[STORAGE_KEYS.id_length] || 8;
  const generationMethod: GenerationMethod = data[STORAGE_KEYS.generation_method] || GenerationMethod.randID;

  if (generationMethod === GenerationMethod.randID) {
    return generate(email, generationMethod, idLength);
  }

  return generate(email, generationMethod);
};

export default generateEmail;
