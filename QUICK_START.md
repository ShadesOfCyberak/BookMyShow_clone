# 🚀 Quick Start Guide - MovieFlix

Get your MovieFlix application running in minutes!

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (optional - for user data persistence)

## 🎯 Quick Start Options

### Option 1: One-Click Start (Recommended)

#### Windows Users:
```bash
# Double-click the file or run:
start-app.bat
```

#### Mac/Linux Users:
```bash
# Make executable and run:
chmod +x start-app.sh
./start-app.sh
```

### Option 2: Manual Start

```bash
# 1. Install dependencies
npm run setup

# 2. Start both servers
npm start
```

### Option 3: Separate Servers

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

## 🌐 Access the Application

Once started, open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎬 What You'll See

### Homepage Features:
- **Hero Section** with featured movie
- **Popular Movies** carousel
- **Search Bar** in navigation
- **Dark/Light Theme** toggle
- **User Authentication** buttons

### Available Pages:
1. **Home** (`/`) - Landing page
2. **Discover** (`/discover`) - Browse movies with filters
3. **Search** (`/search`) - Find movies
4. **Movie Details** (`/movie/:id`) - Individual movie page
5. **Favorites** (`/favorites`) - Your favorite movies
6. **Watchlist** (`/watchlist`) - Movies to watch
7. **Profile** (`/profile`) - User profile
8. **Settings** (`/settings`) - App settings

## 👤 User Features

### Without Account:
- Browse movies
- Search movies
- View movie details
- See recommendations

### With Account (Register/Login):
- Save favorites
- Create watchlist
- Rate movies
- Personalized recommendations
- Profile management
- Theme preferences

## 🎨 Sample Data

The app includes 10 high-quality sample movies:
1. The Shawshank Redemption
2. The Godfather
3. The Dark Knight
4. Pulp Fiction
5. Fight Club
6. Inception
7. The Matrix
8. Goodfellas
9. The Silence of the Lambs
10. Interstellar

## 🔧 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# Kill processes on ports 3000 and 5000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**MongoDB not running:**
- The app works with sample data
- User data won't persist without MongoDB
- Install MongoDB for full functionality

**Dependencies not installed:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
cd server && npm install
```

### Error Messages:

**"Module not found"**
```bash
npm install
```

**"Cannot connect to server"**
- Check if backend is running on port 5000
- Check if frontend is running on port 3000

**"MongoDB connection failed"**
- Install MongoDB or use sample data only
- Check MongoDB service is running

## 📱 Features Overview

### 🎬 Movie Discovery
- Browse popular movies
- Search by title/description
- Filter by genre, year, rating
- Sort by popularity, rating, date

### 👤 User Experience
- Responsive design (mobile/desktop)
- Dark/Light theme
- Smooth animations
- Intuitive navigation

### 🔐 Authentication
- User registration
- Secure login
- JWT tokens
- Protected routes

### 💾 Data Management
- Favorites system
- Watchlist management
- Movie ratings
- User preferences

## 🚀 Next Steps

1. **Explore the Interface** - Navigate through all pages
2. **Create an Account** - Register to unlock full features
3. **Add Movies** - Save favorites and watchlist
4. **Customize Settings** - Adjust theme and preferences
5. **Search & Discover** - Find new movies to watch

## 🛠️ Development

### Project Structure:
```
Movie Recomandation app 2/
├── src/                    # Frontend React code
├── server/                 # Backend Node.js code
├── start-app.bat          # Windows start script
├── start-app.sh           # Unix start script
├── setup.js               # Setup script
└── README.md              # Detailed documentation
```

### Key Technologies:
- **Frontend**: React 18, Material-UI, Vite
- **Backend**: Node.js, Express, MongoDB
- **State**: Zustand
- **Styling**: Material-UI, Framer Motion

## 🎉 You're Ready!

Your MovieFlix application is now running! Enjoy discovering amazing movies and building your personal collection.

---

**Need help?** Check the main README.md for detailed documentation. 