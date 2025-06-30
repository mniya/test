import express from 'express';
import cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Endpoint to fetch F1 schedule data
app.get('/api/schedule', async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const url = `https://www.formula1.com/en/racing/${year}.html`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const races = [];
    $('.race-item').each((i, elem) => {
      const round = $(elem).find('.race-countdown .f1-wide--s').text().trim();
      const name = $(elem).find('.event-title').text().trim();
      const date = $(elem).find('.full-date').text().trim();
      races.push({ round, name, date });
    });

    res.json({ year, races });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
