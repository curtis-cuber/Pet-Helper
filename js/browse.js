let allPosts = [];
let browseMap = null;

function petCardHTML(post) {
  const found = post.is_found;
  return `
    <a href="post.html?id=${post.id}" class="pet-card ${found ? 'found' : ''}">
      <img src="${post.photo_link || ''}" alt="${post.pet_name}" onerror="this.src='https://placehold.co/400x300?text=No+Photo'" />
      <div class="pet-card-body">
        <div class="pet-card-name">${post.pet_name}</div>
        <div class="pet-card-type">${post.animal_type} &middot; ${post.color}</div>
        ${found ? '<span class="badge-found">Found!</span>' : ''}
      </div>
    </a>`;
}

function renderPosts(posts) {
  const grid = document.getElementById('posts-grid');
  if (!posts || posts.length === 0) {
    grid.innerHTML = '<div class="empty-state"><strong>No posts found.</strong><p>Try a different search or filter.</p></div>';
    return;
  }
  grid.innerHTML = posts.map(petCardHTML).join('');
}

function filterPosts() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const type = document.getElementById('type-filter').value;
  const days = parseInt(document.getElementById('time-filter').value) || 0;
  const location = document.getElementById('location-filter').value.toLowerCase();
  const cutoff = days ? new Date(Date.now() - days * 86400000) : null;

  const filtered = allPosts.filter(p => {
    const matchName = p.pet_name.toLowerCase().includes(search);
    const matchType = !type || p.animal_type === type;
    const matchTime = !cutoff || new Date(p.created_at) >= cutoff;
    const matchLocation = !location || p.last_seen_location.toLowerCase().includes(location);
    return matchName && matchType && matchTime && matchLocation;
  });
  renderPosts(filtered);
}

async function loadPosts() {
  const { data: posts, error } = await supabase
    .from('posts').select('*').order('created_at', { ascending: false });
  if (error) {
    document.getElementById('posts-grid').innerHTML =
      '<div class="empty-state"><strong>Could not load posts.</strong></div>';
    return;
  }
  allPosts = posts || [];
  renderPosts(allPosts);
}

function setView(view) {
  const isMap = view === 'map';
  document.getElementById('list-view').style.display = isMap ? 'none' : 'block';
  document.getElementById('map-view').style.display = isMap ? 'block' : 'none';
  document.getElementById('btn-list').classList.toggle('active', !isMap);
  document.getElementById('btn-map').classList.toggle('active', isMap);
  if (isMap && !browseMap) initBrowseMap();
}

async function initBrowseMap() {
  const ipLoc = await getIPLocation();
  const center = (ipLoc && ipLoc.latitude) ? [ipLoc.latitude, ipLoc.longitude] : [39.5, -98.35];
  const zoom = (ipLoc && ipLoc.latitude) ? 11 : 4;
  browseMap = L.map('browse-map').setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(browseMap);

  for (const post of allPosts) {
    if (!post.last_seen_location) continue;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(post.last_seen_location)}&format=json&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const color = post.is_found ? 'green' : 'red';
        const marker = L.circleMarker([lat, lon], { color, radius: 8, fillOpacity: 0.8 }).addTo(browseMap);
        marker.bindPopup(`<strong>${post.pet_name}</strong><br>${post.animal_type} &middot; ${post.color}`);
      }
    } catch { /* skip if geocode fails */ }
  }
}

document.getElementById('near-me-btn').addEventListener('click', () => {
  if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    if (!browseMap) return;
    browseMap.setView([pos.coords.latitude, pos.coords.longitude], 13);
  }, () => alert('Could not get your location.'));
});

document.addEventListener('DOMContentLoaded', async () => {
  loadPosts();
  document.getElementById('search-input').addEventListener('input', filterPosts);
  document.getElementById('type-filter').addEventListener('change', filterPosts);
  document.getElementById('time-filter').addEventListener('change', filterPosts);
  document.getElementById('location-filter').addEventListener('input', filterPosts);

  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'map') setView('map');

  // Auto-fill location filter from IP and zoom map if already open
  const loc = await getIPLocation();
  if (loc && loc.city) {
    const locationInput = document.getElementById('location-filter');
    if (!locationInput.value) {
      locationInput.value = loc.city;
      filterPosts();
    }
    if (browseMap && loc.latitude && loc.longitude) {
      browseMap.setView([loc.latitude, loc.longitude], 11);
    }
  }
});
