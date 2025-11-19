const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
const Event = require('./models/Event');

// Load environment variables
dotenv.config();

// Sample data
const sampleTheaters = [
  {
    name: "PVR Cinemas Phoenix Mills",
    location: {
      address: "Phoenix Mills, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400013",
      coordinates: {
        latitude: 19.0135,
        longitude: 72.8302
      }
    },
    screens: [
      {
        screenId: "PVR1",
        name: "Screen 1",
        capacity: 200,
        seatLayout: {
          rows: 10,
          seatsPerRow: 20,
          seatTypes: [
            { type: "Premium", price: 350, rows: ["A", "B"] },
            { type: "Gold", price: 250, rows: ["C", "D", "E"] },
            { type: "Silver", price: 200, rows: ["F", "G", "H"] },
            { type: "Regular", price: 150, rows: ["I", "J"] }
          ]
        }
      },
      {
        screenId: "PVR2",
        name: "Screen 2",
        capacity: 150,
        seatLayout: {
          rows: 8,
          seatsPerRow: 18,
          seatTypes: [
            { type: "Gold", price: 280, rows: ["A", "B", "C"] },
            { type: "Silver", price: 220, rows: ["D", "E", "F"] },
            { type: "Regular", price: 180, rows: ["G", "H"] }
          ]
        }
      }
    ],
    amenities: ["Parking", "Food Court", "AC", "3D", "Wheelchair Accessible"],
    contact: {
      phone: "+91-22-1234-5678",
      email: "phoenix@pvr.com"
    }
  },
  {
    name: "INOX R-City Mall",
    location: {
      address: "R-City Mall, Ghatkopar West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400086",
      coordinates: {
        latitude: 19.0896,
        longitude: 72.9106
      }
    },
    screens: [
      {
        screenId: "INOX1",
        name: "Screen 1",
        capacity: 180,
        seatLayout: {
          rows: 9,
          seatsPerRow: 20,
          seatTypes: [
            { type: "Premium", price: 320, rows: ["A", "B"] },
            { type: "Gold", price: 240, rows: ["C", "D", "E"] },
            { type: "Regular", price: 160, rows: ["F", "G", "H", "I"] }
          ]
        }
      }
    ],
    amenities: ["Parking", "Food Court", "AC", "IMAX", "Dolby Atmos"],
    contact: {
      phone: "+91-22-9876-5432",
      email: "rcity@inox.com"
    }
  },
  {
    name: "Cinepolis Fun Republic",
    location: {
      address: "Fun Republic Mall, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
      coordinates: {
        latitude: 19.1368,
        longitude: 72.8282
      }
    },
    screens: [
      {
        screenId: "CINE1",
        name: "Screen 1",
        capacity: 160,
        seatLayout: {
          rows: 8,
          seatsPerRow: 20,
          seatTypes: [
            { type: "Premium", price: 300, rows: ["A", "B"] },
            { type: "Gold", price: 220, rows: ["C", "D", "E"] },
            { type: "Regular", price: 140, rows: ["F", "G", "H"] }
          ]
        }
      }
    ],
    amenities: ["Parking", "Food Court", "AC", "4DX"],
    contact: {
      phone: "+91-22-5555-6666",
      email: "funrepublic@cinepolis.com"
    }
  }
];

