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
  res.status(200).json({ product: { product_name: 'test' } })
});

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

app.get('/ngsw-worker.js', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'dist', 'ngsw-worker.js')
  );
});

app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'dist', 'index.html')
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
