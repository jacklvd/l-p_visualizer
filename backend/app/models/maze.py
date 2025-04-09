from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class MazeType(str, Enum):
    PERFECT = "perfect"
    LOOP = "loop"
    BRAID = "braid"


class MazeAlgorithm(str, Enum):
    BACKTRACKING = "backtracking"
    PRIM = "prim"
    KRUSKAL = "kruskal"
    ELLER = "eller"
    WILSON = "wilson"


class Cell(BaseModel):
    row: int
    col: int


class MazeGenerationRequest(BaseModel):
    rows: int = Field(..., gt=4, description="Number of rows in the maze (min 5)")
    cols: int = Field(..., gt=4, description="Number of columns in the maze (min 5)")
    algorithm: MazeAlgorithm
    maze_type: MazeType = MazeType.PERFECT


class MazeResponse(BaseModel):
    maze: List[List[int]]
    steps: List[List[List[int]]]  # Animation steps
