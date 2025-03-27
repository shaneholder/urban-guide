import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';

interface AzureSubscription {
  id: string;
  subscriptionId: string;
  displayName: string;
  state: string;
  subscriptionPolicies: {
    locationPlacementId: string;
    quotaId: string;
    spendingLimit: string;
  };
}

interface AzureResponse {
  value: AzureSubscription[];
}

interface ResourceGroup {
  id: string;
  name: string;
  location: string;
  type: string;
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/resources', async (req: Request, res: Response) => {
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
    
    const data = await response.json() as AzureResponse;
    res.json(data.value);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Azure resources' });
  }
});

app.get('/api/subscriptions/:subscriptionId/resourceGroups', async (req: Request, res: Response) => {
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
    
    const data = await response.json() as ResourceGroup[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resource groups' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
