import { ENCRYPTION_KEY } from "./const.config";

export const EncryptionTransformerConfig = {
  key: ENCRYPTION_KEY,
  algorithm: 'aes-256-cbc',
  ivLength: 16
};