import random
from typing import List, Tuple
from collections import deque


def add_loops(maze: List[List[int]]) -> List[List[int]]:
    """
    Modify a perfect maze to add some loops by removing some walls randomly.

    Args:
        maze: 2D grid representing a perfect maze (0 = passage, 1 = wall)

    Returns:
        Modified maze with some loops
    """
    rows, cols = len(maze), len(maze[0])

    modified_maze = [row[:] for row in maze]

    # Add loops by removing approximately 10% of walls
    walls_to_remove = (rows * cols) // 20  # About 5% of total cells

    for _ in range(walls_to_remove):
        # Choose a random wall (not on the border)
        row = random.randint(1, rows - 2)
        col = random.randint(1, cols - 2)

        # Skip if not a wall
        if modified_maze[row][col] == 0:
            continue

        # Count adjacent passages (need at least 2 to avoid creating a dead end)
        adjacent_passages = 0
        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            if (
                0 <= row + dr < rows
                and 0 <= col + dc < cols
                and modified_maze[row + dr][col + dc] == 0
            ):
                adjacent_passages += 1

        # Remove wall if it would create a loop (connects two existing passages)
        if adjacent_passages >= 2:
            modified_maze[row][col] = 0

    return modified_maze


def add_braids(maze: List[List[int]]) -> List[List[int]]:
    """
    Modify a maze to create a "braid" maze with no dead ends.

    Args:
        maze: 2D grid representing a maze (0 = passage, 1 = wall)

    Returns:
        Modified maze with no dead ends
    """
    rows, cols = len(maze), len(maze[0])

    modified_maze = [row[:] for row in maze]

    # Find and eliminate all dead ends
    for row in range(1, rows - 1):
        for col in range(1, cols - 1):
            # Skip walls
            if modified_maze[row][col] == 1:
                continue

            # Count adjacent walls
            adjacent_walls = 0
            wall_directions = []

            for i, (dr, dc) in enumerate([(0, 1), (1, 0), (0, -1), (-1, 0)]):
                if (
                    0 <= row + dr < rows
                    and 0 <= col + dc < cols
                    and modified_maze[row + dr][col + dc] == 1
                ):
                    adjacent_walls += 1
                    wall_directions.append(i)

            # If dead end (3 adjacent walls), remove one wall
            if adjacent_walls == 3 and wall_directions:
                # Randomly choose a wall to remove
                direction = random.choice(wall_directions)
                dr, dc = [(0, 1), (1, 0), (0, -1), (-1, 0)][direction]

                # Remove the wall
                modified_maze[row + dr][col + dc] = 0

    return modified_maze


def ensure_start_end_open(maze: List[List[int]]) -> List[List[int]]:
    """
    Ensure that the start and end positions in a maze are open passages
    and that there is a valid path between them.

    Args:
        maze: 2D grid representing a maze (0 = passage, 1 = wall)

    Returns:
        Modified maze with guaranteed start/end openings and connectivity
    """
    rows, cols = len(maze), len(maze[0])

    # Make a copy to avoid modifying the original
    modified_maze = [row[:] for row in maze]

    # Define standard start and end positions
    start_row, start_col = 0, 1
    end_row, end_col = rows - 1, cols - 2

    # Ensure start position is open
    modified_maze[start_row][start_col] = 0

    # Ensure end position is open
    modified_maze[end_row][end_col] = 0

    # Check if there's a path from start to end
    if not has_path(modified_maze, (start_row, start_col), (end_row, end_col)):
        # Create a path if one doesn't exist
        create_path(modified_maze, (start_row, start_col), (end_row, end_col))

    return modified_maze


def has_path(
    maze: List[List[int]], start: Tuple[int, int], end: Tuple[int, int]
) -> bool:
    """
    Check if there is a valid path from start to end using BFS.

    Args:
        maze: 2D maze array (0 = passage, 1 = wall)
        start: (row, col) of start position
        end: (row, col) of end position

    Returns:
        True if path exists, False otherwise
    """
    rows, cols = len(maze), len(maze[0])
    visited = set()
    queue = deque([start])
    visited.add(start)

    while queue:
        r, c = queue.popleft()

        if (r, c) == end:
            return True

        # Check all four adjacent cells
        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nr, nc = r + dr, c + dc

            # Check if valid position
            if (
                0 <= nr < rows
                and 0 <= nc < cols
                and maze[nr][nc] == 0  # Is a passage
                and (nr, nc) not in visited
            ):

                queue.append((nr, nc))
                visited.add((nr, nc))

    return False


def create_path(
    maze: List[List[int]], start: Tuple[int, int], end: Tuple[int, int]
) -> None:
    """
    Create a simple path from start to end by carving through walls.

    Args:
        maze: 2D maze array (0 = passage, 1 = wall)
        start: (row, col) of start position
        end: (row, col) of end position
    """
    current_row, current_col = start
    end_row, end_col = end

    # First move horizontally to align with end column
    while current_col != end_col:
        current_col += 1 if current_col < end_col else -1
        maze[current_row][current_col] = 0  # Make it a passage

    # Then move vertically to reach end row
    while current_row != end_row:
        current_row += 1 if current_row < end_row else -1
        maze[current_row][current_col] = 0  # Make it a passage
