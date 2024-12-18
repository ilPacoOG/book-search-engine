import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

export interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    console.log('No token provided');
    return { user: null }; // Return null user if no token
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    console.log('Decoded Token:', data); // Log decoded token for debugging
    return { user: data as JwtPayload }; // Return user to the context
  } catch (err) {
    const error = err as Error; // Explicitly cast to Error type
    console.log('Invalid token:', error.message);
    return { user: null };
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY;

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'UNAUTHENTICATED' } });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
