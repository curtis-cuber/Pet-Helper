let notifPanelOpen = false;

function createNotifPanel() {
  if (document.getElementById('notif-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'notif-panel';
  panel.className = 'notif-panel';
  panel.innerHTML = `
    <div class="notif-header">
      <span style="font-weight:700;">Notifications</span>
      <button class="notif-clear-btn" id="notif-clear-all">Clear all</button>
    </div>
    <div id="notif-list"><div class="loading" style="padding:20px;">Loading...</div></div>`;
  document.body.appendChild(panel);
  document.getElementById('notif-clear-all').addEventListener('click', clearAllNotifications);
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  notifPanelOpen = !notifPanelOpen;
  panel.classList.toggle('open', notifPanelOpen);
  if (notifPanelOpen) loadNotifications();
}

async function loadNotifications() {
  const list = document.getElementById('notif-list');
  const user = await getCurrentUser();

  if (!user) {
    list.innerHTML = '<p style="padding:20px;color:var(--text-muted);font-size:0.9rem;">Log in to see your notifications.</p>';
    return;
  }

  const { data: notifs } = await supabase
    .from('notifications').select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(20);

  const badge = document.getElementById('bell-badge');
  if (!notifs || notifs.length === 0) {
    list.innerHTML = '<p style="padding:20px;color:var(--text-muted);font-size:0.9rem;">No notifications yet.</p>';
    if (badge) badge.classList.remove('has-notif');
    return;
  }

  const unread = notifs.filter(n => !n.is_read);
  if (badge) badge.classList.toggle('has-notif', unread.length > 0);

  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.is_read ? '' : 'unread'}" data-id="${n.id}">
      <p class="notif-msg">${n.message}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
        <span class="notif-time">${new Date(n.created_at).toLocaleDateString()}</span>
        ${!n.is_read ? `<button class="notif-read-btn" onclick="markRead('${n.id}')">Mark read</button>` : ''}
      </div>
    </div>`).join('');
}

async function markRead(id) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  loadNotifications();
}

async function clearAllNotifications() {
  const user = await getCurrentUser();
  if (!user) return;
  await supabase.from('notifications').delete().eq('user_id', user.id);
  loadNotifications();
}

document.addEventListener('DOMContentLoaded', () => {
  createNotifPanel();

  const btn = document.getElementById('notif-btn');
  if (btn) btn.addEventListener('click', toggleNotifPanel);

  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notif-panel');
    const btn = document.getElementById('notif-btn');
    if (notifPanelOpen && panel && !panel.contains(e.target) && !btn?.contains(e.target)) {
      notifPanelOpen = false;
      panel.classList.remove('open');
    }
  });

  getCurrentUser().then(user => {
    if (user) loadNotifications();
  });
});