const sampleEvents = [
  {
    title: "Sunburn Music Festival 2025",
    description: "India's biggest electronic dance music festival featuring international and local DJs.",
    category: "Concert",
    images: {
      poster: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      banner: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
    },
    venue: {
      name: "Mahalaxmi Race Course",
      address: "Mahalaxmi Race Course, Mumbai",
      city: "Mumbai",
      capacity: 50000,
      coordinates: {
        latitude: 18.9826,
        longitude: 72.8118
      }
    },
    organizer: {
      name: "Sunburn Events",
      contact: {
        phone: "+91-22-1111-2222",
        email: "info@sunburn.in"
      }
    },
    dates: [
      {
        date: new Date('2025-12-31'),
        startTime: "18:00",
        endTime: "06:00",
        ticketTypes: [
          { name: "General", price: 2500, totalSeats: 30000, availableSeats: 30000 },
          { name: "VIP", price: 5000, totalSeats: 5000, availableSeats: 5000, benefits: ["VIP Area", "Free Food"] },
          { name: "Premium", price: 8000, totalSeats: 2000, availableSeats: 2000, benefits: ["Meet & Greet", "Backstage Access"] }
        ]
      }
    ],
    ageRestriction: "18+",
    language: ["English", "Hindi"],
    duration: "12 hours",
    tags: ["EDM", "Dance", "Party", "Music"],
    featured: true
  },
  {
    title: "Stand-up Comedy Night",
    description: "Laugh out loud with the best comedians in the city performing live.",
    category: "Comedy",
    images: {
      poster: "https://images.pexels.com/photos/8015277/pexels-photo-8015277.jpeg"
    },
    venue: {
      name: "The Comedy Store",
      address: "Palladium Mall, Lower Parel",
      city: "Mumbai",
      capacity: 200
    },
    dates: [
      {
        date: new Date('2025-10-15'),
        startTime: "20:00",
        endTime: "22:00",
        ticketTypes: [
          { name: "Regular", price: 800, totalSeats: 150, availableSeats: 150 },
          { name: "Premium", price: 1200, totalSeats: 50, availableSeats: 50, benefits: ["Front Row", "Meet & Greet"] }
        ]
      }
    ],
    ageRestriction: "16+",
    language: ["English", "Hindi"],
    duration: "2 hours",
    tags: ["Comedy", "Stand-up", "Entertainment"]
  }
];

// Generate sample shows for popular movie IDs
const generateSampleShows = async (theaters) => {
  const popularMovieIds = [550, 680, 157336, 238, 424, 278, 372058]; // Sample TMDB movie IDs
  const movieTitles = {
    550: "Fight Club",
    680: "Pulp Fiction", 
    157336: "Interstellar",
    238: "The Godfather",
    424: "Schindler's List",
    278: "The Shawshank Redemption",
    372058: "Your Name"
  };

  const shows = [];
  const today = new Date();
  
  for (const theater of theaters) {
    for (const movieId of popularMovieIds.slice(0, 3)) { // 3 movies per theater
      for (const screen of theater.screens.slice(0, 1)) { // 1 screen per movie
        const show = {
          movie: {
            tmdbId: movieId,
            title: movieTitles[movieId],
            posterPath: `/path/to/poster_${movieId}.jpg`,
            duration: 150,
            genre: ["Action", "Drama"],
            rating: "UA",
            language: "English"
          },
          theater: theater._id,
          screen: {
            screenId: screen.screenId,
            name: screen.name
          },
          showTimes: [],
          format: "2D",
          startDate: today,
          endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from today
        };

        // Generate showtimes for next 7 days
        for (let day = 0; day < 7; day++) {
          const showDate = new Date(today.getTime() + day * 24 * 60 * 60 * 1000);
          const times = ["10:00", "13:30", "17:00", "20:30"];
          
          for (const time of times) {
            show.showTimes.push({
              date: showDate,
              time: time,
              price: screen.seatLayout.seatTypes.reduce((acc, type) => {
                acc[type.type] = type.price;
                return acc;
              }, {}),
              availableSeats: screen.capacity,
              bookedSeats: []
            });
          }
        }
        
        shows.push(show);
      }
    }
  }
  
  return shows;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://ajaykumarvp2_db_user:ajaykumar@cluster0.6m7swu9.mongodb.net/?appName=Cluster0');//process.env.MONGODB_URI || 'mongodb://localhost:27017/movieflix');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Theater.deleteMany({});
    await Show.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Insert theaters
    const theaters = await Theater.insertMany(sampleTheaters);
    console.log(`Inserted ${theaters.length} theaters`);

    // Generate and insert shows
    const shows = await generateSampleShows(theaters);
    await Show.insertMany(shows);
    console.log(`Inserted ${shows.length} shows`);

    // Insert events
    const events = await Event.insertMany(sampleEvents);
    console.log(`Inserted ${events.length} events`);

    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
