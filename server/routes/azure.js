import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import fetch from 'node-fetch';

const router = Router();

// Apply auth middleware first
router.use(authMiddleware);

// Then apply logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Throttle map: key is IP, value is { until: Date, last429: Date }
const throttleMap = new Map();
const THROTTLE_DURATION_MS = 60 * 1000; // 1 minute throttle after 429

function throttleMiddleware(req, res, next) {
  const ip = req.ip;
  const throttleInfo = throttleMap.get(ip);
  if (throttleInfo && throttleInfo.until > Date.now()) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  next();
}

router.use(throttleMiddleware);

async function handleAzureFetch(req, res, url, options, onSuccess) {
  const ip = req.ip;
  try {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const throttleDuration = response.headers.get('Retry-After') * 1000 || THROTTLE_DURATION_MS;
      throttleMap.set(ip, { until: Date.now() + throttleDuration, last429: Date.now() });
      console.warn(`Throttling request from ${ip} to ${url}`);
      console.log(response.headers);
      return res.status(429).json({ error: 'Too many requests to Azure. Please try again later.' });
    }
    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Azure' });
  }
}

router.get('/resources', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  await handleAzureFetch(
    req, res,
    'https://management.azure.com/subscriptions?api-version=2020-01-01',
    { headers: { Authorization: `Bearer ${token}` } },
    (data) => res.json(data.value)
  );
});

router.get('/subscriptions/:subscriptionId/resourceGroups', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { subscriptionId } = req.params;
  await handleAzureFetch(
    req, res,
    `https://management.azure.com/subscriptions/${subscriptionId}/resourcegroups?api-version=2021-04-01`,
    { headers: { Authorization: `Bearer ${token}` } },
    (data) => res.json(data.value)
  );
});

router.get('/roles', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  await handleAzureFetch(
    req, res,
    'https://management.azure.com/providers/Microsoft.Authorization/roleDefinitions?api-version=2022-04-01',
    { headers: { Authorization: `Bearer ${token}` } },
    (data) => {
      const roles = data.value.map((role) => ({
        id: role.name,
        roleName: role.properties.roleName,
        description: role.properties.description,
        type: role.properties.type === 'BuiltInRole' ? 'BuiltInRole' : 'CustomRole'
      }));
      res.json(roles);
    }
  );
});


export default router;
