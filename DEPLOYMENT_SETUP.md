# Production Deployment Setup

## 1. Frontend (Vercel)
✅ Done: https://e-learning-project-five-lyart.vercel.app

Fix routing 404:
- Replace `<a href>` with `<Link>` from react-router-dom

## 2. Backend (Render)
- Add `pg` dependency: `npm i pg`
- Update db.js for Supabase Postgres
- Set env vars on Render dashboard

## 3. Database (Supabase)
- Run schema migration (convert MySQL→Postgres SQL)
- Set DATABASE_URL env var

## Backend Env Vars (Render)
```
DB_HOST=your-supabase-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=true
JWT_SECRET=your-secret
```

## Client Env Vars (Vercel)
```
VITE_BACKEND_URL=https://your-render-app.onrender.com/api
```

## Quick Deploy Commands
1. Backend: `git push origin main` (triggers Render)
2. Frontend: `vercel --prod`
