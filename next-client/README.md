# Community Protocol & Discussion Platform – Next.js Frontend

Frontend application for the Community-Powered Protocol & Discussion Platform.

This application allows users to:

- Browse protocols
- Search and filter protocols
- View protocol detail pages
- Create discussion threads
- Post nested comments
- Submit reviews and ratings
- Upvote / Downvote threads and comments
- Interact with a responsive UI built with TailwindCSS

------------------------------------------------------------

TECH STACK

- Next.js 16+
- React 19+
- TailwindCSS
- Fetch API for backend communication
- Server-side and client-side rendering where appropriate

------------------------------------------------------------

ARCHITECTURE OVERVIEW

Search flow:

Frontend → Laravel API → Typesense → Laravel → JSON → Frontend

Important:
Typesense is NOT called directly from the frontend.
All search logic is handled securely through the Laravel backend.

------------------------------------------------------------

INSTALLATION & SETUP

1) Clone Repository

git clone <your-repo-url>
cd frontend

2) Install Dependencies

npm install

3) Environment Configuration

Create a file:

.env.local

Add:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

Make sure your Laravel backend is running before starting the frontend.

------------------------------------------------------------

RUN DEVELOPMENT SERVER

npm run dev

Application runs at:

http://localhost:3000

------------------------------------------------------------

PROJECT STRUCTURE (Simplified)

app/
  page.js (Homepage - Protocol listing)
  protocols/[id]/page.js (Protocol detail page)

components/
  ProtocolCard.jsx
  ThreadList.jsx
  CommentSection.jsx
  VoteButtons.jsx
  SearchBar.jsx
  Filters.jsx

lib/
  api.js (API helper functions)

------------------------------------------------------------

FEATURES IMPLEMENTED

1) Protocol Listing Page
- Displays protocols
- Pagination support
- Search-as-you-type
- Sorting options:
  - Most Recent
  - Most Reviewed
  - Top Rated

2) Protocol Detail Page
- Displays protocol information
- Displays associated threads
- Displays reviews and average rating
- Create new thread under protocol
- Submit review with rating

3) Threads
- View thread content
- Upvote / Downvote
- View nested comments

4) Comments
- Add top-level comment
- Reply to existing comment
- Nested display structure
- Upvote / Downvote comments

5) Voting System
- One vote per entity enforced by backend
- UI updates after vote submission

6) Responsive Design
- Mobile-friendly layout
- Clean Tailwind-based styling
- Simple and intuitive UX

------------------------------------------------------------

API CONNECTION EXAMPLE

Search request example:

GET /api/protocols/search?q=detox&sort=recent&page=1&per_page=10

Frontend fetch example:

fetch(`${API_URL}/protocols/search?q=${query}&sort=${sort}&page=${page}&per_page=${perPage}`)

------------------------------------------------------------

TESTING GUIDE

1) Start Laravel backend

cd backend
php artisan serve

2) Reset and seed backend if needed

php artisan migrate:fresh --seed
php artisan typesense:reindex

3) Start frontend

cd frontend
npm run dev

4) Test the following:

- Search protocols
- Sort results
- Open protocol detail page
- Create a new thread
- Post comments
- Reply to comments
- Submit review
- Upvote/downvote thread
- Upvote/downvote comment
- Verify UI responsiveness on mobile view

------------------------------------------------------------

ENVIRONMENT VARIABLES SUMMARY

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

------------------------------------------------------------

PRODUCTION BUILD

To create production build:

npm run build
npm start

------------------------------------------------------------

DEPLOYMENT OPTIONS

Frontend can be deployed to:

- Vercel
- Netlify
- Any Node.js hosting provider

Make sure NEXT_PUBLIC_API_URL points to your production backend API.

------------------------------------------------------------

SUBMISSION CHECKLIST

[x] Responsive UI
[x] Search & filtering
[x] Voting UX
[x] Nested comments
[x] Thread creation
[x] Review submission
[x] Connected to Laravel backend
[x] Clean component structure
