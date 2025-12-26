# 🎥 Video Streaming Platform

A full-stack video upload, processing, and streaming application with real-time updates, content sensitivity analysis, and role-based access control.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4-black.svg)](https://socket.io/)

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login with JWT
- Role-based access control (Viewer, Editor, Admin)
- Multi-tenant architecture with user isolation
- Secure password hashing with bcrypt

### 📤 Video Management

- Upload videos with validation (type, size)
- Real-time upload progress tracking
- Video metadata management (title, description)
- Edit and delete video capabilities

### 🤖 Content Analysis

- Automated sensitivity detection
- Real-time processing progress updates via Socket.io
- Safety classification (Safe/Flagged)
- Detailed analysis reports

### 🎬 Video Streaming

- HTTP range request support for seeking
- Smooth video playback
- Multiple format support (MP4, WebM, OGG)
- View counter

### 🎨 User Interface

- Modern, responsive design with Tailwind CSS
- Real-time dashboard updates
- Video filtering by status and sensitivity
- Intuitive upload interface

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Real-Time**: Socket.io
- **Security**: bcryptjs, CORS

### Frontend

- **Build Tool**: Vite
- **Framework**: React 18
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-Time**: Socket.io-client
- **State Management**: Context API

---

## 📁 Project Structure

```
video-streaming-platform/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── config/            # Database & Socket.io config
│   │   ├── models/            # Mongoose models
│   │   ├── middleware/        # Auth, RBAC, Upload
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Route handlers
│   │   └── services/          # Business logic
│   ├── uploads/               # Video storage
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # Auth & Socket context
│   │   ├── pages/             # Route pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd video-streaming-platform
```

2. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
mkdir uploads
npm run dev
```

3. **Setup Frontend**

```bash
cd ../frontend
npm install
npm run dev
```

4. **Access Application**

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

📖 **Detailed Setup**: See [Quick Start Guide](#) artifact

---

## 🔧 Configuration

### Backend Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/video-streaming
# Or: mongodb+srv://user:pass@cluster.mongodb.net/video-streaming

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=524288000  # 500MB
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/ogg

# Socket.io
SOCKET_CORS_ORIGIN=http://localhost:5173
```

---

## 📚 API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Videos

#### Upload Video

```http
POST /api/videos/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

- video: (file)
- title: (string)
- description: (string, optional)
```

#### Get All Videos

```http
GET /api/videos?status=completed&sensitivity=safe
Authorization: Bearer {token}
```

#### Stream Video

```http
GET /api/videos/:id/stream
Authorization: Bearer {token}
Range: bytes=0-1023
```

📖 **Complete API Docs**: See documentation artifact

---

## 🏗️ Architecture

### System Flow

```
User → React Frontend → Express Backend → MongoDB
                ↓              ↓
            Socket.io ←────────┘
         (Real-time Updates)
```

### Video Processing Pipeline

1. **Upload** - User selects video file
2. **Validation** - Check file type and size
3. **Storage** - Save to uploads/ directory
4. **Processing** - Analyze content (10-20 seconds)
5. **Classification** - Mark as Safe/Flagged
6. **Streaming** - Enable video playback

### Security Features

- **JWT Authentication** - Stateless token-based auth
- **RBAC** - Role-based access control (viewer/editor/admin)
- **Multi-Tenant** - User data isolation
- **Input Validation** - All inputs sanitized
- **File Upload Security** - Type and size restrictions
- **CORS** - Configured for specific origins

---

## 🧪 Testing

### Manual Testing

1. **Authentication**

   - Register new user
   - Login/logout
   - Access protected routes

2. **Video Upload**

   - Upload valid video
   - Try invalid file types
   - Check upload progress

3. **Processing**

   - Watch real-time progress
   - Verify completion
   - Check sensitivity classification

4. **Streaming**

   - Play video
   - Test seeking
   - Verify access control

5. **Multi-Tenant**
   - Create multiple users
   - Verify data isolation

---

## 📦 Deployment

### Vercel Deployment

**Backend:**

```bash
cd backend
vercel
```

**Frontend:**

```bash
cd frontend
vercel
```

### Environment Variables

Set in Vercel dashboard:

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- All other .env variables

📖 **Detailed Deployment Guide**: See documentation artifact

---

## 🎯 Key Features Explained

### 1. Mock Sensitivity Analysis

The application simulates video content analysis:

- Processes video for 10-20 seconds
- Randomly classifies as Safe (80%) or Flagged (20%)
- Generates realistic analysis details
- Emits progress updates every second

**Production Ready**: Easy to integrate real AI services like:

- AWS Rekognition Video
- Google Video Intelligence API
- Azure Video Analyzer

### 2. Real-Time Updates

Socket.io provides live progress updates:

- Upload progress
- Processing status
- Completion notifications
- No polling required

### 3. HTTP Range Requests

Enables video seeking (scrubbing):

- Client sends `Range: bytes=0-1023` header
- Server responds with partial content (206)
- Smooth playback experience

### 4. Multi-Tenant Architecture

Each user's data is isolated:

- Users see only their videos
- Admin can access all videos
- Queries filtered by `uploadedBy`

---

## 🔮 Future Enhancements

### Short Term

- [ ] Video thumbnails generation
- [ ] Search functionality
- [ ] Video categories/tags
- [ ] Email notifications

### Medium Term

- [ ] Real AI content analysis integration
- [ ] Video transcoding (multiple qualities)
- [ ] CDN integration
- [ ] Video comments and likes

### Long Term

- [ ] Live streaming support
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video collaboration tools

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB is running
mongod --version

# Verify connection string in .env
# For Atlas: Whitelist IP (0.0.0.0/0 for all)
```

### Port Already in Use

```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
```

### Socket.io Not Connecting

```bash
# Check backend is running
# Verify SOCKET_CORS_ORIGIN matches frontend URL
# Check browser console for errors
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 👨‍💻 Author

**Your Name**

- LinkedIn: [https://www.linkedin.com/in/SATYAM-c/](#)
- Portfolio: [https://www.satyamchaudhary.com.np/](#)
- Email: nitantsatyam123@gmail.com

---

## 🙏 Acknowledgments

- Built for job application assignment
- React and Express communities
- Socket.io documentation
- Tailwind CSS team
- MongoDB Atlas free tier

---

**⭐ If you find this project useful, please star the repository!**

---

**Built with ❤️ using React, Node.js, and MongoDB**
