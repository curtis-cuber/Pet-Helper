const postId = new URLSearchParams(window.location.search).get('id');
let map = null;

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function daysAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

async function geocodeAndShowMap(location) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
    const data = await res.json();
    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      map = L.map('map').setView([lat, lon], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([lat, lon]).addTo(map).bindPopup('Last seen here').openPopup();
    } else {
      document.getElementById('map').innerHTML = '<p style="padding:16px;color:var(--text-muted)">Map not available for this location.</p>';
    }
  } catch {
    document.getElementById('map').innerHTML = '<p style="padding:16px;color:var(--text-muted)">Could not load map.</p>';
  }
}

async function incrementViewCount() {
  await supabase.rpc('increment_view_count', { post_id: postId });
}

async function loadPost() {
  if (!postId) { window.location.href = 'browse.html'; return; }

  const { data: post, error } = await supabase
    .from('posts').select('*').eq('id', postId).single();

  if (error || !post) {
    document.getElementById('post-content').innerHTML = '<div class="empty-state"><strong>Post not found.</strong></div>';
    return;
  }

  document.title = `${post.pet_name} – Pet Helper`;
  incrementViewCount();

  document.getElementById('post-content').innerHTML = `
    ${post.is_found ? '<div class="found-banner">This pet has been found and is home safe!</div>' : ''}
    <img class="post-detail-img" src="${post.photo_link}" alt="${post.pet_name}"
         onerror="this.src='https://placehold.co/800x400?text=No+Photo'" />
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 style="font-size:2rem;font-weight:800;">${post.pet_name}</h1>
        <p style="color:var(--text-muted);margin-top:4px;">Missing since ${daysAgo(post.date_missing)}</p>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn btn-outline" style="padding:8px 14px;font-size:0.9rem;" onclick="copyLink()">&#128279; Copy Link</button>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-item"><label>Animal Type</label><p>${post.animal_type}</p></div>
      <div class="detail-item"><label>Color</label><p>${post.color}</p></div>
      <div class="detail-item"><label>Date Missing</label><p>${formatDate(post.date_missing)}</p></div>
      <div class="detail-item"><label>Last Seen</label><p>${post.last_seen_location}</p></div>
      <div class="detail-item"><label>Contact</label><p>${post.contact_info}</p></div>
      ${post.reward ? `<div class="detail-item"><label>Reward</label><p>${post.reward}</p></div>` : ''}
      ${post.pet_age ? `<div class="detail-item"><label>Age</label><p>${post.pet_age}</p></div>` : ''}
      ${post.pet_size ? `<div class="detail-item"><label>Size</label><p>${post.pet_size}</p></div>` : ''}
    </div>
    <div class="detail-item" style="margin-bottom:20px;"><label>Description</label><p style="margin-top:6px;">${post.description}</p></div>
    <div id="map"></div>
    <div id="action-buttons" style="display:flex;gap:12px;flex-wrap:wrap;margin:20px 0;">
      ${!post.is_found ? `<button class="btn btn-green" id="found-btn">I Found This Pet</button>` : ''}
      <button class="btn" style="background:#FEE2E2;color:#991B1B;border:1px solid #FECACA;" id="report-btn">&#9888; Report Post</button>
    </div>
    <div id="action-message"></div>

    <div class="comments-section">
      <h2 class="section-title" style="font-size:1.2rem;">Tips from Neighbors</h2>
      <div id="comments-list"><div class="loading">Loading comments...</div></div>
      <form id="comment-form" style="margin-top:20px;">
        <div class="form-group">
          <label for="commenter-name">Your Name</label>
          <input type="text" id="commenter-name" required placeholder="e.g. Jane from Oak Street" />
        </div>
        <div class="form-group">
          <label for="comment-text">Your Tip</label>
          <textarea id="comment-text" required placeholder="e.g. I saw a dog matching this near the park on Monday morning."></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Leave a Tip</button>
      </form>
    </div>`;

  geocodeAndShowMap(post.last_seen_location);
  loadComments();

  const foundBtn = document.getElementById('found-btn');
  if (foundBtn) foundBtn.addEventListener('click', () => reportFound(post.pet_name));

  const reportBtn = document.getElementById('report-btn');
  if (reportBtn) reportBtn.addEventListener('click', reportPost);

  document.getElementById('comment-form').addEventListener('submit', submitComment);
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    document.getElementById('action-message').innerHTML = '<div class="alert alert-success">Link copied to clipboard!</div>';
    setTimeout(() => { document.getElementById('action-message').innerHTML = ''; }, 3000);
  });
}

async function reportFound(petName) {
  const { error } = await supabase.from('posts').update({ is_found: true }).eq('id', postId);
  if (error) {
    document.getElementById('action-message').innerHTML = '<div class="alert alert-error">Something went wrong. Please try again.</div>';
    return;
  }
  document.getElementById('action-message').innerHTML = `<div class="alert alert-success">Thank you! ${petName} has been marked as found.</div>`;
  setTimeout(() => window.location.reload(), 1500);
}

async function reportPost() {
  const { error } = await supabase.from('reports').insert({ post_id: postId });
  if (error) {
    document.getElementById('action-message').innerHTML = '<div class="alert alert-error">Could not submit report. Please try again.</div>';
  } else {
    document.getElementById('action-message').innerHTML = '<div class="alert alert-success">Post reported. An admin will review it shortly.</div>';
    document.getElementById('report-btn').disabled = true;
    document.getElementById('report-btn').textContent = 'Reported';
  }
}

async function loadComments() {
  const { data: comments } = await supabase
    .from('comments').select('*, profiles(display_name, avatar_url)')
    .eq('post_id', postId).order('created_at', { ascending: true });

  const list = document.getElementById('comments-list');
  if (!comments || comments.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No tips yet. Be the first!</p>';
    return;
  }
  list.innerHTML = comments.map(c => {
    const avatar = c.profiles?.avatar_url
      ? `<img src="${c.profiles.avatar_url}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" />`
      : `<div style="width:32px;height:32px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.85rem;">${(c.commenter_name || '?')[0].toUpperCase()}</div>`;
    return `
      <div class="comment" style="display:flex;gap:12px;align-items:flex-start;">
        ${avatar}
        <div>
          <div class="comment-author">${c.commenter_name}</div>
          <div class="comment-text">${c.comment_text}</div>
          <div class="comment-date">${formatDate(c.created_at)}</div>
        </div>
      </div>`;
  }).join('');
}

async function submitComment(e) {
  e.preventDefault();
  const name = document.getElementById('commenter-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  const { error } = await supabase.from('comments').insert({ post_id: postId, commenter_name: name, comment_text: text });
  if (error) { alert('Could not submit tip. Please try again.'); return; }
  document.getElementById('commenter-name').value = '';
  document.getElementById('comment-text').value = '';
  loadComments();
}

document.addEventListener('DOMContentLoaded', loadPost);
