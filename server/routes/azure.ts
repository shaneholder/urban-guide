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

router.get('/roles', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await fetch(
      'https://management.azure.com/providers/Microsoft.Authorization/roleDefinitions?api-version=2022-04-01',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json() as { value: any[] };
    const roles = data.value.map((role: any) => ({
      id: role.name,
      roleName: role.properties.roleName,
      description: role.properties.description,
      type: role.properties.type === 'BuiltInRole' ? 'BuiltInRole' : 'CustomRole'
    }));

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});


export default router;
