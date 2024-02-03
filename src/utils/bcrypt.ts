import * as bcrypt from 'bcrypt';

export async function encrypt(text) {
  return await bcrypt.hash(text, 10);
}

export async function compare(text, hash) {
  return await bcrypt.compare(text, hash);
}
