import { Dispatch, SetStateAction } from 'react'
import { Maze, Cell } from '../types/maze'

/**
 * Animate the maze generation process
 *
 * @param steps Array of maze steps for animation
 * @param setMaze State setter for the maze
 * @param speed Animation speed (delay in milliseconds)
 * @returns Promise that resolves when animation is complete
 */
export const animateMazeGeneration = async (
  steps: Maze[],
  setMaze: Dispatch<SetStateAction<Maze | null>>,
  speed: number,
): Promise<void> => {
  // Adjust speed based on the number of steps
  const adjustedSpeed = steps.length > 100 ? Math.max(10, speed / 3) : speed

  // Use a more efficient animation approach with fewer state updates
  // Group steps to reduce the number of state updates
  const stepSize = steps.length > 200 ? 3 : steps.length > 100 ? 2 : 1

  for (let i = 0; i < steps.length; i += stepSize) {
    await new Promise<void>((resolve) => {
      // Use requestAnimationFrame for smoother animations
      window.requestAnimationFrame(() => {
        setMaze(steps[i])
        // Use setTimeout for the delay
        setTimeout(resolve, adjustedSpeed)
      })
    })
  }

  // Always show the final state
  if (steps.length > 0) {
    setMaze(steps[steps.length - 1])
  }
}

/**
 * Animate the path finding process
 *
 * @param visitedNodes Array of visited nodes for animation
 * @param pathNodes Array of nodes in the final path
 * @param setVisitedNodes State setter for visited nodes
 * @param setPathNodes State setter for path nodes
 * @param visitedSpeed Animation speed for visited nodes (delay in milliseconds)
 * @param pathSpeed Animation speed for path nodes (delay in milliseconds)
 * @returns Promise that resolves when animation is complete
 */
export const animatePathFinding = async (
  visitedNodes: Cell[],
  pathNodes: Cell[],
  setVisitedNodes: Dispatch<SetStateAction<Cell[]>>,
  setPathNodes: Dispatch<SetStateAction<Cell[]>>,
  visitedSpeed: number,
  pathSpeed: number,
  abortSignal?: AbortSignal,
): Promise<void> => {
  // Reset state
  setVisitedNodes([])
  setPathNodes([])

  // Check if operation was aborted
  if (abortSignal?.aborted) return

  // Adjust speed based on the number of nodes
  const adjustedVisitedSpeed =
    visitedNodes.length > 500
      ? Math.max(5, visitedSpeed / 10)
      : visitedNodes.length > 200
        ? Math.max(10, visitedSpeed / 5)
        : visitedSpeed

  // Group nodes for efficiency in large mazes
  const visitedStepSize =
    visitedNodes.length > 500 ? 10 : visitedNodes.length > 200 ? 5 : 1

  // Animate visited nodes
  const visitedChunks: Cell[][] = []
  for (let i = 0; i < visitedNodes.length; i += visitedStepSize) {
    visitedChunks.push(visitedNodes.slice(i, i + visitedStepSize))
  }

  let currentVisited: Cell[] = []

  for (const chunk of visitedChunks) {
    // Check if operation was aborted
    if (abortSignal?.aborted) return

    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => {
        currentVisited = [...currentVisited, ...chunk]
        setVisitedNodes([...currentVisited])
        setTimeout(resolve, adjustedVisitedSpeed)
      })
    })
  }

  // Check if operation was aborted
  if (abortSignal?.aborted) return

  // Ensure all visited nodes are shown
  setVisitedNodes(visitedNodes)

  // Animate path nodes (if a path was found)
  if (pathNodes.length > 0) {
    const pathStepSize = pathNodes.length > 100 ? 3 : 1

    let currentPath: Cell[] = []

    for (let i = 0; i < pathNodes.length; i += pathStepSize) {
      // Check if operation was aborted
      if (abortSignal?.aborted) return

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          currentPath = [
            ...currentPath,
            ...pathNodes.slice(i, i + pathStepSize),
          ]
          setPathNodes([...currentPath])
          setTimeout(resolve, pathSpeed)
        })
      })
    }

    // Check if operation was aborted
    if (abortSignal?.aborted) return

    // Ensure the complete path is shown
    setPathNodes(pathNodes)
  }
}
