function showMessage(text, type) {
  document.getElementById('form-message').innerHTML = `<div class="alert alert-${type}">${text}</div>`;
  window.scrollTo(0, 0);
}

function getDraftData() {
  return {
    pet_name: document.getElementById('pet-name').value.trim(),
    animal_type: document.getElementById('animal-type').value,
    color: document.getElementById('color').value.trim(),
    date_missing: document.getElementById('date-missing').value,
    photo_link: document.getElementById('photo-link').value.trim() || null,
    description: document.getElementById('description').value.trim(),
    last_seen_location: document.getElementById('last-seen').value.trim(),
    contact_info: document.getElementById('contact-info').value.trim(),
    pet_age: document.getElementById('pet-age').value.trim() || null,
    pet_size: document.getElementById('pet-size').value || null,
    urgency: document.getElementById('urgency').value,
    reward: document.getElementById('reward').value.trim() || null,
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach listeners immediately — don't wait for IP lookup
  document.getElementById('preview-btn').addEventListener('click', () => {
    sessionStorage.setItem('poster-draft', JSON.stringify(getDraftData()));
    window.location.href = 'preview.html';
  });

  document.getElementById('poster-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Posting...';

    if (typeof supabase === 'undefined') {
      showMessage('Supabase is not configured. Check your environment variables and redeploy.', 'error');
      btn.disabled = false;
      btn.textContent = 'Post Alert';
      return;
    }

    let result;
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out — check your Supabase URL and anon key in Vercel environment variables.')), 8000)
      );
      result = await Promise.race([
        supabase.from('posts').insert({ ...getDraftData(), is_found: false }).select().single(),
        timeout
      ]);
    } catch (err) {
      showMessage('Error: ' + err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'Post Alert';
      return;
    }

    const { data, error } = result;
    if (error) {
      showMessage('Error: ' + error.message, 'error');
      btn.disabled = false;
      btn.textContent = 'Post Alert';
    } else {
      window.location.href = `index.html?posted=true&postId=${data.id}`;
    }
  });

  // Pre-fill location placeholder in the background after listeners are set
  getIPLocation().then(loc => {
    if (loc && loc.city) {
      const field = document.getElementById('last-seen');
      if (!field.value) field.placeholder = `e.g. Corner of Main St, ${loc.city}`;
    }
  });
});
