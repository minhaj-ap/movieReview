# Movie Review App 🎬  

A full-stack MERN (MongoDB, Express, React, Node.js) application that lets users explore movies, write reviews, and leave ratings. Movies are fetched from the TMDB API. Built as part of an internship project with **Entri App**.  

**Admin features**: Delete reviews/ratings, ban and delete users.  

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://movierview.netlify.app/)  

---  

## Features ✨  

- **User Actions**:  
  - Browse movies (powered by TMDB API).  
  - Write reviews and rate movies.  
  - User authentication (login/signup).  
- **Admin Panel**:  
  - Delete reviews/ratings.  
  - Ban/unban users.   

---  

## Tech Stack 🛠️  

- **Frontend**: React.js  
- **Backend**: Express.js, Node.js  
- **Database**: MongoDB  
- **API**: [TMDB](https://www.themoviedb.org/) (The Movie Database)  

---  

## Installation & Setup 🚀  

### Prerequisites  
- Node.js (v14+)  
- MongoDB Atlas URI (for database)  
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))  

### Steps  

1. **Clone the repository**:  
   ```bash  
   git clone https://github.com/minhaj-ap/movie-review-app.git  
   cd movie-review-app  
   ```  

2. **Backend Setup**:  
   ```bash  
   cd backend  
   npm install  
   ```  
   - Create a `.env` file with:  
     ```  
     MONGODB_URI=your_mongodb_atlas_uri  
     TMDB_API_KEY=your_tmdb_api_key  
     ```  
   - Start the server:  
     ```bash  
     npm run start  
     ```  

3. **Frontend Setup**:  
   ```bash  
   cd frontend  
   npm install  
   ```  
   - Create a `.env` file with:  
     ```  
     REACT_APP_SERVER_URL=http://localhost:5000  # or your backend URL  
     ```  
   - Run the app:  
     ```bash  
     npm run build  
     npm start  
     ```  

---  

## Live Demo 🌐  

Deployed on Netlify: [https://movierview.netlify.app/](https://movierview.netlify.app/)  

---  

## Contributing 🤝  

Contributions are welcome! Open a PR or issue if you want to:  
- Fix bugs.  
- Add new features (e.g., movie trailers, user profiles).  
- Improve UI/UX.  

---  

## Contact 📬  

- **GitHub**: [@minhaj-ap](https://github.com/minhaj-ap)  

---  