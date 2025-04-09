from fastapi import APIRouter, HTTPException
from app.models.maze import MazeGenerationRequest, MazeResponse
from app.algorithms.maze_generator import (
    backtracking,
    prim,
    kruskal,
    eller,
    wilson,
)

router = APIRouter()


@router.post("/generate", response_model=MazeResponse)
async def generate_maze(request: MazeGenerationRequest):
    """Generate a maze using the specified algorithm."""

    # Select algorithm based on request
    if request.algorithm.value == "backtracking":
        maze, steps = backtracking.generate(request.rows, request.cols)
    elif request.algorithm.value == "prim":
        maze, steps = prim.generate(request.rows, request.cols)
    elif request.algorithm.value == "kruskal":
        maze, steps = kruskal.generate(request.rows, request.cols)
    elif request.algorithm.value == "eller":
        maze, steps = eller.generate(request.rows, request.cols)
    elif request.algorithm.value == "wilson":
        maze, steps = wilson.generate(request.rows, request.cols)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown maze generation algorithm: {request.algorithm}",
        )

    # Modify maze based on maze_type if not perfect
    if request.maze_type.value == "loop":
        from app.utils.helpers import add_loops

        maze = add_loops(maze)
    elif request.maze_type.value == "braid":
        from app.utils.helpers import add_braids

        maze = add_braids(maze)

    return MazeResponse(maze=maze, steps=steps)
