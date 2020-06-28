
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'))
app.post('/api', (req, res) => {
  console.log(req.headers);
  console.log(req.query);
  console.log(req.body);
  const result = {
    headers: req.headers,
    query: req.query,
    body: req.body
  }
  res.json(result)
  // res.end('解析')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))