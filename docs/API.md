# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

**Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

### Login

**POST** `/auth/login`

**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

### Get Current User

**GET** `/auth/me`

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "role": "user",
    "myList": [],
    "preferences": { ... }
  }
}
```

---

## Video Endpoints

### Get All Videos

**GET** `/videos`

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `genre` (string): Filter by genre

**Response**:
```json
{
  "success": true,
  "count": 20,
  "total": 100,
  "totalPages": 5,
  "currentPage": 1,
  "videos": [ ... ]
}
```

### Get Video by ID

**GET** `/videos/:id`

**Response**:
```json
{
  "success": true,
  "video": {
    "_id": "video_id",
    "title": "string",
    "description": "string",
    "thumbnail": "string",
    "duration": 7200,
    "releaseYear": 2024,
    "genre": ["Action", "Thriller"],
    "rating": "PG-13",
    "imdbRating": 8.5,
    "views": 1000,
    "likes": 50,
    "cast": [ ... ],
    "director": "string"
  }
}
```

### Stream Video

**GET** `/videos/:id/stream`

Streams video with HTTP range support for seeking.

**Headers**:
- `Range` (optional): bytes=start-end

**Response**: Video stream

### Get Featured Videos

**GET** `/videos/featured`

**Response**:
```json
{
  "success": true,
  "count": 10,
  "videos": [ ... ]
}
```

### Get Trending Videos

**GET** `/videos/trending`

**Response**:
```json
{
  "success": true,
  "count": 20,
  "videos": [ ... ]
}
```

### Get Videos by Category

**GET** `/videos/by-category/:categoryId`

**Response**:
```json
{
  "success": true,
  "count": 15,
  "videos": [ ... ]
}
```

### Get Videos by Genre

**GET** `/videos/by-genre/:genre`

**Response**:
```json
{
  "success": true,
  "count": 25,
  "videos": [ ... ]
}
```

### Get Related Videos

**GET** `/videos/:id/related`

**Response**:
```json
{
  "success": true,
  "count": 12,
  "videos": [ ... ]
}
```

### Like Video

**POST** `/videos/:id/like`

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "likes": 51
}
```

### Add to My List

**POST** `/videos/:id/add-to-list`

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "message": "Video added to your list"
}
```

### Remove from My List

**DELETE** `/videos/:id/remove-from-list`

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "message": "Video removed from your list"
}
```

---

## Category Endpoints

### Get All Categories

**GET** `/categories`

**Response**:
```json
{
  "success": true,
  "count": 5,
  "categories": [
    {
      "_id": "category_id",
      "name": "Movies",
      "slug": "movies",
      "description": "Feature films",
      "order": 1
    }
  ]
}
```

### Get Category by ID

**GET** `/categories/:id`

### Get Category by Slug

**GET** `/categories/slug/:slug`

---

## Watch History Endpoints

### Get Watch History

**GET** `/watch-history`

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "count": 10,
  "history": [
    {
      "_id": "history_id",
      "video": { ... },
      "progress": 1200,
      "completed": false,
      "lastWatched": "2024-02-27T10:00:00Z"
    }
  ]
}
```

### Update Progress

**PUT** `/watch-history/:videoId`

**Headers**: Authorization required

**Body**:
```json
{
  "progress": 1200,
  "completed": false
}
```

### Get Continue Watching

**GET** `/watch-history/continue-watching`

**Headers**: Authorization required

Returns videos with progress > 0 and not completed.

### Clear History

**DELETE** `/watch-history`

**Headers**: Authorization required

---

## Search Endpoints

### Search Videos

**GET** `/search?q=query`

**Query Parameters**:
- `q` (string, required): Search query
- `genre` (string): Filter by genre
- `year` (number): Filter by release year
- `rating` (string): Filter by rating
- `sort` (string): Sort by (newest, oldest, rating, views)

**Response**:
```json
{
  "success": true,
  "count": 5,
  "query": "action",
  "videos": [ ... ]
}
```

### Autocomplete

**GET** `/search/autocomplete?q=query`

**Response**:
```json
{
  "success": true,
  "suggestions": ["Action Movie", "Action Hero", ...]
}
```

---

## User Endpoints

### Get My List

**GET** `/users/my-list`

**Headers**: Authorization required

**Response**:
```json
{
  "success": true,
  "count": 5,
  "videos": [ ... ]
}
```

### Get Recommendations

**GET** `/users/recommendations`

**Headers**: Authorization required

Returns personalized video recommendations based on watch history.

### Update Preferences

**PUT** `/users/preferences`

**Headers**: Authorization required

**Body**:
```json
{
  "favoriteGenres": ["Action", "Comedy"],
  "preferredQuality": "1080",
  "autoplay": true
}
```

---

## Admin Endpoints

All admin endpoints require authentication with admin role.

### Upload Video

**POST** `/videos`

**Headers**: 
- Authorization required
- Content-Type: multipart/form-data

**Body**: FormData with video file and metadata

### Update Video

**PUT** `/videos/:id`

**Headers**: Authorization required (admin)

**Body**: Video metadata

### Delete Video

**DELETE** `/videos/:id`

**Headers**: Authorization required (admin)

### Publish/Unpublish Video

**PATCH** `/videos/:id/publish`

**Headers**: Authorization required (admin)

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Applies to all `/api/*` endpoints
