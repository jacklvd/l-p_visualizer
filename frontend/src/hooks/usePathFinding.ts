/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react'
import { apiClient } from '../utils/api/api'
import { animatePathFinding } from '../utils/animationHelpers'
import { Maze, Cell } from '../types/maze'
import { PathAlgorithm } from '../types/pathfinding'
import { toast } from 'sonner'

export const usePathFinding = (speed: number) => {
  const [visitedNodes, setVisitedNodes] = useState<Cell[]>([])
  const [pathNodes, setPathNodes] = useState<Cell[]>([])
  const [isFindingPath, setIsFindingPath] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Find path
  const findPath = async (
    maze: Maze,
    startNode: Cell,
    endNode: Cell,
    algorithm: PathAlgorithm,
  ) => {
    if (!maze) return

    // Cancel any previous path finding operation
    cancelPathFinding()

    // Create new abort controller
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setIsFindingPath(true)
    try {
      // Reset previous path
      setVisitedNodes([])
      setPathNodes([])

      // Check if positions are valid
      if (
        maze[startNode.row][startNode.col] === 1 ||
        maze[endNode.row][endNode.col] === 1
      ) {
        throw new Error('Start or end position is blocked by a wall!')
      }

      // Call API to find path
      const response = await apiClient.findPath({
        maze,
        start: startNode,
        end: endNode,
        algorithm,
      })

      // Check if operation was aborted
      if (abortController.signal.aborted) {
        return
      }

      // Animate path finding
      await animatePathFinding(
        response.visited,
        response.path,
        setVisitedNodes,
        setPathNodes,
        speed,
        speed / 2, // Path animation is faster than visited nodes
        abortController.signal,
      )
    } catch (error: any) {
      // Ignore abort errors
      if (error.name === 'AbortError') {
        console.log('Path finding operation was aborted')
        return
      }

      console.error('Error finding path:', error)
      // Check if it's a 400 error from the API
      if (error.response && error.response.status === 400) {
        toast.error(
          error.response.data.detail ||
            'No path can be found. The start or end position might be blocked.',
        )
      } else {
        toast.error('Error finding path. Please try again.')
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsFindingPath(false)
        abortControllerRef.current = null
      }
    }
  }

  // Cancel ongoing path finding
  const cancelPathFinding = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsFindingPath(false)
    }
  }

  return {
    visitedNodes,
    setVisitedNodes,
    pathNodes,
    setPathNodes,
    isFindingPath,
    findPath,
    cancelPathFinding,
  }
}
