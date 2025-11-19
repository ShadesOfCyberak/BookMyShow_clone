# BookMyShow Clone

A full-stack movie and event booking platform inspired by BookMyShow, built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### 🎬 Movie Booking
- **Movie Discovery**: Browse trending and popular movies with detailed information
- **Theater Selection**: Choose from multiple theaters and screening locations
- **Show Timings**: View available show times across different dates
- **Seat Selection**: Interactive seat map with different categories (Premium, Gold, Silver, Regular)
- **Booking Flow**: Complete booking process with payment integration
- **Ticket Management**: View booking history and download tickets

### 🎪 Event Management
- **Event Listings**: Discover concerts, theater shows, sports events, and more
- **Category Filtering**: Filter events by type, location, and date
- **Event Booking**: Book tickets for various entertainment events
- **Venue Information**: Detailed venue and organizer information

### 👤 User Features
- **Authentication**: Secure user registration and login
- **Profile Management**: Manage personal information and preferences
- **Favorites & Watchlist**: Save favorite movies and create watchlists
- **Booking History**: Track all past and upcoming bookings
- **Reviews & Ratings**: Rate movies and events

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching for better user experience
- **Material-UI**: Beautiful, accessible components
- **Smooth Animations**: Enhanced user interactions with Framer Motion

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Zustand** - State management
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### External APIs
- **TMDB API** - Movie data and images

## 📁 Project Structure

```
bookmyshow-clone/
├── src/                          # Frontend source code
│   ├── components/               # Reusable components
│   │   ├── auth/                # Authentication components
│   │   ├── booking/             # Booking flow components
│   │   ├── common/              # Shared components
│   │   ├── layout/              # Layout components
│   │   └── movies/              # Movie-related components
│   ├── pages/                   # Page components
│   ├── store/                   # Zustand stores
│   └── utils/                   # Utility functions
├── server/                      # Backend source code
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Custom middleware
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   └── server.js               # Express server
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- TMDB API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bookmyshow-clone.git
cd bookmyshow-clone
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. **Environment Setup**

Create `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/bookmyshow
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

Create `.env` file in the root directory:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_URL=http://localhost:5000/api
```

4. **Seed the database**
```bash
cd server
npm run seed
```

5. **Start the application**

Backend (from server directory):
```bash
npm run dev
```

Frontend (from root directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📊 Database Models

### User
- Personal information
- Authentication credentials
- Booking history
- Preferences and settings

### Theater
- Theater information
- Screen configuration
- Seat layout and pricing
- Location and amenities

### Show
- Movie details
- Show timings
- Seat availability
- Pricing information

### Booking
- User and show details
- Seat selection
- Payment information
- Ticket details

### Event
- Event information
- Venue details
- Ticket types and pricing
- Organizer information

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:id` - Get movie details

### Theaters
- `GET /api/theaters` - Get theaters
- `GET /api/theaters/:id` - Get theater details

### Shows
- `GET /api/shows` - Get shows by movie/theater
- `GET /api/shows/:id` - Get show details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Events
- `GET /api/events` - Get events
- `GET /api/events/:id` - Get event details
- `GET /api/events/categories` - Get event categories

## 🎯 Key Features Implementation

### Seat Selection
- Interactive seat map generation
- Real-time seat availability
- Multiple seat categories with different pricing
- Seat booking temporary hold mechanism

### Booking Flow
- Multi-step booking process
- Payment integration simulation
- Booking confirmation and ticket generation
- Email notifications (planned)

### Event Management
- Comprehensive event listing
- Category-based filtering
- Date and location filtering
- Event rating and review system

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email/SMS notifications
- [ ] Admin dashboard for theater management
- [ ] Advanced search and filtering
- [ ] Social features (reviews, sharing)
- [ ] Mobile app development
- [ ] Real-time seat updates with WebSocket
- [ ] Recommendation engine
- [ ] Multi-language support
- [ ] Loyalty points system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- [Material-UI](https://mui.com/) for the component library
- [BookMyShow](https://in.bookmyshow.com/) for design inspiration

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

Made with ❤️ by [Your Name]
