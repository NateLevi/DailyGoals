require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('/api/matches', async (req, res) => {
  const userSelection = req.query.league;
  const url = `https://www.scorebat.com/video-api/v3/feed/?token=${process.env.API_KEY}`;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let allVideos = '';

    data.response.forEach(element => {
      if (
        (userSelection === 'premier-league' && element.competition === "ENGLAND: Premier League") ||
        (userSelection === 'bundesliga' && element.competition === "GERMANY: Bundesliga") ||
        (userSelection === 'la-liga' && element.competition === "SPAIN: La Liga") ||
        (userSelection === 'serie-a' && element.competition === "ITALY: Serie A") ||
        (userSelection === 'ligue-1' && element.competition === "FRANCE: Ligue 1")
      ) {
        if (element.date.includes(formattedDate)) {
          allVideos += element.videos[0].embed;
        }
      }
    });

    res.json({ videos: allVideos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8008;

app.listen(PORT, () => {
  console.log(`The server is now running on port ${PORT}! Betta Go Catch It!`);
});