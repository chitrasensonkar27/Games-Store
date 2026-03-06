# Games Store

Games Store is a comprehensive full-stack web application built to manage and showcase a video game collection. The frontend provides an intuitive, responsive admin dashboard using React and Vite, featuring interactive elements like searchable game cards, advanced filters, modal forms for editing, and a theme toggle between light (Cupcake) and dark (Dracula) modes. The backend powers everything with a secure REST API using Node.js, Express, and MongoDB, handling data persistence, validation, and CRUD operations seamlessly. Toast notifications keep users informed of actions, while visual details like half-star ratings and dynamic pricing make the interface engaging and professional. This project serves as a solid foundation for game catalogs, admin panels, or portfolio demos, emphasizing clean code, error handling, and user-friendly design.

## Key Features

- **Complete CRUD Functionality**: Easily create, view, update, and delete games through a user-friendly modal form and card-based grid layout.
- **Smart Search and Filtering**: Real-time search by title or developer (works independently of other filters); category-based filtering (e.g., action, adventure, RPG); mode selection (Online, Offline, Both); and sorting by newest/oldest, downloads, or alphabetical order.
- **Rich Game Cards**: Each card displays key info like developer, badges for category/size, stats (downloads, size, release date), pricing (Free or ₹), and precise star ratings (full/half/empty stars with Lucide icons).
- **Enhanced UX**: Top-center toast notifications for all interactions (success, errors, confirmations); loading skeletons for smooth data fetching; responsive grid (1-4 columns based on screen size); dark/light theme toggle with localStorage persistence.
- **Robust Error Handling**: Backend validation via Mongoose schemas; frontend fallbacks for offline mode; confirmation dialogs for destructive actions like deletion.
- **Performance Optimizations**: Memoized filtering/sorting for fast re-renders; Axios with timeouts for reliable API calls.

## Technologies Used

- **Backend**: Node.js (runtime), Express.js (routing/API), MongoDB (database with Mongoose ODM), dotenv (environment config), CORS (cross-origin support).
- **Frontend**: React 18 (UI library with Vite bundler), Tailwind CSS v3 (utility-first styling), DaisyUI (component library with Cupcake/Dracula themes), Axios (HTTP client), react-hot-toast (notifications), Lucide React (icons).
- **Tools**: Git (version control), MongoDB Atlas (cloud database hosting recommended for ease).

## Setup Instructions

Setting up the project locally is straightforward and should take about 10-15 minutes. This guide assumes you have Node.js (version 18 or higher) installed—download it from [nodejs.org](https://nodejs.org) if needed. You'll also need a free MongoDB Atlas account for the database (or a local MongoDB installation). The backend must be started before the frontend to handle API requests.

### Prerequisites
- **Node.js & npm**: Verify with `node -v` and `npm -v` in your terminal (v18+ recommended).
- **Git**: For cloning (optional if downloading ZIP from GitHub).
- **MongoDB**: Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier), create a cluster, and generate a connection string. Alternatively, install local MongoDB from [mongodb.com](https://www.mongodb.com/docs/manual/installation/).
- **Code Editor**: VS Code recommended for easy file navigation and terminal integration.
- **Terminal/Command Prompt**: Built into VS Code or your OS.

### Step 1: Clone or Download the Repository
- If using Git:  
  ```
  git clone https://github.com/yourusername/games-store.git
  cd games-store
  ```
- Or download as ZIP from GitHub and extract to a folder named `games-store`.

### Step 2: Backend Setup
The backend handles API endpoints for games data and connects to MongoDB.

1. Navigate to the backend directory:  
   ```
   cd backend
   ```

2. Install dependencies:  
   ```
   npm install
   ```
   This installs Express, Mongoose, dotenv, CORS, and other packages listed in `package.json`.

3. Create the `.env` file:  
   In the backend folder, create a new file named `.env` (no extension) and add your MongoDB connection details. Example:  
   ```
   MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.xxxxx.mongodb.net/games?retryWrites=true&w=majority
   PORT=5000
   ```
   - Replace `<your-username>` and `<your-password>` with your Atlas credentials.  
   - The database name is `games` (it will auto-create if missing).  
   - For Atlas: In your cluster dashboard, go to "Connect" > "Drivers" to get the full string, and whitelist your IP (add `0.0.0.0/0` for testing—restrict later for security).

4. Start the backend server:  
   ```
   npm run dev
   ```
   - Or run `node server.js` for production mode.  
   - Success indicators: Console logs "MongoDB Connected: [host]" and "Server: http://localhost:5000/games".  
   - Test: Open http://localhost:5000/games in a browser (should show `{"success":true,"count":0,"data":[]}` if empty).

**Common Backend Issues**:  
- "Connection refused": Check MONGO_URI format and Atlas network access.  
- "Port in use": Change PORT in .env or kill the process with `npx kill-port 5000`.

### Step 3: Frontend Setup
The frontend is a single-page React app that fetches data from the backend.

1. Open a **new terminal** (keep backend running) and navigate to the frontend directory:  
   ```
   cd frontend
   ```

2. Install dependencies:  
   ```
   npm install
   ```
   This installs React, Vite, Tailwind, DaisyUI, Axios, and other frontend packages.

3. (Optional) Configure API URL:  
   If your backend isn't on localhost:5000, create a `.env` file in the frontend folder:  
   ```
   VITE_API_URL=http://your-backend-url:5000/games
   ```
   Then update `src/services/api.js` to use `import.meta.env.VITE_API_URL`.

4. Start the development server:  
   ```
   npm run dev
   ```
   - Vite will auto-open http://localhost:5173 (or another port—check the terminal).  
   - Refresh the page if it doesn't load automatically.  
   - Test: The dashboard should load with filters/search; try adding a game (it saves to MongoDB).

**Common Frontend Issues**:  
- "Backend not running" toast: Ensure backend is active (check terminal for errors).  
- Styles missing: Run `npx tailwindcss init -p` if Tailwind isn't building.  
- Port conflict: Vite suggests an alternative port.

### Step 4: Testing the Full App
- Add a game via "Add New Game" button → Verify it appears in the list.  
- Edit/delete a game → Check toast notifications and data persistence (refresh page).  
- Apply filters/search → Results should update instantly.  
- Toggle theme → Changes should persist on reload.  
- Stop/restart servers: Data remains in MongoDB.

## Deployment

To deploy for public access (e.g., on Render):  

- **Backend**: Use Render's "Web Service" → Connect GitHub repo → Build: `npm install` → Start: `node server.js` → Add `MONGO_URI` env var. URL: e.g., https://games-store-backend.onrender.com/games.  
- **Frontend**: Use Render's "Static Site" → Connect repo → Build: `npm install && npm run build` → Publish: `dist` → Update API_URL env var to backend URL. URL: e.g., https://games-store-frontend.onrender.com.  

Free tiers sleep after inactivity; use Vercel (frontend) + Railway (backend) for alternatives. After deploying backend, commit frontend changes and push for auto-redeploy.

## Additional Details

- **Database Schema**: Games model includes title (required, max 100 chars), reviews (0-5), online_or_offline (enum), subscription_price (min 0), downloads (min 0), game_size (required), release_date (required), category (enum: action, etc.), developer (required). Auto-timestamps included.
- **Limitations & Security**: No authentication (add JWT later); CORS allows all origins (restrict in production); ratings are manual inputs.
- **Contributing**: Fork the repo, create a branch for changes, submit PRs. Report bugs via GitHub Issues.
- **License**: MIT License — open-source and free to use/modify.  

Developed with care. Questions? Feel free to reach out via GitHub. Let's build more!