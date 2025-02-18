const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const ollamaBaseUrl = 'http://localhost:11434/v1';
const apiKey = 'ollama';

app.post('/recommendations', async (req, res) => {
  const { songs } = req.body;

  if (!songs || songs.length === 0) {
    return res.status(400).json({ error: 'Please provide at least one song.' });
  }

  const systemPrompt = `
    You are a music recommendation AI with deep knowledge of various genres, moods, and artist similarities. 
    A customer will provide you with 1–3 songs they love, and your job is to analyze their style, mood, and genre, 
    then recommend 5 similar songs they might enjoy.
  `;

  const userPrompt = `
    You love the following songs: ${songs.join(', ')}.
    Based on their style, mood, and genre, recommend 5 similar songs that the user might enjoy.
    
    Instructions:
    - Consider elements like mood, instrumentation, tempo, and lyrical themes.
    - Suggest a diverse yet relevant mix (not just songs from the same artist).
    - Balance well-known and hidden gem recommendations.
    - Don't write anything beyond the song titles and artists.
    - Keep your response concise, listing the 5 song titles along with their artists.
    
    Example Input:
    "Song 1" by Singer/Band 1, "Song 2" by Singer/Band 2, "Song 3" by Singer/Band 3"
    
    Example Output:
    "Song 1" – Singer/Band 1
    "Song 2" – Singer/Band 2
    "Song 3" – Singer/Band 3
    "Song 4" – Singer/Band 4
    "Song 5" – Singer/Band 5
  `;

  try {
    const response = await axios.post(
      `${ollamaBaseUrl}/chat/completions`,
      {
        model: 'llama3.2',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const recommendations = response.data.choices[0].message.content;
    res.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
