const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./agreggator.db');

// --- USER ROUTES ---

// Register
app.post('/api/register', (req, res) => {
  console.log("Received request body:", req.body);
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role || 'registered'],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, email, role: role || 'registered' });
    }
  );
});

// Login (simple, no JWT/session for demo)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get(
    'SELECT id, name, email, role, avatar FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      res.json(user);
    }
  );
});

// Get all users (admin)
app.get('/api/users', (req, res) => {
  db.all('SELECT id, name, email, role, avatar FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get current user (by id, for demo)
app.get('/api/users/:id', (req, res) => {
  db.get('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [req.params.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const { name, email, avatar } = req.body;
  db.run(
    'UPDATE users SET name = ?, email = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, avatar, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// --- LISTING ROUTES ---

// Get all listings
app.get('/api/listings', (req, res) => {
  db.all('SELECT * FROM listings', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single listing
app.get('/api/listings/:id', (req, res) => {
  db.get('SELECT * FROM listings WHERE id = ?', [req.params.id], (err, listing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  });
});

// Hide or unhide a listing (admin only)
app.put('/api/listings/:id/hide', (req, res) => {
  const { hidden } = req.body; // expects { hidden: 1 } or { hidden: 0 }
  db.run(
    'UPDATE listings SET hidden = ? WHERE id = ?',
    [hidden, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// --- LISTING IMAGES ---

// Add image to listing
app.post('/api/listings/:id/images', (req, res) => {
  const { url } = req.body;
  db.run(
    'INSERT INTO listing_images (listing_id, url) VALUES (?, ?)',
    [req.params.id, url],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Delete image
app.delete('/api/listing_images/:id', (req, res) => {
  db.run('DELETE FROM listing_images WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// --- FAVORITES ---

// Get user favorites (just listing IDs)
app.get('/api/users/:id/favorites', (req, res) => {
  db.all(
    'SELECT listing_id FROM favorites WHERE user_id = ?',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      // Return as array of numbers
      console.log('Raw DB rows:', rows);
      res.json(rows.map(r => r.listing_id));
    }
  );
});

// Add favorite
app.post('/api/favorites', (req, res) => {
  const { user_id, listing_id } = req.body;
  db.run(
    'INSERT OR IGNORE INTO favorites (user_id, listing_id) VALUES (?, ?)',
    [user_id, listing_id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Remove favorite by user_id and listing_id
app.delete('/api/favorites/by-user-listing', (req, res) => {
  const { user_id, listing_id } = req.body;
  db.run(
    'DELETE FROM favorites WHERE user_id = ? AND listing_id = ?',
    [user_id, listing_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
    }
  );
});

// --- NOTIFICATIONS ---

// Get user notifications
app.get('/api/users/:id/notifications', (req, res) => {
  db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Mark notification as read
app.put('/api/notifications/:id/read', (req, res) => {
  db.run(
    'UPDATE notifications SET read = 1 WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Clear all notifications for user
app.delete('/api/users/:id/notifications', (req, res) => {
  db.run('DELETE FROM notifications WHERE user_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Restore mock notifications (admin/dev)
app.post('/api/users/:id/notifications/restore', (req, res) => {
  const user_id = req.params.id;
  const mockNotifications = [
    {
      title: 'New BMW X5 Match',
      message: 'A new BMW X5 matching your filter has been posted',
      type: 'new-listing',
      read: 0,
      listing_id: 1
    },
    {
      title: 'Price Drop Alert',
      message: 'The price for "Modern Apartment in Old Town" has dropped by €5,000',
      type: 'price-change',
      read: 0,
      listing_id: 2
    }
  ];
  const stmt = db.prepare(
    'INSERT INTO notifications (user_id, title, message, type, read, listing_id) VALUES (?, ?, ?, ?, ?, ?)'
  );
  mockNotifications.forEach(n => {
    stmt.run(user_id, n.title, n.message, n.type, n.read, n.listing_id);
  });
  stmt.finalize(err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ restored: true });
  });
});

// --- START SERVER ---
app.listen(3001, () => {
  console.log('Backend API running on http://localhost:3001');
});