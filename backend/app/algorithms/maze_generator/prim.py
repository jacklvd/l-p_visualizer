import random
from typing import List, Tuple, Set
from app.utils.helpers import ensure_start_end_open


def generate(rows: int, cols: int) -> Tuple[List[List[int]], List[List[List[int]]]]:
    """
    Generate a maze using Prim's algorithm.

    This is a randomized version of Prim's algorithm for maze generation.

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

    # Possible directions to move: right, down, left, up
    FRONTIER_DIRECTIONS = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    # Choose a random starting cell (at odd coordinates)
    start_row = random.randrange(1, rows, 2)
    start_col = random.randrange(1, cols, 2)

    # Mark starting cell as a passage
    maze[start_row][start_col] = 0
    steps.append([row[:] for row in maze])  # Record initial state

    # Keep track of visited cells to prevent loops
    visited_cells = {(start_row, start_col)}

    # Add initial frontiers (cells that are 2 away from the start)
    frontier_list = []
    for dr, dc in FRONTIER_DIRECTIONS:
        frontier_row = start_row + dr * 2
        frontier_col = start_col + dc * 2
        if 0 < frontier_row < rows and 0 < frontier_col < cols:
            frontier_list.append(
                {"row": frontier_row, "col": frontier_col, "direction": (dr, dc)}
            )

    # Process frontiers until none remain
    while frontier_list:
        # Choose a random frontier
        random_index = random.randrange(len(frontier_list))
        frontier = frontier_list.pop(random_index)

        frontier_row = frontier["row"]
        frontier_col = frontier["col"]
        direction = frontier["direction"]

        # Skip if already visited
        if (frontier_row, frontier_col) in visited_cells:
            continue

        # Mark as visited
        visited_cells.add((frontier_row, frontier_col))

        # Check if it's a valid frontier (within bounds)
        if 0 < frontier_row < rows and 0 < frontier_col < cols:
            # Find the cell between frontier and its parent
            in_between_row = frontier_row - direction[0]
            in_between_col = frontier_col - direction[1]

            # Mark frontier and the cell between as passages
            maze[frontier_row][frontier_col] = 0
            maze[in_between_row][in_between_col] = 0

            steps.append([row[:] for row in maze])  # Record step

            # Add new frontiers
            for dr, dc in FRONTIER_DIRECTIONS:
                new_frontier_row = frontier_row + dr * 2
                new_frontier_col = frontier_col + dc * 2

                # Check if the new frontier is valid and not visited
                if (
                    0 < new_frontier_row < rows
                    and 0 < new_frontier_col < cols
                    and (new_frontier_row, new_frontier_col) not in visited_cells
                    and maze[new_frontier_row][new_frontier_col] == 1
                ):  # Still a wall

                    frontier_list.append(
                        {
                            "row": new_frontier_row,
                            "col": new_frontier_col,
                            "direction": (dr, dc),
                        }
                    )

    # Set standard start and end positions
    maze[0][1] = 0  # Start
    maze[rows - 1][cols - 2] = 0  # End

    # Ensure there's a path from start to end
    final_maze = ensure_start_end_open(maze)

    # Record final state
    steps.append([row[:] for row in final_maze])

    return final_maze, steps
