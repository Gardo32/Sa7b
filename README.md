# بطاعتي أسمو - Ramadan Celebration Web App

A Ramadan-themed celebration pull web app for a children's competition called "بطاعتي أسمو" (By My Obedience I Rise). This application allows for random selection of participants from a database with beautiful animations and a festive atmosphere.

## Features

- Password-protected main page and admin dashboard
- Beautiful Arabic Ramadan-themed design with iconic elements
- Random participant drawing with weighted selection based on scores
- Admin dashboard for managing participants
- Export results as CSV
- Statistics on selection percentages by group
- Mobile-responsive design

## Technologies Used

- Next.js 14
- TypeScript
- PostgreSQL (Neon Database)
- Tailwind CSS
- React Icons
- React Toastify

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database (already set up with participants)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Ensure your `.env` file in the root directory has:

```
# Database Connection
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Authentication
MAIN_PAGE_PASSWORD=your_main_page_password
ADMIN_PASSWORD=your_admin_password

# App Settings
NEXT_PUBLIC_SITE_TITLE=بطاعتي أسمو
```

4. Run the database schema setup (you can use the schema.sql file)

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Database Schema

The application uses two main tables:

1. Primary_Program - For primary school participants
2. Secondary_Program - For secondary school participants

Both tables have the following structure (based on the existing data):
- id (SERIAL PRIMARY KEY)
- ranking (VARCHAR) - Prize category (e.g., '1', '2', 'First', etc.)
- score (INT) - Score earned by participant (also used for weighting)
- participant_number (BIGINT) - Unique identifier for participant
- group_name (VARCHAR) - Name of participant's group
- participant_name (VARCHAR) - Name of participant

The app adds these columns:
- selected (BOOLEAN) - Whether the participant has been selected
- selection_date (TIMESTAMP) - When the participant was selected

Example data format:
```sql
INSERT INTO Primary_Program (ranking, score, participant_number, group_name, participant_name) VALUES
('1', 80, 39130922, 'الإمام علي (1)', 'قنمبر علي عبدالله');
```

## Usage

### Main Page

- Enter the main page password to access the drawing interface
- Select program (Primary or Secondary) and ranking (First, Second, etc.)
- Click on the draw button to randomly select a winner
- The winner will be displayed with a celebration animation

### Admin Dashboard

- Access the admin dashboard by navigating to /admin and entering the admin password
- View the current winner, previously selected winners, and available participants
- Manually select or unselect participants
- Reset all selections
- Export the selected participants to a CSV file
- View statistics on selection percentages by group
