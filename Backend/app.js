// index.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

// Constants
const PORT = 5000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPE = 'application/pdf';

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ak@#12345', // 🔒 Replace with env vars in production
  database: 'resume_portol',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL Connection Error:', err);
    return;
  }
  console.log('MySQL connected');
});

// Create submissions table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    positionApplied VARCHAR(100),
    resumePath VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(createTableQuery);

// Multer configuration
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isValidFileType = file.mimetype === ALLOWED_FILE_TYPE;
    if (!isValidFileType) {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'akashkatte316@gmail.com',
    pass: 'gsqcehbvsbcxpqzb', // 🔒 Use environment variables in production
  },
});

// Upload resume endpoint
app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
  const { name, email, positionApplied } = req.body;
  const resumePath = req.file?.path;

  if (!name || !email || !positionApplied || !resumePath) {
    return res.status(400).json({ error: 'Missing required fields or resume file' });
  }

  const insertQuery = `
    INSERT INTO submissions (name, email, positionApplied, resumePath)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [name, email, positionApplied, resumePath], (err) => {
    if (err) {
      console.error('Database Insert Error:', err);
      return res.status(500).json({ error: 'Database insertion failed' });
    }

    // Admin email setup
    const mailOptionsAdmin = {
      from: 'akashkatte316@gmail.com',
      to: 'akashkatte.sknscoe.entc@gmail.com',
      subject: `New Resume Submitted by ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Position:</strong> ${positionApplied}</p>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: resumePath,
        },
      ],
    };

    // Confirmation email setup
    const mailOptionsUser = {
      from: 'akashkatte316@gmail.com',
      to: email,
      subject: 'Resume Received - Thank you!',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for applying for the position of <strong>${positionApplied}</strong>.</p>
        <p>We have received your resume and will be in touch if there’s a match.</p>
      `,
    };

    // Send emails
    transporter.sendMail(mailOptionsAdmin, (adminErr, adminInfo) => {
      if (adminErr) {
        console.error('Email to Admin Error:', adminErr);
      } else {
        console.log('Email to Admin sent:', adminInfo.response);
      }
    });

    transporter.sendMail(mailOptionsUser, (userErr, userInfo) => {
      if (userErr) {
        console.error('Email to User Error:', userErr);
      } else {
        console.log('Email to User sent:', userInfo.response);
      }
    });

    return res.status(200).json({ message: 'Resume uploaded and emails sent successfully' });
  });
});

// Get all submissions endpoint
app.get('/api/submissions', (req, res) => {
  const selectQuery = 'SELECT * FROM submissions ORDER BY created_at DESC';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Database Fetch Error:', err);
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }

    return res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
