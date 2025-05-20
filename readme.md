
# 🎬 Movie Review Web App (Version 1 - Local Database Based)

This is the first version of the Movie Review Web App. It allows users to rate and review movies categorized by genres. All content — including movies, genres, users, and reviews — is managed internally through a MongoDB database. No external APIs are used; instead, an admin has complete control over the data.

---

## 🚀 Tech Stack

- **Frontend**: React (in `/frontend`)
- **Backend**: Node.js, Express (in `/backend`)
- **Database**: MongoDB
- **Hosting**: Firebase (for static assets and images)

---

## 🗃️ Database Schemas

Here’s how the data is structured in MongoDB:

### 🔹 `movie_details`
| Field         | Type              | Description                                |
|---------------|-------------------|--------------------------------------------|
| `title`       | String            | Movie title                                 |
| `desc`        | String            | Movie description                           |
| `imageLink`   | String            | Firebase-hosted image link                  |
| `genre_ids`   | Array of Numbers  | Associated genre IDs                        |
| `reviewIds`   | Array of ObjectId | Linked reviews                              |
| `currentRating`| Number           | Average rating                              |
| `NoOfRatings` | Number            | Total number of ratings                     |
| `ratings`     | Array             | Each rating has `userId` (ObjectId) and `rating` (Float) |

### 🔹 `genres`
| Field      | Type              | Description              |
|------------|-------------------|--------------------------|
| `movieIds` | Array of ObjectId | Movies under this genre  |
| `name`     | String            | Genre name               |
| `id`       | Number            | Genre ID                 |

### 🔹 `reviews`
| Field    | Type       | Description         |
|----------|------------|---------------------|
| `userId` | ObjectId   | Author of the review|
| `review` | String     | Review content      |
| `date`   | Date       | Date of submission  |

### 🔹 `user`
| Field      | Type      | Description                |
|------------|-----------|----------------------------|
| `name`     | String    | User's name                |
| `email`    | String    | User's email               |
| `password` | String    | Hashed password            |
| `isBanned` | Boolean   | Optional; if user is banned|

### 🔷 `admin`
| Field      | Type      | Description                |
|------------|-----------|----------------------------|
| `pass`     | String    | Admin's hashed password    |
---

## 🧩 Features

### 👤 Users
- Add, update, and delete their own reviews and ratings
- View movies by genre
- Search movies based on keyword (powered by regex)
- Can experince site on both dark and light mode

### 🛠️ Admin
- Add/edit/delete movies and genres
- Ban or delete users
- Access full control of movie-related and user-related data

---

## 🛠️ How to Run

1. **Install dependencies** in both `frontend` and `backend` folders:

```bash
cd frontend
npm install
cd ../backend
npm install
````

2. **Start both servers** (from their respective folders):

```bash
npm start
```

Make sure your MongoDB and Firebase configurations are correctly set up.

---

## ⚠️ Notes

* This version is built entirely on **static/internal data**, meaning the admin is responsible for manually managing all movie and genre content.
* It is not scalable for large dynamic datasets, which is why a newer version (`v2`) was created that fetches movie data dynamically using external APIs.

---

## 📌 Version

This is the `v1` branch of the project. For the updated API-based version, switch to the `master` branch.
