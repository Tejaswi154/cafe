const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '../')));

// Initialize SQLite database
const db = new sqlite3.Database('./cafe.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      phone TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create newsletter subscribers table
    db.run(`CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// API endpoint to receive contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  const sql = 'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, email, phone, message], function(err) {
    if (err) {
      console.error('Error inserting contact:', err.message);
      return res.status(500).json({ error: 'Failed to save contact message.' });
    }
    res.json({ message: 'Contact message saved successfully.', id: this.lastID });
  });
});

// API endpoint for newsletter subscription
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Please provide an email address.' });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const sql = 'INSERT OR IGNORE INTO subscribers (email) VALUES (?)';
  db.run(sql, [email], function(err) {
    if (err) {
      console.error('Error subscribing:', err.message);
      return res.status(500).json({ error: 'Failed to subscribe.' });
    }
    res.json({ message: 'Successfully subscribed to our newsletter!' });
  });
});

// API endpoint to get menu items (for future expansion)
app.get('/api/menu', (req, res) => {
  // In a real application, this would fetch from a database
  const menuItems = [
    {
      id: 1,
      name: "Espresso",
      description: "Rich and bold espresso made from freshly ground beans.",
      price: 3.50,
      category: "coffee"
    },
    {
      id: 2,
      name: "Cappuccino",
      description: "Creamy cappuccino with perfectly steamed milk and foam.",
      price: 4.75,
      category: "coffee"
    },
    {
      id: 3,
      name: "Fresh Croissants",
      description: "Buttery, flaky croissants baked fresh daily.",
      price: 2.95,
      category: "pastries"
    },
    {
      id: 4,
      name: "Earl Grey",
      description: "Classic black tea with bergamot essence.",
      price: 3.25,
      category: "tea"
    },
    {
      id: 5,
      name: "Specialty Latte",
      description: "Espresso with steamed milk and flavored syrup.",
      price: 5.25,
      category: "coffee"
    },
    {
      id: 6,
      name: "Artisan Bread",
      description: "House-made sourdough with herbs.",
      price: 4.50,
      category: "pastries"
    }
  ];
  
  res.json(menuItems);
});

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});
