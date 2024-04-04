import express from 'express';
import { run } from './index'; 
import cors from 'cors';
const app = express();
const port = 3000;

app.use(cors())

app.get('/', (_req, res) => { // Adding an underscore can indicate an unused parameter
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

// Correct the syntax error by removing the extra parentheses and dot before the arrow function
app.get('/data', (_req, res) => {
  run().then(transactions => {
    res.json({ success: true, data: transactions });
  }).catch(error => {
    res.status(500).json({ success: false, message: error.message });
  });
});
