# BookIt: Experiences & Slots

A fullstack React/Node app for browsing and booking travel experiences with dynamic slots, promo codes, and responsive UI matching [Figma](https://www.figma.com/design/8X6E1Ev8YdtZ3erV0Iifvb/HD-booking?node-id=0-1&p=f&t=K4scwnxfIHmfbb2a-0).

## Tech Stack
- **Frontend**: React + TypeScript (Vite), TailwindCSS, Axios
- **Backend**: Node.js + Express, MongoDB (Mongoose)

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

## Installation & Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env`:
PORT=5000
MONGODB_URI=mongodb://localhost:27017

4. Seed DB: `node seedDB.js`
5. Start server: `node app.js` (runs on `http://localhost:5000`)

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env`:
VITE_API_URL=http://localhost:5000

4. Run dev server: `npm run dev` (runs on `http://localhost:5173`)

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/experiences` | List experiences |
| GET    | `/api/experiences/:id` | Details & slots |
| POST   | `/api/bookings` | Create booking |
| POST   | `/api/promo/validate` | Validate promo |

## Deployment
- Frontend: Vercel
- Backend: Render
- Live: [Frontend]() | [Backend](https://book-my-experience.vercel.app/)
- Repo: [GitHub](https://github.com/ts-31/BookMyExperience)

## License
MIT