import * as bcrypt from 'bcrypt';

export async function encrypt(text) {
  return bcrypt.hash(text, 10);
}

export async function compare(text, hash) {
  return bcrypt.compare(text, hash);
}
