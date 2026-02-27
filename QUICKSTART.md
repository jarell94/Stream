# Quick Start Guide

Get your streaming service up and running in 5 minutes!

## 🚀 Fastest Setup (Docker)

If you have Docker installed:

```bash
# 1. Clone the repo
git clone https://github.com/jarell94/Stream.git
cd Stream

# 2. Start everything
docker-compose up -d

# 3. Wait 30 seconds, then visit:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

That's it! 🎉

## 📝 Manual Setup (Without Docker)

### Requirements
- Node.js 18+
- MongoDB running

### Steps

```bash
# 1. Install MongoDB (if not installed)
# macOS:
brew install mongodb-community

# Ubuntu:
sudo apt-get install mongodb

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb           # Linux

# 2. Clone and setup backend
git clone https://github.com/jarell94/Stream.git
cd Stream/backend
npm install
cp .env.example .env
npm run seed  # Creates sample data
npm start     # Starts on port 5000

# 3. In a NEW terminal, setup frontend
cd ../frontend
npm install
npm start     # Starts on port 3000
```

## 🎬 First Login

After setup, login with these credentials:

**Admin Account:**
- Email: `admin@stream.com`
- Password: `admin123`

**Test User Account:**
- Email: `user@stream.com`
- Password: `user123`

## ✅ Verify Installation

1. **Backend Health Check**
   - Visit: http://localhost:5000/api/health
   - Should see: `{"status":"OK"}`

2. **Frontend**
   - Visit: http://localhost:3000
   - Should see the homepage

3. **Database**
   ```bash
   mongosh  # or mongo
   show dbs
   use streamdb
   db.users.find()  # Should show 2 users
   ```

## 🎥 Upload Your First Video

1. Login as admin (admin@stream.com / admin123)
2. Use API endpoint to upload video:

```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@/path/to/your/video.mp4" \
  -F "title=My First Video" \
  -F "description=This is my first upload" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "duration=7200" \
  -F "releaseYear=2024" \
  -F "genre=Action,Thriller" \
  -F "category=CATEGORY_ID" \
  -F "rating=PG-13"
```

## 🐛 Common Issues

### Port Already in Use

**Problem**: Port 3000 or 5000 is busy

**Solution**:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9  # For port 3000
lsof -ti:5000 | xargs kill -9  # For port 5000
```

### MongoDB Connection Failed

**Problem**: Can't connect to MongoDB

**Solution**:
```bash
# Check if MongoDB is running
brew services list  # macOS
systemctl status mongodb  # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb  # Linux
```

### Module Not Found

**Problem**: npm install errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📚 Next Steps

1. **Customize Branding**
   - Edit `/frontend/src/components/Navbar.js` to change logo
   - Modify CSS files for your color scheme

2. **Add Real Content**
   - Upload your videos
   - Add categories
   - Create thumbnails

3. **Configure for Production**
   - Update `.env` with secure credentials
   - Set up CDN for video delivery
   - Configure domain and SSL

4. **Deploy**
   - See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for hosting options

## 🆘 Need Help?

- 📖 Full docs: [README.md](README.md)
- 🔧 Installation guide: [docs/INSTALLATION.md](docs/INSTALLATION.md)
- 🌐 API docs: [docs/API.md](docs/API.md)
- 🐛 Issues: [GitHub Issues](https://github.com/jarell94/Stream/issues)

## 🎯 Features Overview

✅ User authentication & profiles
✅ Video streaming with progress tracking
✅ Search & recommendations
✅ My List functionality
✅ Continue watching
✅ Categories & genres
✅ Admin video management
✅ Responsive design
✅ Docker support

---

**Enjoy your free streaming service!** 🎬🍿
