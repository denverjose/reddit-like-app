Reddit-Like App – Laravel API

Backend API for a community-driven platform where users can post protocols, create discussion threads, leave reviews, comment (nested), vote, and search content using Typesense.

Tech Stack:
- Backend: Laravel 12+
- Database: SQLite (default) or MySQL
- Search: Typesense Cloud
- Architecture: REST API
- Features: Polymorphic voting, nested comments, seeded mock data

Quick Setup:

1) Clone the Repo:
git clone https://github.com/denverjose/reddit-like-app.git
cd reddit-like-app/laravel-api

2) Install Dependencies:
composer install

3) Environment Setup:
cp .env.example .env
php artisan key:generate

Database Setup:

Option 1 – SQLite:
touch database/database.sqlite
Update .env:
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/project/laravel-api/database/database.sqlite

Option 2 – MySQL:
Update .env:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=protocols_db
DB_USERNAME=root
DB_PASSWORD=your_password

Create database manually:
CREATE DATABASE protocols_db;

4) Run Migrations & Seed:
php artisan migrate
php artisan db:seed

Or reset everything:
php artisan migrate:fresh --seed

Seeder creates:
- 12 Protocols
- 10 Threads
- Nested Comments
- Reviews & Ratings
- Votes

5) Typesense Configuration:
Add to .env:
TYPESENSE_HOST=your-typesense-host
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your_admin_api_key

Only the Admin API key is required in the backend. Do not expose it in frontend.

Sync data to Typesense:
`php artisan typesense:sync-protocols`
`php artisan typesense:sync-threads`

Or reindex everything:
php artisan typesense:reindex

6) Run the Server:
php artisan serve

Base URL: http://127.0.0.1:8000
API Base: http://127.0.0.1:8000/api

Testing Guide:
- Test protocol search and sorting
- Create threads
- Nested comments
- Voting logic (one vote per entity)
- Reviews & rating calculation
- Index updates after CRUD

Environment Variables Summary:
APP_NAME=
APP_URL=
DB_CONNECTION=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
TYPESENSE_HOST=
TYPESENSE_PORT=
TYPESENSE_PROTOCOL=
TYPESENSE_API_KEY=
