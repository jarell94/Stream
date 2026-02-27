# Installation Guide

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jarell94/Stream.git
cd Stream
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# You can use nano, vim, or any text editor
nano .env
```

**Important**: Update these values in `.env`:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string
- `CORS_ORIGIN` - Your frontend URL (http://localhost:3000 for development)

### 3. Seed the Database (Optional)

This will create sample data including admin and test users:

```bash
npm run seed
```

Default credentials:
- **Admin**: admin@stream.com / admin123
- **User**: user@stream.com / user123

### 4. Start the Backend

```bash
# Development mode with auto-restart
npm run dev

# OR Production mode
npm start
```

The backend will run on http://localhost:5000

### 5. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on http://localhost:3000

## Using Docker (Alternative Method)

If you prefer using Docker:

```bash
# From the root directory
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Verification

1. **Backend**: Visit http://localhost:5000/api/health
   - You should see: `{"status":"OK","timestamp":"..."}`

2. **Frontend**: Visit http://localhost:3000
   - You should see the Stream homepage

3. **Database**: Check MongoDB connection
   ```bash
   mongo
   show dbs
   use streamdb
   show collections
   ```

## Troubleshooting

### MongoDB Connection Issues

If you can't connect to MongoDB:

1. **Check if MongoDB is running**:
   ```bash
   # On macOS/Linux
   sudo systemctl status mongodb
   
   # On Windows
   # Check Services app for "MongoDB Server"
   ```

2. **Start MongoDB**:
   ```bash
   # On macOS
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongodb
   
   # On Windows
   # Start from Services app
   ```

3. **Use MongoDB Atlas** (Cloud option):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Update `MONGODB_URI` in `.env`

### Port Already in Use

If port 3000 or 5000 is already in use:

**Backend**:
```bash
# Change PORT in backend/.env
PORT=5001
```

**Frontend**:
```bash
# Set PORT environment variable
PORT=3001 npm start
```

### Module Not Found Errors

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Make sure `CORS_ORIGIN` in backend `.env` matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

## Next Steps

1. **Upload Videos**: Login as admin and upload your first video
2. **Customize**: Modify the styling and branding
3. **Deploy**: Follow the deployment guide to go live

## Need Help?

- Check the [README.md](README.md) for more information
- Open an issue on GitHub
- Check the API documentation in `/docs/API.md`
