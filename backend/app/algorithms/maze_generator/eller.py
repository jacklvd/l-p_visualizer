import random
from typing import List, Tuple, Dict, Set
from app.utils.helpers import ensure_start_end_open


def generate(rows: int, cols: int) -> Tuple[List[List[int]], List[List[List[int]]]]:
    """
    Generate a maze using Eller's algorithm.

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

    # Create passages at odd-indexed positions
    for r in range(1, rows, 2):
        for c in range(1, cols, 2):
            maze[r][c] = 0

    steps.append([row[:] for row in maze])  # Record initial state

    # Initialize sets for the first row
    # Each cell in a separate set initially
    cur_set = []
    for c in range(cols):
        cur_set.append(c)

    # Dictionary to track which columns belong to each set ID
    set_id_to_cols = {}
    for c in range(1, cols, 2):  # Only odd columns (passage cells)
        set_id_to_cols[c] = [c]

    # Process each row of the maze
    for r in range(1, rows, 2):
        last_row = r + 2 >= rows

        # Step 1: Randomly connect adjacent cells in the current row
        for c in range(1, cols - 2, 2):
            if cur_set[c] != cur_set[c + 2]:
                # If cells are in different sets, randomly decide to merge them
                # Always merge if this is the last row
                should_merge = True if last_row else (random.random() < 0.5)

                if should_merge:
                    # Remove the wall between cells
                    maze[r][c + 1] = 0

                    # Merge the sets
                    old_set_id = cur_set[c + 2]
                    new_set_id = cur_set[c]

                    # Update all cells in the old set to be in the new set
                    for col in range(1, cols, 2):
                        if cur_set[col] == old_set_id:
                            cur_set[col] = new_set_id

                    # Update the set_id_to_cols mapping
                    if old_set_id in set_id_to_cols:
                        if new_set_id not in set_id_to_cols:
                            set_id_to_cols[new_set_id] = []
                        set_id_to_cols[new_set_id].extend(set_id_to_cols[old_set_id])
                        del set_id_to_cols[old_set_id]

                    steps.append([row[:] for row in maze])  # Record step

        # Skip vertical connections if this is the last row
        if last_row:
            continue

        # Step 2: Initialize the next row with new set IDs
        next_row = [i + (r + 2) * cols for i in range(cols)]

        # Step 3: For each set in current row, randomly connect at least one cell vertically
        new_set_id_to_cols = {}

        for set_id, columns in set_id_to_cols.items():
            # Determine how many vertical connections to make (at least 60% of columns in set)
            num_connections = max(1, int(len(columns) * 0.6))

            # Randomly select columns to connect vertically
            connect_cols = (
                random.sample(columns, num_connections)
                if len(columns) >= num_connections
                else columns
            )

            for col in connect_cols:
                # Connect vertically by giving the cell below the same set ID
                next_row[col] = set_id

                # Create passage down
                maze[r + 1][col] = 0

                # Add this column to the new set mapping
                if set_id not in new_set_id_to_cols:
                    new_set_id_to_cols[set_id] = []
                new_set_id_to_cols[set_id].append(col)

                steps.append([row[:] for row in maze])  # Record step

        # Step 4: Add cells that haven't been connected to their own sets
        for c in range(1, cols, 2):
            set_id = next_row[c]
            if set_id not in new_set_id_to_cols:
                new_set_id_to_cols[set_id] = [c]
            elif c not in new_set_id_to_cols[set_id]:
                new_set_id_to_cols[set_id].append(c)

        # Update current row to next row for next iteration
        cur_set = next_row
        set_id_to_cols = new_set_id_to_cols

    # Set standard start and end positions
    maze[0][1] = 0  # Start
    maze[rows - 1][cols - 2] = 0  # End

    # Ensure there's a path from start to end
    final_maze = ensure_start_end_open(maze)

    # Record final state
    steps.append([row[:] for row in final_maze])

    return final_maze, steps
