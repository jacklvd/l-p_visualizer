from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import maze, path, linkedlist
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="P+L Visualizer API",
    description="API for generating mazes,finding paths using various algorithms, and visualizing linked lists.",
    docs_url="/docs",
    version="1.0.0",
)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
    os.environ.get("FRONTEND_URL"),
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Include routers
app.include_router(maze.router, prefix="/api/maze", tags=["maze"])
app.include_router(path.router, prefix="/api/path", tags=["path"])
app.include_router(linkedlist.router, prefix="/api/linkedlist", tags=["linkedlist"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Algorithm Visualizer API"}
