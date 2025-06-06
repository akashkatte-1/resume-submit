# 📄 Resume Submission Portal

A full-stack web application that allows users to upload resumes for job applications. Admins can view submitted resumes, and both applicants and admins receive email notifications upon submission.

---

## 🚀 Tech Stack

- **Frontend:** Angular, Bootstrap
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Email Service:** Nodemailer (Gmail SMTP)

---

## 📁 Project Structure

```
Resume_Submission_Portal/
├── backend/               # Express server & API
│   ├── uploads/           # Stores uploaded resumes
│   └── index.js           # Main backend logic
├── frontend/              # Angular app
│   └── src/app/
│       ├── upload-form/   # Upload form component
│       └── submissions/   # Admin submission list
```

---

## 🛠 Setup Instructions

### 1. 🔧 Backend Setup

```bash
cd backend
npm install
```

**Create MySQL DB:**
```sql
CREATE DATABASE resume_portal;
USE resume_portal;

CREATE TABLE submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  positionApplied VARCHAR(255),
  resumePath VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Start Backend Server:**
```bash
node index.js
```

> 🔐 Make sure to set up your Gmail application password (see below).

---

### 2. 🌐 Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Visit: `http://localhost:4200`

---

## 📤 Upload Resume

### Fields:
- Name
- Email
- Position Applied
- Resume (PDF)

On submit:
- Resume saved on server
- Data saved to MySQL
- Email sent to Admin and User

---

## 📧 Email Configuration (Gmail App Password)

If you use Gmail:
1. Enable **2-Step Verification** on your Google account.
2. Create an **App Password** from your Google Account.
3. Replace the password in `index.js`:

```js
auth: {
  user: 'your-email@gmail.com',
  pass: 'your-app-password'
}
```

📚 [How to create an App Password](https://support.google.com/accounts/answer/185833)

---

## 📋 Features

- Resume Upload with File Validation
- Resume Download/View Option
- Admin View of All Submissions
- Responsive UI with Bootstrap
- Email Notification to Admin & Applicant
- MySQL Database Integration

---

## 📦 Dependencies

- express
- multer
- mysql
- path
- fs
- nodemailer
- cors
- body-parser
- Angular CLI

---


## 🙋‍♀️ Author

**Akash**  
Made with ❤️ 