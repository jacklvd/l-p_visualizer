import React, { useMemo, useCallback } from 'react'
import { Cell, Maze } from '../types/maze'

interface GridProps {
  rows: number
  cols: number
  cellSize: number
  maze: Maze | null
  startNode: Cell
  endNode: Cell
  visitedNodes: Cell[]
  pathNodes: Cell[]
  wallNodes: Cell[]
  isGeneratingMaze: boolean
  isFindingPath: boolean
  onCellClick?: (row: number, col: number) => void
}

const Grid: React.FC<GridProps> = ({
  rows,
  cols,
  cellSize = 25,
  maze = null,
  startNode,
  endNode,
  visitedNodes = [],
  pathNodes = [],
  wallNodes = [],
  isGeneratingMaze = false,
  isFindingPath = false,
  onCellClick = () => {},
}) => {
  // Create lookup maps for faster cell state checks
  const visitedNodesMap = useMemo(() => {
    const map = new Map()
    visitedNodes.forEach((node) => {
      map.set(`${node.row},${node.col}`, true)
    })
    return map
  }, [visitedNodes])

  const pathNodesMap = useMemo(() => {
    const map = new Map()
    pathNodes.forEach((node) => {
      map.set(`${node.row},${node.col}`, true)
    })
    return map
  }, [pathNodes])

  const wallNodesMap = useMemo(() => {
    const map = new Map()
    wallNodes.forEach((node) => {
      map.set(`${node.row},${node.col}`, true)
    })
    return map
  }, [wallNodes])

  // More efficient cell class determination
  const getCellClass = useCallback(
    (row: number, col: number): string => {
      const isStart = row === startNode.row && col === startNode.col
      const isEnd = row === endNode.row && col === endNode.col
      const isPath = pathNodesMap.has(`${row},${col}`)
      const isVisited = visitedNodesMap.has(`${row},${col}`)
      const isWall =
        wallNodesMap.has(`${row},${col}`) ||
        (maze && maze[row] && maze[row][col] === 1)

      let cellClass = 'border border-gray-800 '

      if (isStart) {
        cellClass += 'bg-green-500 '
      } else if (isEnd) {
        cellClass += 'bg-red-500 '
      } else if (isPath) {
        cellClass += 'bg-yellow-400 '
      } else if (isVisited) {
        cellClass += 'bg-blue-300 '
      } else if (isWall) {
        cellClass += 'bg-blue-600 '
      } else {
        cellClass += 'bg-black '
      }

      // Add hover effect for clickable cells
      if (!isWall && !isGeneratingMaze && !isFindingPath) {
        cellClass += 'hover:opacity-70 cursor-pointer '
      }

      // Add transition for animation
      cellClass += 'transition-all duration-100 '

      return cellClass
    },
    [
      maze,
      startNode,
      endNode,
      pathNodesMap,
      visitedNodesMap,
      wallNodesMap,
      isGeneratingMaze,
      isFindingPath,
    ],
  )

  // Virtualize grid rendering for large mazes
  const visibleRows = Math.min(rows, 40) // Limit visible rows
  const visibleCols = Math.min(cols, 40) // Limit visible columns

  // Calculate viewport offsets
  const rowOffset = Math.max(0, Math.floor(startNode.row - visibleRows / 2))
  const colOffset = Math.max(0, Math.floor(startNode.col - visibleCols / 2))

  // Adjust to ensure we don't go out of bounds
  const adjustedRowOffset = Math.min(rowOffset, rows - visibleRows)
  const adjustedColOffset = Math.min(colOffset, cols - visibleCols)

  return (
    <div className="overflow-auto p-2">
      <div
        className="grid gap-0"
        style={{
          gridTemplateRows: `repeat(${visibleRows}, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${visibleCols}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: visibleRows }).map((_, viewRowIdx) => {
          const rowIdx = viewRowIdx + adjustedRowOffset
          return Array.from({ length: visibleCols }).map((_, viewColIdx) => {
            const colIdx = viewColIdx + adjustedColOffset
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={getCellClass(rowIdx, colIdx)}
                onClick={() => onCellClick(rowIdx, colIdx)}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
              />
            )
          })
        })}
      </div>
      {(rows > visibleRows || cols > visibleCols) && (
        <div className="mt-2 text-xs text-gray-400">
          Showing a portion of the maze. Click cells to set end point.
        </div>
      )}
    </div>
  )
}

export default Grid
