from typing import List, Tuple, Dict
from app.models.maze import Cell
import heapq


def find_path(
    maze: List[List[int]], start: Cell, end: Cell
) -> Tuple[List[Cell], List[Cell]]:
    """
    Find a path from start to end in the maze using the A* algorithm.

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

    # Manhattan distance heuristic
    def heuristic(a: Cell, b: Cell) -> int:
        return abs(a.row - b.row) + abs(a.col - b.col)

    # Priority queue for A*
    open_set = []
    entry_count = 0  # Unique identifier for each entry

    # For each position, which position it can most efficiently be reached from
    came_from = {}

    # For each position, the cost of getting from the start node to that position
    g_score = {}
    g_score[(start.row, start.col)] = 0

    # For each position, the estimated total cost from start to goal going through this position
    f_score = {}
    f_score[(start.row, start.col)] = heuristic(start, end)

    # Add start to open set
    heapq.heappush(open_set, (f_score[(start.row, start.col)], entry_count, start))
    entry_count += 1

    # Set of positions in the open set (for faster lookup)
    open_set_hash = {(start.row, start.col)}

    while open_set:
        # Get position with lowest f_score
        _, _, current = heapq.heappop(open_set)
        current_pos = (current.row, current.col)

        # Remove from open set
        open_set_hash.remove(current_pos)

        # If we reach the end, construct the path
        if current.row == end.row and current.col == end.col:
            # Reconstruct path
            path = []
            while current_pos in came_from:
                row, col = current_pos
                path.append(Cell(row=row, col=col))
                current_pos = came_from[current_pos]
            # Add start node
            path.append(start)
            # Reverse to get start-to-end path
            path.reverse()
            return visited, path

        # Add to visited list for animation
        visited.append(current)

        # Check all four neighbors
        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            neighbor_row, neighbor_col = current.row + dr, current.col + dc

            # Check if valid position and not a wall
            if (
                0 <= neighbor_row < rows
                and 0 <= neighbor_col < cols
                and maze[neighbor_row][neighbor_col] == 0
            ):  # Must be a passage

                neighbor_pos = (neighbor_row, neighbor_col)

                # Calculate tentative g score
                tentative_g = g_score[current_pos] + 1

                # If this is a better path to this neighbor
                if neighbor_pos not in g_score or tentative_g < g_score[neighbor_pos]:

                    # Update path info
                    came_from[neighbor_pos] = current_pos
                    g_score[neighbor_pos] = tentative_g
                    f = tentative_g + heuristic(
                        Cell(row=neighbor_row, col=neighbor_col), end
                    )
                    f_score[neighbor_pos] = f

                    if neighbor_pos not in open_set_hash:
                        # Add to open set
                        entry_count += 1
                        heapq.heappush(
                            open_set,
                            (f, entry_count, Cell(row=neighbor_row, col=neighbor_col)),
                        )
                        open_set_hash.add(neighbor_pos)

    return visited, []
