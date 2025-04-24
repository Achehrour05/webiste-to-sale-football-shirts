const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/weapons", async (req, res) => {
  try {
    const response = await axios.get("https://pubg.fandom.com/wiki/Weapons");
    const $ = cheerio.load(response.data);
    const weapons = [];

    // Look for ALL tables with class wikitable (which hold weapon data)
    $("table.wikitable").each((i, table) => {
      $(table)
        .find("tbody tr")
        .each((j, row) => {
          const nameCell = $(row).find("td").eq(0);
          const name = nameCell.text().trim();

          // Filter out rows without proper weapon names
          if (
            name &&
            !name.toLowerCase().includes("weapon") &&
            !name.includes("Agent") &&
            !name.includes("Ghost") &&
            name.length < 30
          ) {
            weapons.push(name);
          }
        });
    });

    res.json({ weapons });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
