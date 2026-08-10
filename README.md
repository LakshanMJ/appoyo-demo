# Appoyo Roster Interface

A roster management interface built as a technical demo, inspired by the Appoyo roster experience.

## Demo

The demo showcases the main roster functionality, including shift management, drag-and-drop scheduling, and backend scheduling validations.
[▶️ Watch the Demo Video](https://drive.google.com/file/d/1cFp1tHoCljfoh0H_GwMLdzx06wWfzxL_/view?usp=drive_link)

## Features

* Weekly roster/calendar view
* Create and manage shifts
* Assign shifts to participants and caregivers
* Drag-and-drop shift scheduling
* Participant and caregiver conflict validation
* Backend validation for overlapping shifts
* Error handling with user-friendly toast notifications
* Responsive and clean UI

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Zustand
* Axios

### Backend

* NestJS
* TypeScript
* Prisma
* Database persistence
* REST API

## Project Structure

```text
appoyo-demo/
├── frontend/
└── backend/
```

## Running Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Make sure the backend database is configured before starting the application.
Built as a technical demonstration for Appoyo.
