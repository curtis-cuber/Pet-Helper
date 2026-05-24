const profileUserId = new URLSearchParams(window.location.search).get('id');

function petCardHTML(post) {
  return `
    <a href="post.html?id=${post.id}" class="pet-card ${post.is_found ? 'found' : ''}">
      <img src="${post.photo_link}" alt="${post.pet_name}" onerror="this.src='https://placehold.co/400x300?text=No+Photo'" />
      <div class="pet-card-body">
        <div class="pet-card-name">${post.pet_name}</div>
        <div class="pet-card-type">${post.animal_type} &middot; ${post.color}</div>
        ${post.is_found ? '<span class="badge-found">Found!</span>' : ''}
      </div>
    </a>`;
}

async function loadProfile() {
  const currentUser = await getCurrentUser();
  const targetId = profileUserId || currentUser?.id;

  if (!targetId) { window.location.href = 'login.html'; return; }

  const isOwn = currentUser && currentUser.id === targetId;

  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', targetId).single();
  const { data: posts } = await supabase.from('posts').select('*').eq('user_id', targetId).order('created_at', { ascending: false });

  const displayName = profile?.display_name || (isOwn ? currentUser.email : 'Anonymous User');
  const avatar = profile?.avatar_url;

  document.getElementById('profile-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:32px;flex-wrap:wrap;">
      <div class="profile-avatar" id="avatar-display">
        ${avatar
          ? `<img src="${avatar}" alt="Profile photo" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" />`
          : `<div style="width:80px;height:80px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-size:2rem;font-weight:800;">${displayName[0].toUpperCase()}</div>`}
      </div>
      <div>
        <h1 style="font-size:1.6rem;font-weight:800;">${displayName}</h1>
        <p style="color:var(--text-muted);margin-top:4px;">${(posts || []).length} post${(posts || []).length !== 1 ? 's' : ''}</p>
      </div>
      ${isOwn ? `<button class="btn btn-outline" style="margin-left:auto;" onclick="document.getElementById('edit-profile').style.display='block'">Edit Profile</button>` : ''}
    </div>

    ${isOwn ? `
    <div id="edit-profile" style="display:none;" class="card" style="padding:24px;margin-bottom:28px;">
      <div style="padding:24px;">
        <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">Edit Profile</h2>
        <div id="profile-msg"></div>
        <div class="form-group">
          <label>Display Name</label>
          <input type="text" id="edit-name" value="${profile?.display_name || ''}" placeholder="Your name" />
        </div>
        <div class="form-group">
          <label>Profile Picture Link</label>
          <input type="url" id="edit-avatar" value="${profile?.avatar_url || ''}" placeholder="Paste a link to your photo" />
        </div>
        <div class="form-group">
          <label>New Password (leave blank to keep current)</label>
          <input type="password" id="edit-password" placeholder="New password" />
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="saveProfile()">Save</button>
          <button class="btn btn-outline" onclick="document.getElementById('edit-profile').style.display='none'">Cancel</button>
          <button class="btn" style="background:#FEE2E2;color:#991B1B;margin-left:auto;" onclick="deleteAccount()">Delete Account</button>
        </div>
      </div>
    </div>` : ''}

    <h2 class="section-title" style="font-size:1.2rem;margin-bottom:16px;">${isOwn ? 'Your Posts' : 'Posts'}</h2>
    ${posts && posts.length > 0
      ? `<div class="pet-grid">${posts.map(petCardHTML).join('')}</div>`
      : `<div class="empty-state"><strong>No posts yet.</strong></div>`}`;
}

async function saveProfile() {
  const name = document.getElementById('edit-name').value.trim();
  const avatar = document.getElementById('edit-avatar').value.trim();
  const password = document.getElementById('edit-password').value;
  const user = await getCurrentUser();
  const msg = document.getElementById('profile-msg');

  const { error: profileError } = await supabase.from('profiles').upsert({ user_id: user.id, display_name: name, avatar_url: avatar || null }, { onConflict: 'user_id' });

  if (profileError) { msg.innerHTML = '<div class="alert alert-error">Could not save profile.</div>'; return; }

  if (password) {
    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError) { msg.innerHTML = '<div class="alert alert-error">Profile saved but password update failed.</div>'; return; }
  }

  msg.innerHTML = '<div class="alert alert-success">Profile saved!</div>';
  setTimeout(() => window.location.reload(), 1200);
}

async function deleteAccount() {
  if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', loadProfile);
