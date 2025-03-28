import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import fetch from 'node-fetch';
import { AzureSubscription, AzureResourceGroup, AzureListResponse } from '../types/azure';

const router = Router();

// Apply auth middleware first
router.use(authMiddleware);

// Then apply logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

router.get('/resources', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const response = await fetch(
      'https://management.azure.com/subscriptions?api-version=2020-01-01',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const data = await response.json() as AzureListResponse<AzureSubscription>;
    res.json(data.value);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Azure resources' });
  }
});

router.get('/subscriptions/:subscriptionId/resourceGroups', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { subscriptionId } = req.params;
  
  try {
    const response = await fetch(
      `https://management.azure.com/subscriptions/${subscriptionId}/resourcegroups?api-version=2021-04-01`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const data = await response.json() as AzureListResponse<AzureResourceGroup>;
    res.json(data.value);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource groups' });
  }
});

export default router;
