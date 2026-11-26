const categorySelect = document.getElementById('category-select');
const fetchBtn = document.getElementById('fetch-btn');
const badgeEl = document.getElementById('joke-badge');
const setupEl = document.getElementById('joke-setup');
const deliveryEl = document.getElementById('joke-delivery');
const sourceEl = document.getElementById('api-source');

async function fetchJoke() {
  const category = categorySelect.value;
  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Loading...';
  badgeEl.textContent = category;
  setupEl.textContent = 'Fetching a joke...';
  deliveryEl.textContent = '';
  sourceEl.textContent = '';

  try {
    // Primary: CORS-enabled JokeAPI v2
    const res = await fetch(`https://v2.jokeapi.dev/joke/${encodeURIComponent(category)}?safe-mode`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    badgeEl.textContent = data.category || category;
    if (data.type === 'twopart') {
      setupEl.textContent = data.setup;
      deliveryEl.textContent = data.delivery;
    } else {
      setupEl.textContent = data.joke;
      deliveryEl.textContent = '';
    }
    sourceEl.textContent = 'Source: https://v2.jokeapi.dev';
  } catch (err) {
    // Secondary: Official Joke API
    try {
      const endpoint =
        category === 'Programming'
          ? 'https://official-joke-api.appspot.com/jokes/programming/random'
          : 'https://official-joke-api.appspot.com/random_joke';
      const res2 = await fetch(endpoint);
      if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
      const raw = await res2.json();
      const joke = Array.isArray(raw) ? raw[0] : raw;

      badgeEl.textContent = joke.type || 'general';
      setupEl.textContent = joke.setup;
      deliveryEl.textContent = joke.punchline;
      sourceEl.textContent = 'Source: https://official-joke-api.appspot.com';
    } catch (err2) {
      badgeEl.textContent = 'Error';
      setupEl.textContent = 'Unable to reach joke APIs. Please check your internet connection.';
      deliveryEl.textContent = err2.message;
    }
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Get Random Joke';
  }
}

fetchBtn.addEventListener('click', fetchJoke);
fetchJoke();
