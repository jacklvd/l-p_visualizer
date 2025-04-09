from pydantic import BaseModel
from typing import List
from enum import Enum
from app.models.maze import Cell


class PathAlgorithm(str, Enum):
    BFS = "bfs"
    DFS = "dfs"
    A_STAR = "astar"
    DIJKSTRA = "dijkstra"


class PathFindingRequest(BaseModel):
    maze: List[List[int]]
    start: Cell
    end: Cell
    algorithm: PathAlgorithm


class PathResponse(BaseModel):
    visited: List[Cell]  # Cells visited during algorithm execution (for animation)
    path: List[Cell]  # Final path from start to end
