require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dns = require('node:dns');

// Basic Configuration
const port = process.env.PORT || 3000;
const options = {
  all: true
}

var url_store = {};
var url_num = 0;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// When any URL is accessed, we first parse the POST request, then pass info to log the request info and print to console
app.use(bodyParser.urlencoded({extended: false}), bodyParser.json(), (req, res, next) => {
  console.log(req.body);
  console.log(req.method + ' ' + req.path + ' - ' + req.ip);
  next();
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  console.log("================================================");
  console.log(req.body.url);
  let retJson = {};

  let http_check = req.body.url.substr(0, 4);
  let https_check = req.body.url.substr(0, 5);

  // console.log(http_check);
  // console.log(https_check);

  if (http_check != "http" && https_check != "https") {
    res.json({ error: "Invalid URL" });
  } else {
      // dns.lookup(req.body.url, options, (err, addresses) => {
      //   if (err) {
      //     console.log(err);
      //     res.json({ error: "Invalid URL" });
      //   };

      //   console.log(addresses);
      // });

      // Store the url in url_store for later use
      url_store[url_num] = req.body.url;

      // Set return JSON
      retJson.original_url = req.body.url;
      retJson.short_url = url_num;

      // Update url number
      url_num += 1;

      // Return JSON
      res.json(retJson);
  }
})

app.get('/api/shorturl/:short_url', (req, res) => {
  let short_url = req.params.short_url;
  console.log(url_store);

  res.redirect(url_store[short_url]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
