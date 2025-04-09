import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { MazeAlgorithm, MazeType } from '../types/maze'

interface MazeSelectorProps {
  mazeAlgorithm: MazeAlgorithm
  setMazeAlgorithm: React.Dispatch<React.SetStateAction<MazeAlgorithm>>
  mazeType: MazeType
  setMazeType: React.Dispatch<React.SetStateAction<MazeType>>
  onGenerateMaze: () => void
  disabled: boolean
}

const MazeSelector: React.FC<MazeSelectorProps> = ({
  mazeAlgorithm,
  setMazeAlgorithm,
  mazeType,
  setMazeType,
  onGenerateMaze,
  disabled,
}) => {
  return (
    <div className="flex items-end space-x-4 flex-wrap gap-4">
      <div>
        <label className="block mb-2 text-white text-sm">Maze Algorithm:</label>
        <Select
          value={mazeAlgorithm}
          onValueChange={(value) => setMazeAlgorithm(value as MazeAlgorithm)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[200px] bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value={MazeAlgorithm.BACKTRACKING}>
              Recursive Backtracking
            </SelectItem>
            <SelectItem value={MazeAlgorithm.PRIM}>Prim's Algorithm</SelectItem>
            <SelectItem value={MazeAlgorithm.KRUSKAL}>
              Kruskal's Algorithm
            </SelectItem>
            <SelectItem value={MazeAlgorithm.ELLER}>
              Eller's Algorithm
            </SelectItem>
            <SelectItem value={MazeAlgorithm.WILSON}>
              Wilson's Algorithm
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-2 text-white text-sm">Maze Type:</label>
        <Select
          value={mazeType}
          onValueChange={(value) => setMazeType(value as MazeType)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[160px] bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value={MazeType.PERFECT}>Perfect</SelectItem>
            <SelectItem value={MazeType.LOOP}>Loop</SelectItem>
            <SelectItem value={MazeType.BRAID}>Braid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="bg-purple-600 hover:bg-purple-700 text-white"
        onClick={onGenerateMaze}
        disabled={disabled}
      >
        Generate Maze
      </Button>
    </div>
  )
}

export default MazeSelector
