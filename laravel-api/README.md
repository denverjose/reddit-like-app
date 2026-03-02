# Community Protocol & Discussion Platform – Laravel API

Backend API for a community-driven platform where users can post structured protocols, create discussion threads, leave reviews, comment (nested), vote, and search content using Typesense.

------------------------------------------------------------

TECH STACK

- Laravel 12+
- MySQL
- Typesense Cloud
- RESTful API Architecture
- Polymorphic Voting System
- Nested Comments (Self-Referencing)

------------------------------------------------------------

FEATURES IMPLEMENTED

- CRUD for Protocols
- CRUD for Threads
- Nested Comments (threaded replies)
- Reviews & Ratings system
- Upvote / Downvote system (one vote per user per entity)
- Typesense-powered search & sorting
- Seeder with realistic mock data
- Automatic indexing on create/update/delete
- Optional reindex command

------------------------------------------------------------

INSTALLATION & SETUP

1) Clone Repository

git clone <your-repo-url>
cd backend

2) Install Dependencies

composer install

3) Environment Setup

cp .env.example .env
php artisan key:generate

4) Database Configuration

Update .env:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=protocols_db
DB_USERNAME=root
DB_PASSWORD=your_password

Create database manually in MySQL:

CREATE DATABASE protocols_db;

------------------------------------------------------------

TYPESENSE CONFIGURATION

Add to .env:

TYPESENSE_HOST=f8g1svtrc4xbjdnwp-1.a1.typesense.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your_admin_api_key

Only the Admin API key is required in backend.
Do NOT expose this key in frontend.

------------------------------------------------------------

DATABASE SETUP

Run migrations:

php artisan migrate

Seed database with mock data:

php artisan db:seed

OR reset everything:

php artisan migrate:fresh --seed

Seeder generates:
- 12 Protocols
- 10 Threads
- Nested Comments
- Reviews with ratings
- Votes

------------------------------------------------------------

TYPESENSE INDEXING

Protocols and Threads are indexed automatically on:
- Create
- Update
- Delete

If a reindex command exists:

php artisan typesense:reindex

If using API route:

POST /api/reindex

------------------------------------------------------------

RUNNING THE SERVER

php artisan serve

Base URL:
http://127.0.0.1:8000

API Base:
http://127.0.0.1:8000/api

------------------------------------------------------------

API OVERVIEW

PROTOCOLS

GET /api/protocols/search

Query Parameters:
- q (search term)
- sort (recent | most_reviewed | top_rated)
- page
- per_page

Example:
GET /api/protocols/search?q=detox&sort=top_rated

GET /api/protocols/{id}

Returns:
- Protocol details
- Associated threads
- Reviews
- Rating summary

POST /api/protocols

{
  "title": "Cold Therapy Protocol",
  "content": "Step-by-step guide...",
  "tags": ["immune", "recovery"],
  "author": "Jane Doe"
}

PUT /api/protocols/{id}

DELETE /api/protocols/{id}

------------------------------------------------------------

THREADS

POST /api/threads

{
  "protocol_id": 1,
  "title": "My Experience",
  "body": "This protocol helped me..."
}

GET /api/threads

Supports search and sorting.

------------------------------------------------------------

COMMENTS (Nested)

POST /api/comments

Top-level comment:

{
  "thread_id": 1,
  "parent_id": null,
  "body": "Very insightful!"
}

Reply:

{
  "thread_id": 1,
  "parent_id": 4,
  "body": "I agree with this."
}

------------------------------------------------------------

REVIEWS

POST /api/reviews

{
  "protocol_id": 1,
  "rating": 5,
  "feedback": "Highly recommended."
}

------------------------------------------------------------

VOTES (Polymorphic)

Users can vote once per thread or comment.

POST /api/votes

Thread vote:

{
  "votable_type": "thread",
  "votable_id": 3,
  "type": "upvote"
}

Comment vote:

{
  "votable_type": "comment",
  "votable_id": 8,
  "type": "downvote"
}

------------------------------------------------------------

ARCHITECTURE NOTES

Voting System:
- Implemented using polymorphic relationships
- voteable_id
- voteable_type
- Ensures one vote per user per entity

Nested Comments:
- Self-referencing parent_id
- Recursive relationship for replies

Search Architecture:
Frontend → Laravel API → Typesense → Laravel → JSON Response

Advantages:
- Admin key never exposed
- Centralized search logic
- Clean separation of concerns

------------------------------------------------------------

TESTING GUIDE

To fully reset and test:

php artisan migrate:fresh --seed
php artisan typesense:reindex
php artisan serve

Then test:
- Protocol search
- Sorting
- Creating threads
- Nested comments
- Voting logic (ensure one vote per entity)
- Reviews & rating calculation
- Index updates after CRUD

------------------------------------------------------------

PROJECT STRUCTURE (Simplified)

app/
  Models/
  Http/Controllers/
  Services/TypesenseSyncService.php

database/
  migrations/
  factories/
  seeders/

routes/
  api.php

------------------------------------------------------------

ENVIRONMENT VARIABLES SUMMARY

APP_NAME=
APP_URL=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
TYPESENSE_HOST=
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=

------------------------------------------------------------

SUBMISSION CHECKLIST

[x] RESTful API
[x] Seeded realistic data
[x] Typesense indexing
[x] Search & filtering
[x] Voting system
[x] Nested comments
[x] README documentation
[x] .env.example included
