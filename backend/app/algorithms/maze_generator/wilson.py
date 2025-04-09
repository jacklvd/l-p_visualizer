import random
from typing import List, Tuple, Set
from app.utils.helpers import ensure_start_end_open


def generate(rows: int, cols: int) -> Tuple[List[List[int]], List[List[List[int]]]]:
    """
    Generate a maze using Wilson's algorithm.

    Wilson's algorithm uses loop-erased random walks to create unbiased mazes.

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

    # Mark cells as potential passage points (at odd coordinates)
    cells = []
    for r in range(1, rows, 2):
        for c in range(1, cols, 2):
            cells.append((r, c))
            maze[r][c] = 0  # Mark as potential passage

    steps.append([row[:] for row in maze])  # Record initial state

    # Possible directions to move: right, down, left, up
    directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]

    # Set of cells that are part of the maze
    in_maze = set()

    # Start with a random cell
    start_cell = random.choice(cells)
    in_maze.add(start_cell)

    # Continue until all cells are in the maze
    while len(in_maze) < len(cells):
        # Choose a random cell not in the maze to start a new path
        current = random.choice([cell for cell in cells if cell not in in_maze])

        # Create a path from current cell to anywhere in the maze
        path = [current]

        # Track the chosen direction for each cell during the random walk
        cell_to_direction = {}

        # Perform a random walk until we hit a cell in the maze
        while path[-1] not in in_maze:
            r, c = path[-1]

            # Shuffle directions for randomness
            random_directions = random.sample(directions, len(directions))

            found_next = False
            for dr, dc in random_directions:
                nr, nc = r + dr, c + dc

                # Check if the neighbor is valid (within maze bounds)
                if 0 < nr < rows and 0 < nc < cols:
                    next_cell = (nr, nc)
                    cell_to_direction[(r, c)] = (dr, dc)

                    # If this creates a loop in our path, erase the loop
                    if next_cell in path:
                        # Loop erasure - remove all cells from path after the first occurrence of next_cell
                        path = path[: path.index(next_cell) + 1]
                    else:
                        path.append(next_cell)

                    found_next = True
                    break

            # If no valid move is found, we've reached a dead end or isolated region
            # This shouldn't happen in a proper grid, but handle it just in case
            if not found_next and len(path) > 1:
                path.pop()  # Backtrack

        # Add the path to the maze
        for i in range(len(path) - 1):
            # Add current cell to the maze
            in_maze.add(path[i])

            # Get the direction from this cell to the next
            r, c = path[i]
            dr, dc = cell_to_direction[(r, c)]

            # Connect with the next cell by removing the wall between them
            wall_r, wall_c = r + dr // 2, c + dc // 2
            maze[wall_r][wall_c] = 0

            steps.append([row[:] for row in maze])  # Record step

    # Set standard start and end positions
    maze[0][1] = 0  # Start
    maze[rows - 1][cols - 2] = 0  # End

    # Ensure there's a path from start to end
    final_maze = ensure_start_end_open(maze)

    # Record final state
    steps.append([row[:] for row in final_maze])

    return final_maze, steps
