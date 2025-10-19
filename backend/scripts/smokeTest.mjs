const base = 'http://localhost:5000';

const log = (label, v) => console.log('\n=== ' + label + ' ===\n', v);

try {
  // GET /
  const root = await fetch(base + '/');
  log('GET /', await root.text());

  // Register
  const registerRes = await fetch(base + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'smoketest@example.com', password: 'password', name: 'Smoke Test' }),
  });
  log('register status', registerRes.status);
  try { log('register body', await registerRes.json()); } catch(e) { log('register body', 'no-json'); }

  // Login
  const loginRes = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'smoketest@example.com', password: 'password' }),
  });
  log('login status', loginRes.status);
  const loginJson = await loginRes.json();
  log('login body', loginJson);
  const token = loginJson.token;
  if (!token) {
    console.error('No token returned, aborting smoke test');
    process.exit(1);
  }

  // Create room (no auth required in current setup)
  const roomRes = await fetch(base + '/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: 301, floor: 3, status: 'Vacant', price: 150 }),
  });
  log('create room status', roomRes.status);
  const roomJson = await roomRes.json();
  log('create room body', roomJson);

  // Create booking (authenticated)
  const bookingRes = await fetch(base + '/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ roomId: roomJson.id, checkIn: new Date().toISOString(), checkOut: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString() }),
  });
  log('create booking status', bookingRes.status);
  const bookingJson = await bookingRes.json();
  log('create booking body', bookingJson);

  // List bookings
  const listRes = await fetch(base + '/api/bookings', { headers: { Authorization: 'Bearer ' + token } });
  log('list bookings status', listRes.status);
  log('list bookings body', await listRes.json());

  console.log('\nSmoke test completed.');
} catch (err) {
  console.error('Smoke test error:', err);
  process.exit(1);
}
