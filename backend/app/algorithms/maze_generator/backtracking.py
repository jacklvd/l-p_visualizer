import random
from typing import List, Tuple, Set
from app.utils.helpers import ensure_start_end_open


def generate(rows: int, cols: int) -> Tuple[List[List[int]], List[List[List[int]]]]:
    """
    Generate a maze using recursive backtracking.

    Args:
        rows: Number of rows in the maze
        cols: Number of columns in the maze

    Returns:
        Tuple containing:
        - The generated maze as a 2D grid (0 = passage, 1 = wall)
        - Steps of the generation process for animation
    """
    # Ensure odd dimensions for proper maze
    if rows % 2 == 0:
        rows += 1
    if cols % 2 == 0:
        cols += 1

    # Initialize maze with all walls
    maze = [[1 for _ in range(cols)] for _ in range(rows)]
    steps = []

    # Mark cells at odd coordinates as open (these will be our nodes)
    for r in range(1, rows, 2):
        for c in range(1, cols, 2):
            maze[r][c] = 0

    # Record initial state
    steps.append([row[:] for row in maze])

    # Start at a random cell
    start_row = random.randrange(1, rows, 2)
    start_col = random.randrange(1, cols, 2)
    stack = [(start_row, start_col)]
    visited = {(start_row, start_col)}

    # Directions for exploring (right, down, left, up)
    directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]

    # DFS with backtracking
    while stack:
        current_row, current_col = stack[-1]

        # Get unvisited neighbors
        neighbors = []
        for dr, dc in directions:
            nr, nc = current_row + dr, current_col + dc
            if (
                0 < nr < rows
                and 0 < nc < cols
                and (nr, nc) not in visited
                and maze[nr][nc] == 0
            ):
                neighbors.append((nr, nc, dr, dc))

        # If no unvisited neighbors, backtrack
        if not neighbors:
            stack.pop()
            continue

        # Choose random unvisited neighbor
        next_row, next_col, dr, dc = random.choice(neighbors)

        # Remove wall between current cell and chosen neighbor
        maze[current_row + dr // 2][current_col + dc // 2] = 0

        # Mark as visited and push to stack
        visited.add((next_row, next_col))
        stack.append((next_row, next_col))

        # Record step
        steps.append([row[:] for row in maze])

    # Set standard start and end positions
    maze[0][1] = 0  # Start
    maze[rows - 1][cols - 2] = 0  # End

    # Ensure there's a path from start to end
    final_maze = ensure_start_end_open(maze)

    # Record final state
    steps.append([row[:] for row in final_maze])

    return final_maze, steps
