# E-Learning Management System - Quick Start Guide

## 🚀 Backend Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd c:\days4\Education\server
npm install
```

### Step 2: Create Database
Open MySQL and run:
```sql
CREATE DATABASE educationdb;
USE educationdb;
```

Then import the schema:
```bash
mysql -u root educationdb < database-schema.sql
```

### Step 3: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials if needed.

### Step 4: Start Backend Server
```bash
npm start
```

Server will run on: `http://localhost:5000`

---

## 📱 Frontend Setup (5 minutes)

### Step 1: Create React App
```bash
npx create-react-app education-client
cd education-client
```

### Step 2: Install Dependencies
```bash
npm install axios react-router-dom
```

### Step 3: Create API Service File
Create `src/services/api.js` with the code from `FRONTEND_SETUP.md`

### Step 4: Create Environment File
Create `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Start Frontend
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

---

## ✅ Test the System

### 1. Register Teacher Account
- Go to `http://localhost:3000`
- Click Register
- Fill: Email, Password, Name, Select "Teacher" role
- Submit

### 2. Register Student Account
- Repeat with "Student" role (or use different email)

### 3. Teacher: Create Module
- Login as teacher
- Create module with title and description
- Add PDF/video URL

### 4. Teacher: Assign Module
- Select students to assign module to
- Submit

### 5. Student: View Module
- Login as student
- See assigned module
- Mark as completed

### 6. Teacher: Create Quiz
- Create quiz with title and questions
- Add multiple-choice questions with correct answers
- Assign to module

### 7. Student: Take Quiz
- Open quiz
- Answer all questions
- Submit and see score

### 8: View Progress
- Student: See "My Progress" dashboard
- Teacher: See "Class Statistics" and "Student Progress"

---

## 📁 File Structure Summary

```
server/
├── index.js                      # Main server file
├── package.json                  # Dependencies
├── .env.example                  # Environment template
├── config/
│   └── db.js                    # MySQL connection pool
├── controllers/
│   ├── userController.js        # Auth logic
│   ├── moduleController.js      # Module management
│   ├── quizController.js        # Quiz management
│   └── progressController.js    # Analytics
├── middleware/
│   └── authMiddleware.js        # JWT & role checks
├── Routes/
│   ├── userRoutes.js
│   ├── moduleRoutes.js
│   ├── quizRoutes.js
│   └── progressRoutes.js
├── database-schema.sql          # SQL schema
├── README.md                    # Full documentation
├── API_DOCUMENTATION.md         # API reference
└── FRONTEND_SETUP.md            # React guide
```

---

## 🔑 Important Passwords & Keys

**Default MySQL:**
- User: `root`
- Password: (empty)
- Database: `educationdb`

**Default JWT Secret:**
- Change in production!
- Set in `.env` → `JWT_SECRET`

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Users (teachers & students) |
| `modules` | Learning content |
| `student_modules` | Student enrollment & progress |
| `quizzes` | Quiz metadata |
| `quiz_questions` | Quiz questions |
| `quiz_attempts` | Student quiz submissions |
| `student_answers` | Individual answers |

---

## 🔐 Authentication Flow

1. User registers → Password hashed → User stored in DB
2. User logs in → Password verified → JWT token returned
3. Token stored in browser → Added to all API requests
4. Server validates token → Grants access to protected endpoints
5. Token expires → User needs to login again (7 days default)

---

## 👥 Role-Based Access

| Endpoint | Teacher | Student |
|----------|---------|---------|
| Create module | ✅ | ❌ |
| View assigned modules | ❌ | ✅ |
| Create quiz | ✅ | ❌ |
| Take quiz | ❌ | ✅ |
| View class stats | ✅ | ❌ |
| View my progress | ❌ | ✅ |

---

## 🧪 Test with cURL

### Register Teacher
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "teacher"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123"
  }'
```
(Save the `token` from response)

### Create Module
```bash
curl -X POST http://localhost:5000/api/modules \
  -H "Authorization: Bearer [token_from_login]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "description": "Learn JS",
    "fileUrl": "https://example.com/js.pdf",
    "fileType": "pdf"
  }'
```

---

## 🐛 Common Issues

### "Cannot find module 'cors'"
```bash
npm install
```

### "connect ECONNREFUSED"
- MySQL not running
- Check `.env` database settings
- Verify `educationdb` exists

### "Invalid token"
- Token expired → need to login again
- JWT_SECRET mismatch between frontend/backend
- Token format wrong (must have "Bearer " prefix)

### "Module not found"
- Module ID incorrect
- Module belongs to different teacher
- Student not enrolled in module

---

## 📚 Complete API Reference

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for:
- All 20+ endpoints
- Request/response formats
- Status codes
- Error handling

---

## 🎨 Frontend Customization

The frontend guide (FRONTEND_SETUP.md) includes:
- Component structure
- API integration examples
- Styling with Tailwind CSS
- Protected routes setup
- State management patterns

---

## 🚀 Deployment Checklist

Before going to production:

- [ ] Change JWT_SECRET in .env
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for DB credentials
- [ ] Enable HTTPS
- [ ] Set CORS to specific domain
- [ ] Add rate limiting
- [ ] Setup database backups
- [ ] Enable logging
- [ ] Test all endpoints
- [ ] Test payment integration (if applicable)

---

## 📞 Support

**For backend issues:**
- Check console for error messages
- Review API_DOCUMENTATION.md
- Check database schema exists

**For frontend issues:**
- Check browser console (F12)
- Verify API URL in .env
- Check network tab for API calls

**For database issues:**
- Verify MySQL is running
- Check credentials in .env
- Verify database schema imported

---

## 🎓 Next Features to Add

1. File upload to server (instead of just URLs)
2. Search and filter modules
3. Discussion forums
4. Assignment submission
5. Notifications
6. Student messaging
7. Certificates
8. Mobile app (React Native)
9. Advanced analytics
10. Payment integration

---

## 📝 Demo Scenario

### Scenario: "Advanced JavaScript" Course

**Teacher Setup:**
1. Login as teacher@example.com
2. Create module: "Variables & Types"
3. Create module: "Functions & Scope"
4. Create module: "Async/Await"

**Create Quiz:**
1. Create "Variables Quiz" (5 questions)
2. Create "Functions Quiz" (5 questions)

**Assign to Students:**
1. Register 5 students
2. Assign modules to all students

**Student Journey:**
1. Login as student@example.com
2. See 3 modules in dashboard
3. Study "Variables & Types"
4. Mark complete (100%)
5. Take "Variables Quiz"
6. See results
7. Check "My Progress" → shows 33% overall (1 of 3 modules)

**Teacher Analytics:**
1. Check "Class Stats"
2. See: 5 students, 3 modules, 2 quizzes
3. See quiz results for each student
4. See module progress for each student

---

Good luck building your E-Learning system! 🎓