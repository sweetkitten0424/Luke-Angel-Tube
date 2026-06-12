import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

// Creates /api/auth/login, /api/auth/logout, and /api/auth/callback automatically
export const GET = handleAuth({
  login: handleLogin({ returnTo: '/api/auth/sync' })
});
