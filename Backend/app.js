// index.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if not exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// MySQL setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // replace with your MySQL user
  password: 'Ak@#12345',        // replace with your MySQL password
  database: 'resume_portol',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Create submissions table if not exists
const tableQuery = `
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  positionApplied VARCHAR(100),
  resumePath VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
db.query(tableQuery);

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akashkatte316@gmail.com',
    pass: 'gsqcehbvsbcxpqzb',
  },
});

// Upload Resume
app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
  const { name, email, positionApplied } = req.body;
  const resumePath = req.file.path;

  const sql = 'INSERT INTO submissions (name, email, positionApplied, resumePath) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, positionApplied, resumePath], (err, result) => {
    if (err) {
      console.error('DB Insert Error:', err);
      return res.status(500).json({ error: 'Database Error' });
    }

    // Send email to admin
    const mailOptionsAdmin = {
      from: 'akashkatte316@gmail.com',
      to: 'akashkatte.sknscoe.entc@gmail.com',
      subject: `New Resume Submitted by ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Position:</strong> ${positionApplied}</p>`,
      attachments: [
        {
          filename: req.file.originalname,
          path: resumePath,
        },
      ],
    };

    // Confirmation email to user
    const mailOptionsUser = {
      from: 'akashkatte316@gmail.com',
      to: email,
      subject: 'Resume Received - Thank you!',
      html: `<p>Dear ${name},</p><p>Thank you for applying for the position of <strong>${positionApplied}</strong>.</p><p>We have received your resume and will be in touch if there’s a match.</p>`
    };

    transporter.sendMail(mailOptionsAdmin, (err, info) => {
      if (err) console.error('Email to Admin Error:', err);
      else console.log('Email to Admin sent:', info.response);
    });

    transporter.sendMail(mailOptionsUser, (err, info) => {
      if (err) console.error('Email to User Error:', err);
      else console.log('Email to User sent:', info.response);
    });

    res.status(200).json({ message: 'Resume uploaded and email sent' });
  });
});

// Get all submissions
app.get('/api/submissions', (req, res) => {
  const sql = 'SELECT * FROM submissions ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fetch Error:', err);
      return res.status(500).json({ error: 'Database Error' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));