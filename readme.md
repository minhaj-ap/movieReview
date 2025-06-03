# Movie Review Web App - Version 2 (API-Based)

## Overview

This is the second version of the Movie Review Web App. It introduces a major architectural shift from a static local database to dynamic movie data fetched from [The Movie Database (TMDb)](https://www.themoviedb.org/). The app now supports movie searching, and retains features like dark/light mode, user ratings, and reviews.

Although the user-facing experience is similar to v1, the underlying system is more scalable and maintains data accuracy using TMDb.

## 🌐 Live Hosting

- **Frontend**: Hosted on [Netlify](https://movierview.netlify.app/)
- **301 Redirect**: The previous Firebase URL redirects to the new Netlify domain (you’ll find Firebase config files still present in the repo for this reason).

## 🔧 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Hosting**: Netlify (Frontend), Render (Backend)

## 🧩 Key Features

- Live movie data fetched via TMDb API
- User login/signup, movie ratings, and reviews
- Light/Dark mode toggle
- Search functionality to find any movie
- Admin controls to manage users, their reviews, and ratings
- Banned/deleted users are instantly restricted from CRUD operations (unlike in v1, where a reload was required)

## 📊 Updated Database Schema

### `movie` Collection

- `_id`: TMDb Movie ID (number)
- `movieName`: String
- `NoOfRatings`: Number
- `currentRating`: Float
- `ratings`: Array of objects
  - `userId`: ObjectId
  - `rating`: Float
- `reviewIds`: Array of ObjectIds

**Example:**

```json
{
  "_id": 950387,
  "movieName": "A Minecraft Movie",
  "NoOfRatings": 1,
  "currentRating": 5,
  "ratings": [{ "userId": ObjectId("..."), "rating": 5 }],
  "reviewIds": [ObjectId("...")]
}
```

### `reviews` Collection

- `_id`: ObjectId
- `userId`: ObjectId
- `review`: String
- `movieId`: String (TMDb ID)
- `movieName`: String
- `date`: Date

**Example:**

```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "review": "great movie",
  "movieId": "950387",
  "movieName": "A Minecraft Movie",
  "date": ISODate("2025-05-20T12:15:00Z")
}
```

### `users` Collection

- `_id`: ObjectId
- `name`: String
- `email`: String
- `password`: Hashed string
- `isBanned`: Boolean (optional)

**Example:**

```json
{
  "_id": { "$oid": "680f4e06c9ecabeb51ca0284" },
  "name": "minhaj ap",
  "email": "minhajap00@gmail.com",
  "password": hashed password goes here
}
```

### `admin` Collection

- One document with:

  - `pass`: Hashed admin password

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- MongoDB connection string
- TMDb API key

### Setup

1. Clone the repo
2. Install dependencies in both `frontend/` and `backend/` directories
3. Add necessary `.env` files
4. Run frontend:

```bash
cd frontend
npm install
npm start
```

5. Run backend:

```bash
cd backend
npm install
npm start
```

## 🔖 Version History

- **v1**: Static DB with local data, full admin controls
- **v2**: TMDb API-based, search enabled, real-time user restrictions, improved schema

---
