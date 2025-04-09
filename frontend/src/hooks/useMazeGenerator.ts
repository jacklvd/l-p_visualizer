import { useState } from 'react'
import { apiClient } from '../utils/api/api'
import { animateMazeGeneration } from '../utils/animationHelpers'
import { Maze, MazeAlgorithm, MazeType, Cell } from '../types/maze'
import { toast } from 'sonner'

export const useMazeGeneration = (
  rows: number,
  cols: number,
  speed: number,
  resetBoard: () => void,
  setStartNode: React.Dispatch<React.SetStateAction<Cell>>,
  setEndNode: React.Dispatch<React.SetStateAction<Cell>>,
) => {
  const [maze, setMaze] = useState<Maze | null>(null)
  const [isGeneratingMaze, setIsGeneratingMaze] = useState<boolean>(false)

  // Generate maze
  const generateMaze = async (algorithm: MazeAlgorithm, mazeType: MazeType) => {
    setIsGeneratingMaze(true)
    try {
      // Reset current state
      resetBoard()

      // Call API to generate maze
      const response = await apiClient.generateMaze({
        rows,
        cols,
        algorithm,
        maze_type: mazeType,
      })

      // Animate maze generation
      await animateMazeGeneration(response.steps, setMaze, speed)

      // Get the final maze state
      const finalMaze = response.steps[response.steps.length - 1]

      // Ensure start and end positions are valid
      ensureValidPositions(finalMaze)
    } catch (error) {
      console.error('Error generating maze:', error)
      toast.error('Failed to generate maze. Please try again.')
    } finally {
      setIsGeneratingMaze(false)
    }
  }

  // BFS to find if there's a path from start to end
  const hasPath = (maze: Maze, start: Cell, end: Cell): boolean => {
    const queue: Cell[] = [start]
    const visited = new Set<string>()
    visited.add(`${start.row},${start.col}`)

    // Directions: up, right, down, left
    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    while (queue.length > 0) {
      const current = queue.shift()!

      // If we reached the end
      if (current.row === end.row && current.col === end.col) {
        return true
      }

      // Check all four directions
      for (const [dr, dc] of directions) {
        const newRow = current.row + dr
        const newCol = current.col + dc

        // Check if valid cell (within bounds, is a passage, not visited)
        if (
          newRow >= 0 &&
          newRow < maze.length &&
          newCol >= 0 &&
          newCol < maze[0].length &&
          maze[newRow][newCol] === 0 && // Is a passage
          !visited.has(`${newRow},${newCol}`)
        ) {
          queue.push({ row: newRow, col: newCol })
          visited.add(`${newRow},${newCol}`)
        }
      }
    }

    // No path found
    return false
  }

  // Find nearest open cell using BFS
  const findNearestOpenCell = (
    maze: Maze,
    startRow: number,
    startCol: number,
  ): Cell => {
    const queue: [number, number, number][] = [[startRow, startCol, 0]] // row, col, distance
    const visited = new Set<string>([`${startRow},${startCol}`])

    // Check the start point first
    if (
      startRow >= 0 &&
      startRow < maze.length &&
      startCol >= 0 &&
      startCol < maze[0].length &&
      maze[startRow][startCol] === 0
    ) {
      return { row: startRow, col: startCol }
    }

    // BFS to find nearest open cell
    while (queue.length > 0) {
      const [row, col, dist] = queue.shift()!

      // Try all four directions
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const newRow = row + dr
        const newCol = col + dc
        const key = `${newRow},${newCol}`

        // Check if valid position
        if (
          newRow >= 0 &&
          newRow < maze.length &&
          newCol >= 0 &&
          newCol < maze[0].length &&
          !visited.has(key)
        ) {
          visited.add(key)

          // If it's an open cell, return it
          if (maze[newRow][newCol] === 0) {
            return { row: newRow, col: newCol }
          }

          // Add to queue to continue searching
          queue.push([newRow, newCol, dist + 1])
        }
      }
    }

    // Fallback - shouldn't reach here if maze has any open cells
    return { row: startRow, col: startCol }
  }

  // Create a path between two cells by carving through walls
  const createPath = (maze: Maze, start: Cell, end: Cell): void => {
    let { row: currentRow, col: currentCol } = start

    // Simple approach: carve a path by moving horizontally then vertically
    // First move horizontally to align with end column
    while (currentCol !== end.col) {
      currentCol += currentCol < end.col ? 1 : -1
      maze[currentRow][currentCol] = 0 // Make it a passage
    }

    // Then move vertically to reach end row
    while (currentRow !== end.row) {
      currentRow += currentRow < end.row ? 1 : -1
      maze[currentRow][currentCol] = 0 // Make it a passage
    }
  }

  // Ensure start and end positions are valid (not walls) and connected
  const ensureValidPositions = (maze: Maze) => {
    // Default positions
    const preferredStart: Cell = { row: 0, col: 1 }
    const preferredEnd: Cell = { row: rows - 1, col: cols - 2 }

    // Check if preferred positions are open
    const startIsOpen = maze[preferredStart.row][preferredStart.col] === 0
    const endIsOpen = maze[preferredEnd.row][preferredEnd.col] === 0

    // Select start node
    let actualStart: Cell
    if (startIsOpen) {
      actualStart = preferredStart
    } else {
      // Find nearest open cell for start
      actualStart = findNearestOpenCell(maze, 0, 0)
      // Force the preferred start to be open
      maze[preferredStart.row][preferredStart.col] = 0
      actualStart = preferredStart
    }

    // Select end node
    let actualEnd: Cell
    if (endIsOpen) {
      actualEnd = preferredEnd
    } else {
      // Find nearest open cell for end
      actualEnd = findNearestOpenCell(maze, rows - 1, cols - 1)
      // Force the preferred end to be open
      maze[preferredEnd.row][preferredEnd.col] = 0
      actualEnd = preferredEnd
    }

    // Check if there's a path from start to end
    if (!hasPath(maze, actualStart, actualEnd)) {
      // If no path exists, create one
      createPath(maze, actualStart, actualEnd)
    }

    // Update state with the final positions
    setStartNode(actualStart)
    setEndNode(actualEnd)
  }

  // Check maze validity
  const checkMazeValidity = (startNode: Cell, endNode: Cell) => {
    if (!maze) return

    // Check if start and end are open
    if (maze[startNode.row][startNode.col] === 1) {
      toast.error(
        'Start position is blocked by a wall! Please reset or generate a new maze.',
      )
      return
    }

    if (maze[endNode.row][endNode.col] === 1) {
      toast.error(
        'End position is blocked by a wall! Please reset or generate a new maze.',
      )
      return
    }

    // Check if there's a path between start and end
    if (!hasPath(maze, startNode, endNode)) {
      toast.error(
        'No path exists between start and end! Please reset or generate a new maze.',
      )
      return
    }

    toast.success('Maze is valid! A path exists between start and end.')
  }

  return {
    maze,
    setMaze,
    isGeneratingMaze,
    generateMaze,
    checkMazeValidity,
  }
}
