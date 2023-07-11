const express = require("express");
const cors = require("cors");
const { urls } = require("./db");
const urlparser = require("url");
const dns = require("dns");
require("dotenv").config();

// basic configuration
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// sendpoint
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const dnslookup = dns.lookup(
    urlparser.parse(url).hostname,
    async (err, address) => {
      if (!address) {
        res.json({ error: "Invalid URL" });
      } else {
        const urlCount = await urls.countDocuments({});
        const urlDoc = {
          original_url: url,
          short_url: urlCount,
        };
        const result = urls.insertMany(urlDoc);
        res.json({
          original_url: url,
          short_url: urlCount,
        });
      }
    }
  );
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  let shorturl = req.params.short_url;
  const urlDoc = await urls.findOne({ short_url: shorturl });
  res.redirect(urlDoc.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
