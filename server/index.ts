import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

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
    
    const data = await response.json();
    res.json(data.value);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Azure resources' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
