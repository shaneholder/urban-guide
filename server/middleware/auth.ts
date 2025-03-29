import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.VITE_AZURE_TENANT_ID}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
});

interface AzureToken extends JwtPayload {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  appid: string;
  appidacr: string;
  idp: string;
  oid: string;
  rh: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
}

export const authMiddleware = async (
  req: Request<any, any, any, any>, 
  res: Response<any>, 
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken || !decodedToken.header.kid) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    try {
      const key = await client.getSigningKey(decodedToken.header.kid);
      const publicKey = key.getPublicKey();

      const verified = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: 'https://management.azure.com',
        issuer: `https://sts.windows.net/${process.env.VITE_AZURE_TENANT_ID}/`        
      }) as AzureToken;

      // // Add token payload to request for use in route handlers      
      res.locals.user = verified;
            
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(401).json({ error: 'Token verification failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal authentication error' });
  }
};
