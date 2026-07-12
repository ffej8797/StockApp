import express from 'express';
import lineWebhook from './app/lineWebhook.js';

/** Middleware */
import { cronAuth } from './middleware/cronAuth.js';

/** 排程 */
import clock from './cron/clock.js';
import pushMsg_830 from './cron/pushMsg_830.js';
import stockDataWrite from './cron/stockDataWrite.js';

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

/** 排程 */
app.get('/clock', cronAuth, async (req, res) => { await clock(req, res) }); // for test
app.get('/pushMsg_830', cronAuth, async (req, res) => { await pushMsg_830(req, res) });
app.get('/stockDataWrite', cronAuth, async (req, res) => { await stockDataWrite(req, res) });

app.get('/test', (req, res) => {
  const env = process.env.TEST;
  res.send(env);
});

export default app;