# Todo App - Full Stack React Application

A comprehensive todo application built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## Features Implemented ✅

### 🔐 User Authentication
- [x] User signup with email and username
- [x] User login with email or username
- [x] JWT-based authentication
- [x] Auto-login after signup
- [x] Session persistence

### 📝 Task Management
- [x] Create new tasks with title, description, due date, and priority
- [x] Edit existing tasks
- [x] Mark tasks as complete/incomplete
- [x] Delete tasks with confirmation
- [x] Task status tracking (active, completed, overdue)

### 🎯 Priority System
- [x] Three priority levels: Low (gray), Medium (yellow), High (red)
- [x] Visual priority indicators
- [x] Priority-based sorting

### 🔍 Filtering & Sorting
- [x] Filter by status (All, Active, Completed, Overdue)
- [x] Filter by priority (All, High, Medium, Low)
- [x] Filter by due date (Today, Upcoming, Overdue)
- [x] Search tasks by title and description
- [x] Sort by date created, due date, priority, or title
- [x] Ascending/descending sort options

### 🚨 Notifications & Confirmations
- [x] Confirmation dialogs for deleting tasks
- [x] Confirmation dialogs for marking tasks complete
- [x] Visual indicators for overdue tasks
- [x] Error and success messages

### 📊 Dashboard & Analytics
- [x] Task statistics overview
- [x] Total tasks count
- [x] Active, completed, and overdue task counts
- [x] Task completion timestamps
- [x] Clean, modern UI with Tailwind CSS

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ToDoApp
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/todoapp
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173 (or next available port)

4. **Open your browser** and navigate to the frontend URL

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering and sorting)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task as complete
- `PATCH /api/tasks/:id/reset` - Mark task as incomplete
- `GET /api/tasks/stats/overview` - Get task statistics


## Project Structure

```
ToDoApp/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── TaskStats.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## Key Features Explained

### Smart Task Status Management
- Tasks automatically become "overdue" when their due date passes
- Status updates in real-time
- Visual indicators for different statuses

### Advanced Filtering
- Multiple filter combinations possible
- Real-time search functionality
- Persistent filter state

### User Experience
- Responsive design works on desktop and mobile
- Loading states and error handling
- Confirmation dialogs prevent accidental actions
- Clean, modern interface


## Future Enhancements

This is a learning project.
Potential features to add in future:
- [ ] Task categories/tags
- [ ] Task sharing between users
- [ ] Email notifications
- [ ] Task attachments
- [ ] Dark mode
- [ ] Mobile app
- [ ] Calendar integration
- [ ] Task templates
