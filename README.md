# Movie Search Application

A modern movie search application built using the latest version of **Next.js (App Router)** and **React**, consuming a public Movies API to provide searchable, filterable, and paginated movie results.

This project emphasizes **clean architecture, predictable state management, and defensive UI behavior**, focusing on real-world production concerns rather than visual polish.

---

## 🚀 Live Demo

**Deployed App:**  
[https://movie-app-silk-six-30.vercel.app/](https://movie-app-silk-six-30.vercel.app/)

**GitHub Repository:**  
[https://github.com/atlanteavila/movie-app](https://github.com/atlanteavila/movie-app)

---

## Project Overview

This application allows users to:

- Search for movies by title
- Filter results by genre
- Navigate through paginated results (next / previous)
- View the total count of search results
- See notable movie information including:
  - Poster image
  - Title
  - Rating
  - Summary (when available)

The app uses the public Movies API provided for this exercise.

---

## Tech Stack

- **Framework:** Next.js (latest, App Router)
- **UI:** React + Tailwind CSS
- **Data Fetching:** TanStack React Query
- **Images:** `next/image` with defensive fallback handling
- **API:** REST API (`please request if needed`)

The application does not require users to grant any permissions.

---

## Architectural Highlights

### Defensive Poster Rendering (`SafeMoviePoster`)

Movie poster URLs from third-party APIs can often be unreliable (missing images, 404s, CDN issues).  
To handle this gracefully, poster rendering is centralized in a `SafeMoviePoster` component that:

- Displays a local placeholder image when posters fail to load
- Prevents broken image icons and layout shifts
- Works correctly with Next.js image optimization constraints

This mirrors real-world frontend robustness expectations.

---

## State & Data Strategy

- Server state is managed using **React Query**
- Pagination, search, and filters are explicit and predictable
- Cached placeholder data prevents UI flicker during page transitions
- Query keys are scoped by page, search term, and genre to avoid stale data

---

## Minimum Requirements

All minimum requirements defined in the exercise are met:

- Search for movies
- Paginated results
- Next / Previous navigation
- Genre filtering
- Total result count
- Display of notable movie information
- No permissions required
- Modern framework and tooling
- No references to “This Dot” in the repository

---

## 🏆 What I’m Most Proud Of

- Clean separation of concerns between data, UI, and error handling
- Defensive handling of imperfect API data
- Intentional scope control (building only what adds value)
- A codebase that is readable, maintainable, and extensible

---

## ⏭️ Future Improvements

Given more time, I would consider adding:

- Server-side response normalization - main option
- Skeleton loaders for images
- Sorting options (rating, year)
- URL-driven state for deep-linking
- Accessibility enhancements
- Basic test coverage for core components

---

## 📦 Running Locally

```bash
npm install
npm run dev
```
The app will be available at:

```
http://localhost:3000
```

## Notes
- Third-party libraries are used intentionally and transparently
- All core application logic was written specifically for this exercise
- No existing projects were forked or copied

