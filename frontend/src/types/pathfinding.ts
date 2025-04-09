import { Cell, Maze } from './maze'

// Pathfinding algorithms
export enum PathAlgorithm {
  BFS = 'bfs',
  DFS = 'dfs',
  A_STAR = 'astar',
  DIJKSTRA = 'dijkstra',
}

// Request to find a path
export interface PathFindingRequest {
  maze: Maze
  start: Cell
  end: Cell
  algorithm: PathAlgorithm
}

// Response from pathfinding API
export interface PathResponse {
  visited: Cell[] // Cells visited during search (for animation)
  path: Cell[] // Final path from start to end
}
