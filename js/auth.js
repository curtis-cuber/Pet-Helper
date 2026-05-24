async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function updateNavAuth() {
  const user = await getCurrentUser();
  const loginLink = document.getElementById('nav-login');
  const logoutLink = document.getElementById('nav-logout');
  const profileLink = document.getElementById('nav-profile');
  if (!loginLink || !logoutLink) return;
  if (user) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'inline-block';
    if (profileLink) profileLink.style.display = 'inline-block';
  } else {
    loginLink.style.display = 'inline-block';
    logoutLink.style.display = 'none';
    if (profileLink) profileLink.style.display = 'none';
  }
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
});
