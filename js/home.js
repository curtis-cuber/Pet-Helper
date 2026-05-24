function daysAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

function petCardHTML(post) {
  const found = post.is_found;
  const urgent = post.urgency === 'Urgent';
  return `
    <a href="post.html?id=${post.id}" class="pet-card ${found ? 'found' : ''} ${urgent && !found ? 'urgent' : ''}">
      <img src="${post.photo_link || ''}" alt="${post.pet_name}" onerror="this.src='https://placehold.co/400x300?text=No+Photo'" />
      <div class="pet-card-body">
        <div class="pet-card-name">${post.pet_name}</div>
        <div class="pet-card-type">${post.animal_type} &middot; ${post.color}</div>
        <div class="pet-card-meta">${daysAgo(post.created_at)}</div>
        ${found ? '<span class="badge-found">Found!</span>' : ''}
        ${urgent && !found ? '<span class="badge-urgent">Urgent</span>' : ''}
      </div>
    </a>`;
}

// Wraps any promise so it resolves with {data:null, error} after 5 seconds instead of hanging
function withTimeout(promise, fallback = { data: null, error: true }) {
  const timeout = new Promise(resolve => setTimeout(() => resolve(fallback), 5000));
  return Promise.race([promise, timeout]);
}

async function loadRecentPosts() {
  const grid = document.getElementById('recent-grid');
  const { data: posts } = await withTimeout(
    supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(6)
  );
  if (!posts || posts.length === 0) {
    grid.innerHTML = '<div class="empty-state"><strong>No posts yet.</strong><p>Be the first to report a lost pet.</p></div>';
    return;
  }
  grid.innerHTML = posts.map(petCardHTML).join('');
}

async function loadTrending() {
  const grid = document.getElementById('trending-grid');
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: posts } = await withTimeout(
    supabase.from('posts').select('*').gte('created_at', weekAgo).order('view_count', { ascending: false }).limit(3)
  );
  if (!posts || posts.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No trending posts this week yet.</p></div>';
    return;
  }
  grid.innerHTML = posts.map(petCardHTML).join('');
}

async function loadStats() {
  const [{ count: total }, { count: found }] = await Promise.all([
    withTimeout(supabase.from('posts').select('*', { count: 'exact', head: true }), { count: null }),
    withTimeout(supabase.from('posts').select('*', { count: 'exact', head: true }).eq('is_found', true), { count: null }),
  ]);
  document.getElementById('stat-total').textContent = total ?? '—';
  document.getElementById('stat-found').textContent = found ?? '—';
}

document.addEventListener('DOMContentLoaded', () => {
  loadRecentPosts();
  loadTrending();
  loadStats();

  // Run IP lookup in background — never blocks page load
  getIPLocation().then(loc => {
    if (loc && loc.city) {
      document.getElementById('hero-title').textContent = `Help Find Lost Pets in ${loc.city}`;
    }
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('posted') === 'true') {
    const postId = params.get('postId');
    if (postId) document.getElementById('view-post-btn').href = `post.html?id=${postId}`;
    document.getElementById('success-modal').style.display = 'flex';
    history.replaceState(null, '', 'index.html');
  }
});
