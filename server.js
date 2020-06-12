import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import request from "request";
import path from 'path';
const __dirname = path.resolve();

var app = express();
app.use(bodyParser.json());

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

app.get("/api/price/:id", function(req, res) {
  const url = `https://www.carrefour.fr/s?q=${req.params.id}`;
  var username = "orangefire",
    apiKey = "dPR2PywxqDrHlb1lvN0UtuHq0",// DON'T CARE TAKE IT
    auth = "Basic " + Buffer.from(username + ":" + apiKey).toString("base64");

  request(
    {
      method: 'POST',
      url: 'http://api.scraping-bot.io/scrape/raw-html',
      json: {
        url: url
      },
      headers: {
        Accept: 'application/json',
        Authorization : auth
      },
    },
    function(error, response, body) {
      res.status(200).send(body);
    }
  );
});

app.get("/api/info/:id", function(req, res) {
  fetch(`https://world.openfoodfacts.org/api/v0/product/${req.params.id}}.json`)
    .then(response => response.json())
    .then(data => {
      res.status(200).json(data);
    });
});

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'dist', 'index.html')
  );
});

if(process.env.PROD) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
