import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const userPrompt = async (songs) => {
  return `
    You love the following songs: ${songs.join(', ')}.
    Based on their style, mood, and genre, recommend 5 similar songs that the user might enjoy.
    
    Instructions:
    - Consider elements like mood, instrumentation, tempo, and lyrical themes.
    - Suggest a diverse yet relevant mix (not just songs from the same artist).
    - Balance well-known and hidden gem recommendations.
    - Keep your response concise, listing the 5 song titles along with their artists.
    
    Example Input:
    "Let Down" by Radiohead, "Sunsetz" by Cigarettes After Sex, "Unintended" by Muse
    
    Example Output:
    "Fade Into You" – Mazzy Star
    "Epitaph" – King Crimson
    "The Night We Met" – Lord Huron
    "Motion Picture Soundtrack" – Radiohead
    "Space Song" – Beach House
  `;
};

const promptToAI = async (songs) => {
  const user_prompt = await userPrompt(songs);
  const system_prompt = `
  You are a music recommendation AI with deep knowledge of various genres, moods, and artist similarities. A customer will provide you with 1–3 songs they love, and your job is to analyze their style, mood, and genre, then recommend 5 similar songs they might enjoy.
  `;

  return [
    {
      role: 'system',
      content: system_prompt,
    },
    {
      role: 'user',
      content: user_prompt,
    },
  ];
};

const getRecommendations = async (songs) => {
  try {
    setLoading(true);
    const prompt = await promptToAI(songs);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: prompt,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return 'Error generating recommendations. Please try again.';
  } finally {
    setLoading(false);
  }
};

const setLoading = (isLoading) => {
  const button = document.getElementById('submitButton');
  const loadingText = document.getElementById('loadingText');
  const content = document.getElementById('content');

  if (isLoading) {
    button.disabled = true;
    loadingText.textContent =
      'Analyzing songs and generating recommendations... Please wait.';
    loadingText.style.display = 'block';
    content.style.opacity = '0.5';
    button.textContent = 'Generating...';
  } else {
    button.disabled = false;
    loadingText.style.display = 'none';
    content.style.opacity = '1';
    button.textContent = 'Get Recommendations';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('songForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const songInput = document.getElementById('songInput');
    const songs = songInput.value
      .trim()
      .split(',')
      .map((song) => song.trim());

    if (songs.length === 0 || songs[0] === '') {
      alert('Please enter at least one song');
      return;
    }

    setLoading(true);

    // Simulate API call (replace with your actual API call)
    setTimeout(() => {
      const recommendations = [
        {
          title: 'Nude',
          artist: 'Radiohead',
          description: 'A hauntingly beautiful track with emotional depth.',
        },
        {
          title: 'Fade Into You',
          artist: 'Mazzy Star',
          description: 'A dreamy and melancholic classic.',
        },
        {
          title: 'Creep',
          artist: 'Scala & Kolacny Brothers',
          description: 'A haunting choral cover of the Radiohead classic.',
        },
        {
          title: 'Breathe Me',
          artist: 'Sia',
          description: 'A deeply emotional and intimate song.',
        },
        {
          title: 'The Night We Met',
          artist: 'Lord Huron',
          description: 'A nostalgic and heart-wrenching ballad.',
        },
      ];

      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-center">Your Recommendations</h2>
        <div class="space-y-3">
          ${recommendations
            .map(
              (rec) => `
            <div class="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-all">
              <p class="text-lg font-semibold">"${rec.title}" – ${rec.artist}</p>
              <p class="text-sm text-gray-300">${rec.description}</p>
            </div>
          `
            )
            .join('')}
        </div>
      `;

      setLoading(false);
      contentDiv.classList.remove('hidden');
      contentDiv.classList.add('fade-in');
    }, 2000); // Simulate 2-second delay
  });
});
