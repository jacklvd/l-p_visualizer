import React from 'react'
import { Slider } from './ui/slider'
import { Label } from './ui/label'

interface SpeedControlProps {
  speed: number
  setSpeed: React.Dispatch<React.SetStateAction<number>>
  disabled: boolean
}

const SpeedControl: React.FC<SpeedControlProps> = ({
  speed,
  setSpeed,
  disabled,
}) => {
  // Invert speed value for slider (higher value = faster speed)
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="speed-slider" className="text-white">
        Speed:
      </Label>
      <Slider
        id="speed-slider"
        min={1}
        max={100}
        step={1}
        value={[speed]} // Use speed directly without inversion
        onValueChange={(vals) => setSpeed(vals[0])} // Set directly without inversion
        disabled={disabled}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>Fast</span> {/* Swapped these labels */}
        <span>Slow</span>
      </div>
    </div>
  )
}

export default SpeedControl
