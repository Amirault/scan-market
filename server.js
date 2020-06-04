var express = require("express");
var bodyParser = require("body-parser");
var fetch = require("node-fetch");
var request = require('request');

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

app.get("/price/:id", function(req, res) {
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

app.get("/info/:id", function(req, res) {
  fetch(`https://world.openfoodfacts.org/api/v0/product/${req.params.id}}.json`)
    .then(response => response.json())
    .then(data => {
      res.status(200).json(data);
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
