from typing import List, Tuple, Dict, Set, Deque
from collections import deque
from app.models.maze import Cell


def find_path(
    maze: List[List[int]], start: Cell, end: Cell
) -> Tuple[List[Cell], List[Cell]]:
    """
    Find a path from start to end in the maze using Breadth-First Search.

    BFS guarantees the shortest path in an unweighted graph.

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

    # Check if start or end are invalid or in walls
    if (
        start.row < 0
        or start.row >= rows
        or start.col < 0
        or start.col >= cols
        or end.row < 0
        or end.row >= rows
        or end.col < 0
        or end.col >= cols
        or maze[start.row][start.col] == 1
        or maze[end.row][end.col] == 1
    ):
        return [], []

    # List to track cells visited for animation
    visited = []

    # Queue for BFS
    queue: Deque[Cell] = deque([start])

    # For each position, which position it can most efficiently be reached from
    came_from = {}

    # Set for faster duplicate checking
    visited_set = {(start.row, start.col)}

    # Directions to explore (right, down, left, up)
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        # Get the next cell from the queue
        current = queue.popleft()

        visited.append(current)

        # If we've reached the end, reconstruct path
        if current.row == end.row and current.col == end.col:
            # Reconstruct path
            path = []
            current_pos = (current.row, current.col)
            while current_pos in came_from:
                row, col = current_pos
                path.append(Cell(row=row, col=col))
                current_pos = came_from[current_pos]
            path.append(start)  # Add start node
            path.reverse()  # Reverse to get start-to-end path
            return visited, path

        # Explore all four directions
        for dr, dc in directions:
            new_row, new_col = current.row + dr, current.col + dc

            # Skip invalid positions or walls
            if (
                new_row < 0
                or new_row >= rows
                or new_col < 0
                or new_col >= cols
                or maze[new_row][new_col] == 1
            ):
                continue

            neighbor_pos = (new_row, new_col)

            if neighbor_pos in visited_set:
                continue

            visited_set.add(neighbor_pos)
            neighbor = Cell(row=new_row, col=new_col)
            queue.append(neighbor)

            came_from[neighbor_pos] = (current.row, current.col)
    return visited, []
