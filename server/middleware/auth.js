import express from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const { Request, Response, NextFunction } = express;

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.VITE_AZURE_TENANT_ID}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5, // Rate limiting
  timeout: 30000 // Timeout after 30s
});

export const authMiddleware = async (
  req, 
  res, 
  next
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken || !decodedToken.header.kid) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
      const key = await client.getSigningKey(decodedToken.header.kid);
      const publicKey = key.getPublicKey();

      const verified = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: 'https://management.azure.com',
        issuer: `https://sts.windows.net/${process.env.VITE_AZURE_TENANT_ID}/`,
        clockTolerance: 30, // 30 seconds clock skew tolerance
        maxAge: '1h' // Token must not be older than 1 hour
      });

      // Check additional claims
      if (!verified.oid || !verified.tid || verified.tid !== process.env.VITE_AZURE_TENANT_ID) {
        throw new Error('Invalid token claims');
      }

      res.locals.user = verified;
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      // If token expired, redirect to login
      if (verifyError.name === 'TokenExpiredError') {
        // For API: send 401 with a flag to indicate re-authentication is needed
        return res.status(401).json({ message: 'Token expired. Please reauthenticate.', reauth: true, code: 'TOKEN_EXPIRED'  });
        // If this was a web app route, you could use:
        // return res.redirect('/login');
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
