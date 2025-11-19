# MovieFlix - Movie Recommendation App

A modern, full-stack movie recommendation application built with React, Node.js, and MongoDB. Discover movies, create watchlists, and get personalized recommendations.

## Features

### 🎬 Movie Discovery
- Browse popular movies with beautiful UI
- Search movies by title or description
- View detailed movie information
- Get movie recommendations based on genres

### 👤 User Features
- User registration and authentication
- Personalized favorites and watchlists
- Movie ratings and reviews
- User profile management

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/Light theme toggle
- Smooth animations with Framer Motion
- Material-UI components
- Beautiful movie cards and carousels

### 🔧 Technical Features
- JWT authentication
- RESTful API
- MongoDB database
- Real-time search
- Optimistic updates
- Error handling and notifications

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Material-UI** - Component library
- **React Router** - Navigation
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Movie Recomandation app 2"
```

### 2. Install dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/movieflix

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# TMDB API (Optional - for real movie data)
TMDB_API_KEY=your_tmdb_api_key_here

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Run the application

#### Start the backend server
```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### Start the frontend development server
```bash
# In a new terminal, from the root directory
npm run dev
```

The application will open on `http://localhost:3000`

## Project Structure

```
Movie Recomandation app 2/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components
│   │   ├── layout/        # Layout components
│   │   └── movies/        # Movie-related components
│   ├── pages/             # Page components
│   ├── store/             # Zustand stores
│   └── App.jsx            # Main App component
├── server/                # Backend source code
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── server.js         # Express server
├── public/               # Static files
├── index.html            # HTML template
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/details/:id` - Get movie details
- `POST /api/movies/rate/:id` - Rate a movie
- `GET /api/movies/recommendations` - Get recommendations

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/favorites/:id` - Toggle favorite
- `POST /api/users/watchlist/:id` - Toggle watchlist
- `GET /api/users/favorites` - Get user favorites
- `GET /api/users/watchlist` - Get user watchlist

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Features in Detail

### Movie Discovery
The app provides a comprehensive movie discovery experience with:
- **Popular Movies**: Curated list of top-rated movies
- **Search Functionality**: Find movies by title or description
- **Movie Details**: Comprehensive information including cast, reviews, and recommendations
- **Genre-based Recommendations**: Get suggestions based on your preferences

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Smooth Animations**: Engaging transitions and hover effects
- **Intuitive Navigation**: Easy-to-use interface with clear navigation

### Personalization
- **Favorites**: Save your favorite movies for quick access
- **Watchlist**: Create a list of movies you want to watch
- **Ratings**: Rate movies and see how they compare to others
- **Recommendations**: Get personalized suggestions based on your activity

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Material-UI](https://mui.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for animations

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/movieflix/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Enjoy discovering amazing movies! 🎬✨** 