import React, { useState, useEffect } from 'react'
import Grid from './components/grid'
import Controls from './components/controls'
import MazeSelector from './components/maze-selector'
import SpeedControl from './components/speed-control'
import LinkedListPage from './components/linkedlist'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { useMazeGeneration } from './hooks/useMazeGenerator'
import { usePathFinding } from './hooks/usePathFinding'
import { Maze, MazeAlgorithm, MazeType, Cell } from './types/maze'
import { PathAlgorithm } from './types/pathfinding'

const App: React.FC = () => {
  // App mode state
  const [mode, setMode] = useState<'maze' | 'linkedlist'>('maze')

  // Grid configuration
  const [rows] = useState<number>(30)
  const [cols] = useState<number>(30)
  const [cellSize] = useState<number>(25)

  // Node state
  const [startNode, setStartNode] = useState<Cell>({ row: 0, col: 1 })
  const [endNode, setEndNode] = useState<Cell>({ row: rows - 1, col: cols - 2 })

  // Algorithm selection
  const [pathAlgorithm, setPathAlgorithm] = useState<PathAlgorithm>(
    PathAlgorithm.A_STAR,
  )
  const [mazeAlgorithm, setMazeAlgorithm] = useState<MazeAlgorithm>(
    MazeAlgorithm.BACKTRACKING,
  )
  const [mazeType, setMazeType] = useState<MazeType>(MazeType.PERFECT)

  // Animation speed
  const [speed, setSpeed] = useState<number>(30)

  // Reset the board
  const resetBoard = () => {
    // Create empty maze
    const emptyMaze: Maze = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0))
    setMaze(emptyMaze)

    // Cancel any ongoing path finding
    pathFinding.cancelPathFinding()

    // Reset path finding state
    pathFinding.setVisitedNodes([])
    pathFinding.setPathNodes([])

    // Reset start and end nodes
    setStartNode({ row: 0, col: 1 })
    setEndNode({ row: rows - 1, col: cols - 2 })
  }

  // Use custom hooks
  const { maze, setMaze, isGeneratingMaze, generateMaze, checkMazeValidity } =
    useMazeGeneration(rows, cols, speed, resetBoard, setStartNode, setEndNode)

  const pathFinding = usePathFinding(speed)

  // Initialize empty maze
  useEffect(() => {
    resetBoard()
  }, [rows, cols])

  // Handle cell click to set start/end nodes
  const handleCellClick = (row: number, col: number) => {
    // Skip if animation is in progress
    if (isGeneratingMaze || pathFinding.isFindingPath) return

    // Skip if clicked on a wall
    if (maze && maze[row][col] === 1) return

    // Toggle between setting start and end nodes
    if (row === startNode.row && col === startNode.col) {
      // Clicked on start node - do nothing
      return
    } else if (row === endNode.row && col === endNode.col) {
      // Clicked on end node - do nothing
      return
    } else {
      // Set as new end node
      setEndNode({ row, col })
    }
  }

  // Generate maze wrapper
  const handleGenerateMaze = async () => {
    await generateMaze(mazeAlgorithm, mazeType)
  }

  // Find path wrapper
  const handleFindPath = async () => {
    if (!maze) return
    await pathFinding.findPath(maze, startNode, endNode, pathAlgorithm)
  }

  // Check maze validity wrapper
  const handleCheckMazeValidity = () => {
    checkMazeValidity(startNode, endNode)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">P + L Visualizer</h1>

      {/* Mode selector */}
      <div className="max-w-6xl mx-auto mb-6">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as 'maze' | 'linkedlist')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="maze">Maze & Path Finding</TabsTrigger>
            <TabsTrigger value="linkedlist">
              LinkedList Visualization
            </TabsTrigger>
          </TabsList>

          {/* Maze & Pathfinding Content */}
          <TabsContent value="maze">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 flex flex-col space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <MazeSelector
                    mazeAlgorithm={mazeAlgorithm}
                    setMazeAlgorithm={setMazeAlgorithm}
                    mazeType={mazeType}
                    setMazeType={setMazeType}
                    onGenerateMaze={handleGenerateMaze}
                    disabled={isGeneratingMaze || pathFinding.isFindingPath}
                  />

                  <SpeedControl
                    speed={speed}
                    setSpeed={setSpeed}
                    disabled={isGeneratingMaze || pathFinding.isFindingPath}
                  />
                  <Button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleCheckMazeValidity}
                    disabled={
                      !maze || isGeneratingMaze || pathFinding.isFindingPath
                    }
                  >
                    Check Maze
                  </Button>
                </div>

                <Controls
                  algorithm={pathAlgorithm}
                  setAlgorithm={setPathAlgorithm}
                  onFindPath={handleFindPath}
                  onReset={resetBoard}
                  disabled={
                    isGeneratingMaze || pathFinding.isFindingPath || !maze
                  }
                />
              </div>

              <div className="text-center mb-4 text-sm text-gray-400">
                {isGeneratingMaze && <p>Generating maze... Please wait.</p>}
                {pathFinding.isFindingPath && (
                  <p>Finding path... Please wait.</p>
                )}
                {!isGeneratingMaze && !pathFinding.isFindingPath && (
                  <p>
                    Click "Generate Maze" to create a maze, then "Find Path" to
                    solve it.
                  </p>
                )}
              </div>

              <div className="bg-gray-800 p-4 rounded-lg shadow-xl overflow-auto">
                <div className="flex justify-center">
                  <Grid
                    rows={rows}
                    cols={cols}
                    cellSize={cellSize}
                    maze={maze}
                    startNode={startNode}
                    endNode={endNode}
                    visitedNodes={pathFinding.visitedNodes}
                    pathNodes={pathFinding.pathNodes}
                    wallNodes={[]}
                    onCellClick={handleCellClick}
                    isGeneratingMaze={isGeneratingMaze}
                    isFindingPath={pathFinding.isFindingPath}
                  />
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                <p className="mb-1">
                  <span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>{' '}
                  Start Node
                  <span className="inline-block w-3 h-3 bg-red-500 ml-4 mr-1"></span>{' '}
                  End Node
                  <span className="inline-block w-3 h-3 bg-blue-600 ml-4 mr-1"></span>{' '}
                  Wall
                  <span className="inline-block w-3 h-3 bg-blue-300 ml-4 mr-1"></span>{' '}
                  Visited Node
                  <span className="inline-block w-3 h-3 bg-yellow-400 ml-4 mr-1"></span>{' '}
                  Path Node
                </p>
              </div>
            </div>
          </TabsContent>

          {/* LinkedList Visualization Content */}
          <TabsContent value="linkedlist">
            <LinkedListPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
