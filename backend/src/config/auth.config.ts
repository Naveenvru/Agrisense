import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'google-client-id-placeholder',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret-placeholder',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
  port: parseInt(process.env.PORT || '5000', 10),
}));
