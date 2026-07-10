import express from 'express';
import lineWebhook from './app/lineWebhook.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/lineWebhook', (req, res) => { lineWebhook(req, res) });

app.get('/test', (req, res) => {
  const env = process.env.TEST;
  res.send(env);
});

export default app;