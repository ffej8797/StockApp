import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  const env = process.env.TEST;
  res.send(env);
});

export default app;