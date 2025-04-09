import random
from typing import List, Tuple, Dict


def generate(rows: int, cols: int) -> Tuple[List[List[int]], List[List[List[int]]]]:
    """
    Generate a maze using Kruskal's algorithm.

    This implementation uses a disjoint-set data structure with path compression
    and union by rank to track connected components efficiently.

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

    # Create cells at odd coordinates (for passages)
    cells = []
    for r in range(1, rows, 2):
        for c in range(1, cols, 2):
            maze[r][c] = 0  # Mark as passage
            cells.append((r, c))

    steps.append([row[:] for row in maze])  # Record initial state

    # Disjoint-set data structure implementation
    parent = {cell: cell for cell in cells}
    rank = {cell: 0 for cell in cells}

    def find(cell):
        """Find the representative of the set containing cell with path compression."""
        if parent[cell] != cell:
            parent[cell] = find(parent[cell])
        return parent[cell]

    def union(cell1, cell2):
        """Union the sets containing cell1 and cell2 using rank heuristic."""
        root1 = find(cell1)
        root2 = find(cell2)

        if root1 != root2:
            # Union by rank - attach smaller rank tree under root of higher rank tree
            if rank[root1] < rank[root2]:
                parent[root1] = root2
            else:
                parent[root2] = root1
                if rank[root1] == rank[root2]:
                    rank[root1] += 1
            return True
        return False

    # Generate all possible walls between adjacent cells
    walls = []

    # Horizontal walls
    for r in range(1, rows, 2):
        for c in range(1, cols - 2, 2):
            walls.append(((r, c), (r, c + 2), (r, c + 1)))  # (cell1, cell2, wall)

    # Vertical walls
    for r in range(1, rows - 2, 2):
        for c in range(1, cols, 2):
            walls.append(((r, c), (r + 2, c), (r + 1, c)))  # (cell1, cell2, wall)

    # Shuffle walls for randomness
    random.shuffle(walls)

    # Remove walls to create the maze
    for cell1, cell2, wall in walls:
        if find(cell1) != find(cell2):
            # Remove the wall
            maze[wall[0]][wall[1]] = 0

            # Union the sets
            union(cell1, cell2)

            steps.append([row[:] for row in maze])  # Record step

    # Ensure start and end are open
    maze[0][1] = 0  # Start
    maze[rows - 1][cols - 2] = 0  # End
    steps.append([row[:] for row in maze])  # Final state

    return maze, steps
