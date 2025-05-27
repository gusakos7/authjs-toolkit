import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verification-token';

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

  const existingToken = await getVerificationTokenByEmail(email)

  // delete token if exists
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }
  // generate a new verification token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken
}