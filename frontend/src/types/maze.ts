// Cell represents a position in the maze
export interface Cell {
  row: number
  col: number
}

// Maze types
export enum MazeType {
  PERFECT = 'perfect',
  LOOP = 'loop',
  BRAID = 'braid',
}

// Maze generation algorithms
export enum MazeAlgorithm {
  BACKTRACKING = 'backtracking',
  PRIM = 'prim',
  KRUSKAL = 'kruskal',
  ELLER = 'eller',
  WILSON = 'wilson',
}

// Maze data structure
export type Maze = number[][]

// Animation steps for maze generation
export type MazeSteps = number[][][]

// Response from maze generation API
export interface MazeResponse {
  maze: Maze
  steps: MazeSteps
}

// Request to generate a maze
export interface MazeGenerationRequest {
  rows: number
  cols: number
  algorithm: MazeAlgorithm
  maze_type: MazeType
}
