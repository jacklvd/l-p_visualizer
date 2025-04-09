from typing import List, Tuple, Dict
import heapq
from app.models.maze import Cell


def find_path(
    maze: List[List[int]], start: Cell, end: Cell
) -> Tuple[List[Cell], List[Cell]]:
    """
    Find a path from start to end in the maze using Dijkstra's algorithm.

    While Dijkstra's algorithm is typically used for weighted graphs, in an unweighted
    graph like this maze, it essentially behaves similarly to BFS but is included
    for completeness and educational purposes.

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

    # Priority queue for Dijkstra
    # Format: (distance, entry_count, cell)
    pq = []
    entry_count = 0  # Unique identifier for entries with equal distance

    # Add start node to priority queue
    heapq.heappush(pq, (0, entry_count, start))
    entry_count += 1

    # For each position, the cost of getting from the start node to that position
    distance = {}
    distance[(start.row, start.col)] = 0

    # For each position, which position it can most efficiently be reached from
    came_from = {}

    # Set for faster duplicate checking
    in_queue = {(start.row, start.col)}

    # Set of finalized nodes (where we know the shortest path)
    finalized = set()

    while pq:
        # Get the node with the smallest distance
        current_distance, _, current = heapq.heappop(pq)
        current_pos = (current.row, current.col)

        # Remove from queue lookup
        in_queue.remove(current_pos)

        # Skip if already processed
        if current_pos in finalized:
            continue

        # Mark as finalized
        finalized.add(current_pos)
        visited.append(current)

        # If we've reached the end, reconstruct the path
        if current.row == end.row and current.col == end.col:
            path = []
            while current_pos in came_from:
                row, col = current_pos
                path.append(Cell(row=row, col=col))
                current_pos = came_from[current_pos]
            path.append(start)  # Add start node
            path.reverse()  # Reverse to get start-to-end path
            return visited, path

        # Check all four neighbors
        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            neighbor_row, neighbor_col = current.row + dr, current.col + dc

            # Skip invalid positions or walls
            if (
                neighbor_row < 0
                or neighbor_row >= rows
                or neighbor_col < 0
                or neighbor_col >= cols
                or maze[neighbor_row][neighbor_col] == 1
            ):
                continue

            neighbor_pos = (neighbor_row, neighbor_col)

            # Skip if already finalized
            if neighbor_pos in finalized:
                continue

            # Calculate new distance (in unweighted graph, edge weight is always 1)
            new_distance = current_distance + 1

            # If we found a shorter path to this neighbor
            if neighbor_pos not in distance or new_distance < distance[neighbor_pos]:
                # Update distance and came_from
                distance[neighbor_pos] = new_distance
                came_from[neighbor_pos] = current_pos

                # Add to priority queue if not already there
                if neighbor_pos not in in_queue:
                    heapq.heappush(
                        pq,
                        (
                            new_distance,
                            entry_count,
                            Cell(row=neighbor_row, col=neighbor_col),
                        ),
                    )
                    entry_count += 1
                    in_queue.add(neighbor_pos)

    # No path found
    return visited, []
