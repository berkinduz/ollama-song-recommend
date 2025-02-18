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

    try {
      const response = await fetch('http://localhost:3001/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songs }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      const recommendations = data.recommendations;

      const recommendationLines = recommendations.split('\n');

      const recommendationsList = document.getElementById(
        'recommendationsList'
      );
      recommendationsList.innerHTML = recommendationLines
        .map((rec, index) => {
          const [title, artist] = rec.split(' – ');
          return `
            <div class="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-all">
              <p class="text-lg font-semibold">${
                index + 1
              }. ${title} – ${artist}</p>
            </div>
          `;
        })
        .join('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
      document.getElementById('content').classList.remove('hidden');
      document.getElementById('content').classList.add('fade-in');
    }
  });
});
