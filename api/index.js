import express from 'express';
import lineWebhook from './app/lineWebhook.js';
import clock from './cron/clock.js';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/lineWebhook', async (req, res) => { await lineWebhook(req, res) });

app.get('/clock', async (req, res) => { await clock(req, res) });

app.get('/test', (req, res) => {
  const env = process.env.TEST;
  res.send(env);
});

export default app;