from fastapi import APIRouter, HTTPException
from app.models.path import PathFindingRequest, PathResponse
from app.algorithms.path_finding import astar, bfs, dfs, dijkstra

router = APIRouter()


@router.post("/find", response_model=PathResponse)
async def find_path(request: PathFindingRequest):
    """Find a path through the maze using the specified algorithm."""

    # Validate maze dimensions
    if not request.maze:
        raise HTTPException(status_code=400, detail="Empty maze")

    rows = len(request.maze)
    cols = len(request.maze[0]) if rows > 0 else 0

    # Validate start and end positions
    if not (0 <= request.start.row < rows and 0 <= request.start.col < cols):
        raise HTTPException(
            status_code=400, detail="Start position is outside of maze bounds"
        )

    if not (0 <= request.end.row < rows and 0 <= request.end.col < cols):
        raise HTTPException(
            status_code=400, detail="End position is outside of maze bounds"
        )

    if request.maze[request.start.row][request.start.col] == 1:
        raise HTTPException(status_code=400, detail="Start position is a wall")

    if request.maze[request.end.row][request.end.col] == 1:
        raise HTTPException(status_code=400, detail="End position is a wall")

    # Choose and run pathfinding algorithm
    if request.algorithm.value == "bfs":
        visited, path = bfs.find_path(request.maze, request.start, request.end)
    elif request.algorithm.value == "dfs":
        visited, path = dfs.find_path(request.maze, request.start, request.end)
    elif request.algorithm.value == "astar":
        visited, path = astar.find_path(request.maze, request.start, request.end)
    elif request.algorithm.value == "dijkstra":
        visited, path = dijkstra.find_path(request.maze, request.start, request.end)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown pathfinding algorithm: {request.algorithm}",
        )

    # If no path found
    if not path:
        return PathResponse(visited=visited, path=[])

    return PathResponse(visited=visited, path=path)
