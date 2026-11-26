const form = document.getElementById('search-form');
const input = document.getElementById('country-input');
const btn = document.getElementById('search-btn');
const statusEl = document.getElementById('status');
const tbody = document.getElementById('uni-body');

let cachedDataset = null;

async function fetchFromHipolabs(country) {
  const url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function fetchFromHttpsMirror(country) {
  if (!cachedDataset) {
    const res = await fetch(
      'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'
    );
    if (!res.ok) throw new Error(`Mirror HTTP ${res.status}`);
    cachedDataset = await res.json();
  }
  const q = country.trim().toLowerCase();
  return cachedDataset.filter((u) => u.country && u.country.toLowerCase() === q);
}

function renderUniversities(list, country, sourceLabel) {
  tbody.innerHTML = '';

  if (!list.length) {
    statusEl.textContent = `No universities found for "${country}". Try another country name (e.g. India, United States, United Kingdom).`;
    return;
  }

  statusEl.textContent = `Showing ${list.length} universities in ${country} (${sourceLabel})`;

  list.forEach((uni, index) => {
    const tr = document.createElement('tr');
    const state = uni['state-province'] || 'N/A';
    const website = Array.isArray(uni.web_pages) && uni.web_pages.length ? uni.web_pages[0] : '#';

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(uni.name)}</td>
      <td>${escapeHtml(state)}</td>
      <td>${
        website !== '#'
          ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(website)}</a>`
          : 'N/A'
      }</td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function searchUniversities(country) {
  btn.disabled = true;
  btn.textContent = 'Searching...';
  statusEl.textContent = `Fetching universities in "${country}"...`;
  tbody.innerHTML = '';

  try {
    const data = await fetchFromHipolabs(country);
    renderUniversities(data, country, 'Hipolabs API');
  } catch (err) {
    try {
      const data = await fetchFromHttpsMirror(country);
      renderUniversities(data, country, 'Hipo GitHub JSON API');
    } catch (err2) {
      statusEl.textContent = `Error fetching universities: ${err2.message}`;
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Search Universities';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const country = input.value.trim();
  if (country) searchUniversities(country);
});

searchUniversities('India');
