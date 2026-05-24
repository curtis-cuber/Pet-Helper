// Fetch approximate location from the user's IP address.
// Result is cached in sessionStorage so we only call the API once per tab.
async function getIPLocation() {
  const cached = sessionStorage.getItem('ip-location');
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const data = await res.json();
    const loc = {
      city: data.city || '',
      region: data.region || '',
      country: data.country_name || '',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };
    sessionStorage.setItem('ip-location', JSON.stringify(loc));
    return loc;
  } catch {
    return null;
  }
}
