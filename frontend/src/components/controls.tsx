import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { PathAlgorithm } from '../types/pathfinding'

interface ControlsProps {
  algorithm: PathAlgorithm
  setAlgorithm: React.Dispatch<React.SetStateAction<PathAlgorithm>>
  onFindPath: () => void
  onReset: () => void
  disabled: boolean
}

const Controls: React.FC<ControlsProps> = ({
  algorithm,
  setAlgorithm,
  onFindPath,
  onReset,
  disabled,
}) => {
  return (
    <div className="flex items-end space-x-4 flex-wrap gap-4">
      <div>
        <label className="block mb-2 text-white text-sm">
          Choose an algorithm:
        </label>
        <Select
          value={algorithm}
          onValueChange={(value) => setAlgorithm(value as PathAlgorithm)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[160px] bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value={PathAlgorithm.A_STAR}>A*</SelectItem>
            <SelectItem value={PathAlgorithm.BFS}>BFS</SelectItem>
            <SelectItem value={PathAlgorithm.DFS}>DFS</SelectItem>
            <SelectItem value={PathAlgorithm.DIJKSTRA}>Dijkstra</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={onFindPath}
        disabled={disabled}
      >
        Find Path
      </Button>

      <Button variant="destructive" onClick={onReset} disabled={disabled}>
        Reset
      </Button>
    </div>
  )
}

export default Controls
