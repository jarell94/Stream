# Stream - Free Streaming Service 🎬

A professional, Netflix-quality streaming platform built with the MERN stack. Stream offers unlimited movies and TV shows completely free, with features comparable to premium streaming services.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## ✨ Features

### User Features
- 🎥 **Unlimited Streaming** - Watch unlimited content completely free
- 🔐 **User Authentication** - Secure registration and login system
- 🎬 **Video Player** - Custom video player with progress tracking
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔍 **Advanced Search** - Search by title, genre, cast, and more
- ❤️ **My List** - Save videos to watch later
- 📊 **Continue Watching** - Resume videos where you left off
- 🎯 **Personalized Recommendations** - AI-powered content suggestions
- 🏷️ **Categories & Genres** - Browse by categories and genres
- ⭐ **Featured & Trending** - Discover popular content

### Technical Features
- 🚀 **Video Streaming** - HTTP range request support for efficient streaming
- 🔒 **JWT Authentication** - Secure token-based authentication
- 📦 **MongoDB** - Scalable NoSQL database
- 🎨 **Netflix-style UI** - Modern, intuitive interface
- 🐳 **Dockerized** - Easy deployment with Docker
- 📈 **Watch History** - Track viewing progress and history
- 🎬 **Multiple Video Qualities** - Support for 360p, 480p, 720p, 1080p
- 🌍 **RESTful API** - Well-structured backend API

## 🏗️ Tech Stack

### Frontend
- **React** 18.2.0 - UI framework
- **React Router** - Client-side routing
- **React Player** - Video player component
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **FFmpeg** - Video processing (optional)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/jarell94/Stream.git
   cd Stream
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jarell94/Stream.git
   cd Stream
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Setup MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in backend/.env

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/streamdb
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5368709120
UPLOAD_PATH=./uploads

# Video Settings
VIDEO_QUALITIES=360,480,720,1080
DEFAULT_QUALITY=720

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📁 Project Structure

```
Stream/
├── backend/                 # Backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded files
│   ├── server.js          # Entry point
│   └── package.json
├── frontend/              # React frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   ├── services/     # API services
│   │   └── App.js        # Main app component
│   └── package.json
├── docker-compose.yml    # Docker configuration
└── README.md            # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get video by ID
- `GET /api/videos/:id/stream` - Stream video
- `GET /api/videos/featured` - Get featured videos
- `GET /api/videos/trending` - Get trending videos
- `POST /api/videos/:id/like` - Like a video
- `POST /api/videos/:id/add-to-list` - Add to my list
- `DELETE /api/videos/:id/remove-from-list` - Remove from list

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Watch History
- `GET /api/watch-history` - Get watch history
- `POST /api/watch-history` - Add to watch history
- `PUT /api/watch-history/:videoId` - Update progress
- `GET /api/watch-history/continue-watching` - Get continue watching

### Search
- `GET /api/search?q=query` - Search videos
- `GET /api/search/autocomplete?q=query` - Autocomplete suggestions

## 👤 Default User Roles

- **User** - Regular user with video watching capabilities
- **Admin** - Full access including video upload and management

## 🎯 Usage

### For Users
1. Register an account or login
2. Browse available content
3. Search for specific videos
4. Click play to start streaming
5. Add videos to "My List" for later
6. Continue watching from where you left off

### For Admins
1. Login with admin credentials
2. Upload videos with thumbnails
3. Manage categories and content
4. Mark videos as featured or trending
5. Manage users and permissions

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies
- Rate limiting
- Input validation and sanitization
- Helmet.js security headers
- CORS configuration
- SQL injection protection (NoSQL)

## 🚀 Deployment

### Deploy to Production

1. **Update environment variables**
   - Set NODE_ENV=production
   - Use secure JWT_SECRET
   - Update CORS_ORIGIN

2. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Hosting Recommendations
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas
- **Video Storage**: AWS S3, Google Cloud Storage

## 🎨 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Netflix, Disney+, and other streaming platforms
- React Player for video streaming capabilities
- MongoDB for flexible data storage
- The open-source community

## 📞 Support

For support, email support@streamapp.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile apps (iOS & Android)
- [ ] Live streaming support
- [ ] Subtitle support
- [ ] Multiple audio tracks
- [ ] Download for offline viewing
- [ ] Social features (comments, ratings)
- [ ] Payment integration for premium content
- [ ] Advanced analytics dashboard
- [ ] Video transcoding pipeline
- [ ] CDN integration

## 💡 Future Enhancements

- AI-powered content recommendations
- Multi-language support
- 4K video support
- Watch parties feature
- Chromecast support
- Smart TV apps

---

**Made with ❤️ by the Stream Team**

⭐ Star this repo if you find it helpful!
