# VibeBoard

VibeBoard is a full-stack application built with React (Frontend) and Laravel (Backend API). It features a unique interface where users can post notes that appear as randomly scattered, stacked sticky notes on a canvas area.

## Tech Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** Laravel (API), Sanctum (Authentication)
* **Database:** SQLite / MySQL (Configurable via Laravel)

## Project Structure

The repository is split into two main directories:

* `/backend`: Contains the Laravel API, migrations, and backend logic.
* `/frontend`: Contains the React application and frontend UI components.

## Getting Started

### Backend Setup (Laravel)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the `.env.example` file to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
6. Start the local development server:
   ```bash
   php artisan serve
   ```

### Frontend Setup (React)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Features

- User Authentication via Laravel Sanctum.
- Note creation with coordinate-based positioning for a dynamic, scattered layout.
- Premium UI/UX design with responsive layouts.
