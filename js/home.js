function petCardHTML(post) {
  const found = post.is_found;
  return `
    <a href="post.html?id=${post.id}" class="pet-card ${found ? 'found' : ''}">
      <img src="${post.photo_link}" alt="${post.pet_name}" onerror="this.src='https://placehold.co/400x300?text=No+Photo'" />
      <div class="pet-card-body">
        <div class="pet-card-name">${post.pet_name}</div>
        <div class="pet-card-type">${post.animal_type} &middot; ${post.color}</div>
        ${found ? '<span class="badge-found">Found!</span>' : ''}
      </div>
    </a>`;
}

async function loadRecentPosts() {
  const grid = document.getElementById('recent-grid');
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error || !posts || posts.length === 0) {
    grid.innerHTML = '<div class="empty-state"><strong>No posts yet.</strong><p>Be the first to report a lost pet.</p></div>';
    return;
  }
  grid.innerHTML = posts.map(petCardHTML).join('');
}

async function loadTrending() {
  const grid = document.getElementById('trending-grid');
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .gte('created_at', weekAgo)
    .order('view_count', { ascending: false })
    .limit(3);

  if (error || !posts || posts.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No trending posts this week yet.</p></div>';
    return;
  }
  grid.innerHTML = posts.map(petCardHTML).join('');
}

async function loadStats() {
  const { count: total } = await supabase.from('posts').select('*', { count: 'exact', head: true });
  const { count: found } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('is_found', true);
  document.getElementById('stat-total').textContent = total ?? '—';
  document.getElementById('stat-found').textContent = found ?? '—';
}

document.addEventListener('DOMContentLoaded', async () => {
  loadRecentPosts();
  loadTrending();
  loadStats();

  const loc = await getIPLocation();
  if (loc && loc.city) {
    document.getElementById('hero-title').textContent = `Help Find Lost Pets in ${loc.city}`;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('posted') === 'true') {
    const postId = params.get('postId');
    if (postId) document.getElementById('view-post-btn').href = `post.html?id=${postId}`;
    document.getElementById('success-modal').style.display = 'flex';
    history.replaceState(null, '', 'index.html');
  }
});
