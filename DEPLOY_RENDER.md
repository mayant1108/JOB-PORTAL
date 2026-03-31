# Render Deployment

This project is prepared for a single-service Render deployment.

## What is already configured

- Frontend builds from `frontend/job-portal`
- Backend starts from `backend`
- Production server serves both API and React app
- Health check endpoint: `/api/health`
- Render blueprint file: `render.yaml`

## Before deploy

1. Push this updated code to your GitHub repository.
2. Create a MongoDB Atlas database and copy its connection string.

MongoDB Atlas docs:
- https://www.mongodb.com/developer/products/mongodb/srv-connection-strings/

## Deploy on Render

1. Open Render Dashboard.
2. Create a new Blueprint and connect this GitHub repo.
3. Render will detect `render.yaml`.
4. When prompted, set `MONGO_URI` to your MongoDB Atlas connection string.
5. Finish the deploy.

## Result

- Your React frontend will open on the Render service URL.
- Your API will be available on `/api/...`.
- Example health URL: `/api/health`
