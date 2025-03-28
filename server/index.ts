import express from 'express';
import cors from 'cors';
import azureRoutes from './routes/azure';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Azure routes
app.use('/api', azureRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
