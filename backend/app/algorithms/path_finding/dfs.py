from typing import List, Tuple
from app.models.maze import Cell


def find_path(
    maze: List[List[int]], start: Cell, end: Cell
) -> Tuple[List[Cell], List[Cell]]:
    """
    Find a path from start to end in the maze using Depth-First Search.

    Args:
        maze: 2D grid representing the maze (0 = passage, 1 = wall)
        start: Starting cell position
        end: Target cell position

    Returns:
        Tuple containing:
        - List of cells visited during the search (for animation)
        - List of cells forming the path from start to end (empty if no path)
    """
    rows, cols = len(maze), len(maze[0])

    # Validate that start and end positions are valid and not walls
    if (
        start.row < 0
        or start.row >= rows
        or start.col < 0
        or start.col >= cols
        or end.row < 0
        or end.row >= rows
        or end.col < 0
        or end.col >= cols
    ):
        return [], []  # Invalid coordinates

    if maze[start.row][start.col] == 1 or maze[end.row][end.col] == 1:
        # Print for debugging
        print(
            f"Start ({start.row},{start.col}) or End ({end.row},{end.col}) is a wall!"
        )
        print(
            f"Start value: {maze[start.row][start.col]}, End value: {maze[end.row][end.col]}"
        )
        return [], []  # Start or end is a wall

    # List to track cells visited for animation
    visited = []

    # Stack for DFS
    stack = [start]

    # For each position, which position it can be reached from
    came_from = {}

    # Set for faster lookup of visited cells
    visited_set = set()

    while stack:
        # Get the top cell from the stack
        current = stack.pop()
        current_pos = (current.row, current.col)

        # Skip if already visited
        if current_pos in visited_set:
            continue

        # Mark as visited
        visited_set.add(current_pos)
        visited.append(current)

        # If we've reached the end, reconstruct path
        if current.row == end.row and current.col == end.col:
            path = []
            while current_pos in came_from:
                row, col = current_pos
                path.append(Cell(row=row, col=col))
                current_pos = came_from[current_pos]
            path.append(start)  # Add start node
            path.reverse()  # Reverse to get start-to-end path
            return visited, path

        # Explore all four directions (in reverse order for natural DFS behavior)
        for dr, dc in [(-1, 0), (0, -1), (1, 0), (0, 1)]:  # Up, Left, Down, Right
            new_row, new_col = current.row + dr, current.col + dc

            # Check if valid (in bounds, not a wall, not visited)
            if (
                0 <= new_row < rows
                and 0 <= new_col < cols
                and maze[new_row][new_col] == 0  # Must be a passage
                and (new_row, new_col) not in visited_set
            ):

                # Create new cell
                neighbor = Cell(row=new_row, col=new_col)

                # Add to stack
                stack.append(neighbor)

                # Record how we got here (for path reconstruction)
                came_from[(new_row, new_col)] = current_pos

    return visited, []
