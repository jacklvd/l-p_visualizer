/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import { LinkedListVisualizationData } from '../types/linkedlist'
import { motion, AnimatePresence } from 'framer-motion'

// Define the props interface for the component
interface LinkedListVisualizerProps {
  data: LinkedListVisualizationData
  activeList: 'list1' | 'list2'
}

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  data,
  activeList,
}) => {
  const { listType, lists } = data
  const { list1 = [], list2 = [] } = lists
  const [prevList1, setPrevList1] = useState<any[]>([])
  const [prevList2, setPrevList2] = useState<any[]>([])
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
  const [animationType, setAnimationType] = useState<string | null>(null)
  const [operationDetails, setOperationDetails] = useState<string>('')

  // Track previous state for animations
  useEffect(() => {
    // Only update prev lists if not currently animating
    if (!isAnimating) {
      let operation = ''

      // Determine what kind of operation occurred
      if (list1.length > prevList1.length) {
        setAnimationType('add')
        operation = `Adding node to List 1`
      } else if (list2.length > prevList2.length) {
        setAnimationType('add')
        operation = `Adding node to List 2`
      } else if (list1.length < prevList1.length) {
        setAnimationType('remove')
        operation = `Removing node from List 1`
      } else if (list2.length < prevList2.length) {
        setAnimationType('remove')
        operation = `Removing node from List 2`
      } else if (
        list1.length === 0 &&
        list2.length === 0 &&
        (prevList1.length > 0 || prevList2.length > 0)
      ) {
        setAnimationType('reset')
        operation = 'Resetting lists'
      } else if (
        list1.length > 0 &&
        list2.length === 0 &&
        prevList2.length > 0
      ) {
        setAnimationType('merge')
        operation = 'Merging lists'
      } else if (
        JSON.stringify(list1.map((node) => node.value)) !==
          JSON.stringify(prevList1.map((node) => node.value)) ||
        JSON.stringify(list2.map((node) => node.value)) !==
          JSON.stringify(prevList2.map((node) => node.value))
      ) {
        setAnimationType('update')

        // Check if this might be a reverse operation
        if (
          list1.length > 1 &&
          prevList1.length > 1 &&
          list1.length === prevList1.length &&
          list1[0].value === prevList1[prevList1.length - 1].value
        ) {
          operation = 'Reversing List 1'
        } else if (
          list2.length > 1 &&
          prevList2.length > 1 &&
          list2.length === prevList2.length &&
          list2[0].value === prevList2[prevList2.length - 1].value
        ) {
          operation = 'Reversing List 2'
        } else {
          // Check if it might be a sort operation
          const isList1Sorted =
            list1.length > 1 &&
            list1.every(
              (node, i) => i === 0 || node.value >= list1[i - 1].value,
            )
          const isList2Sorted =
            list2.length > 1 &&
            list2.every(
              (node, i) => i === 0 || node.value >= list2[i - 1].value,
            )

          if (isList1Sorted && list1.length === prevList1.length) {
            operation = 'Sorting List 1'
          } else if (isList2Sorted && list2.length === prevList2.length) {
            operation = 'Sorting List 2'
          } else {
            operation = 'Updating lists'
          }
        }
      }

      setOperationDetails(operation)

      // Use timeout to ensure we don't update prev lists during animation
      const timeoutId = setTimeout(() => {
        setPrevList1([...list1]) // Create a new array to ensure proper state updates
        setPrevList2([...list2])
        setAnimationType(null)
      }, 800) // Slightly longer animation time

      return () => clearTimeout(timeoutId)
    }
  }, [list1, list2, isAnimating, prevList1, prevList2])

  // Determine if a node is new (for animation)
  const isNewNode = (node: any, prevList: any[]) => {
    return !prevList.some((prevNode) => prevNode.id === node.id)
  }

  // Determine if a node was removed (for tracking removal animations)
  const wasNodeRemoved = (id: string, currentList: any[], prevList: any[]) => {
    return (
      !currentList.some((node) => node.id === id) &&
      prevList.some((node) => node.id === id)
    )
  }

  // Get tailwind color class safely (prevents "className is not valid" errors)
  const getTailwindColor = (
    hue: string,
    intensity: number,
  ): { border: string; bg: string } => {
    // Make sure intensity is within valid Tailwind ranges (100-900 by increments of 100)
    const validIntensities = [100, 200, 300, 400, 500, 600, 700, 800, 900]
    const closestIntensity = validIntensities.reduce((prev, curr) =>
      Math.abs(curr - intensity) < Math.abs(prev - intensity) ? curr : prev,
    )

    return {
      border: `border-${hue}-${closestIntensity}`,
      bg: `bg-${hue}-${closestIntensity}`,
    }
  }

  // Get node color based on value for better visualization
  const getNodeColor = (
    value: number,
    isSingly: boolean,
    isHighlighted: boolean = false,
  ) => {
    if (isHighlighted) {
      return {
        border: 'border-pink-500',
        bg: 'bg-pink-500',
      }
    }

    // More consistent coloring algorithm
    const hue = isSingly ? 'blue' : 'purple'

    // Create a deterministic color based on the node value
    // Map to 300-700 range (these are all valid Tailwind color intensities)
    const baseIntensity = 300
    const intensityRange = 400
    const intensity =
      baseIntensity + Math.abs(value % 5) * Math.floor(intensityRange / 5)

    return getTailwindColor(hue, intensity)
  }

  // Render a single node
  const renderNode = (
    node: any,
    index: number,
    isLast: boolean,
    list: any[],
    prevList: any[],
  ) => {
    const isSingly = listType === 'singly'
    const isNew = isNewNode(node, prevList)
    const isHighlighted = node.id === highlightedNode

    // Determine the delay for staggered animations
    const staggerDelay = 0.08 * index

    // Get node color
    const nodeColor = getNodeColor(node.value, isSingly, isHighlighted)

    // Determine animation based on operation type
    let initialAnimation = { scale: 1, opacity: 1, y: 0 }
    const entranceAnimation = { scale: 1, opacity: 1, y: 0 }

    if (isNew) {
      initialAnimation = { scale: 0, opacity: 0, y: 10 }
    } else if (animationType === 'merge' || animationType === 'update') {
      initialAnimation = { scale: 0.95, opacity: 0.8, y: 0 }
    }

    return (
      <motion.div
        key={node.id}
        className="flex items-center mb-8 relative mx-2" // Increased vertical spacing
        initial={initialAnimation}
        animate={entranceAnimation}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          delay: isNew ? staggerDelay : 0,
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
        layout
      >
        {/* Node representation */}
        <motion.div
          className={`
            relative border-2 rounded-lg w-20 h-16 flex flex-col items-center justify-center
            ${nodeColor.border} shadow-lg transition-all duration-300
            ${animationType === 'remove' ? 'border-dashed' : ''}
            hover:shadow-xl
          `}
          whileHover={{ scale: 1.05 }}
          onClick={() => setHighlightedNode(isHighlighted ? null : node.id)}
        >
          <div
            className={`
            w-full text-center py-1 font-bold text-white rounded-t-md
            ${nodeColor.bg} transition-all duration-300
          `}
          >
            {node.value}
          </div>
          <div className="text-xs mt-1 text-gray-400">
            {node.id.substring(0, 6)}
          </div>

          {/* Add doubly linked indicator for doubly linked lists */}
          {!isSingly && (
            <div className="absolute top-1 right-1 text-xs text-purple-300 bg-purple-900 bg-opacity-30 px-1 rounded">
              D
            </div>
          )}
        </motion.div>

        {/* Next pointer (arrow to the right) */}
        {!isLast && node.next && (
          <motion.div
            className="flex items-center mx-2"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            transition={{ duration: 0.3, delay: 0.1 + staggerDelay }}
          >
            {isSingly ? (
              <div className="text-blue-500 font-bold text-xl">→</div>
            ) : (
              <div className="text-purple-500 font-bold">
                <svg
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 6 L20 6"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 2 L20 6 L16 10"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </motion.div>
        )}

        {/* Null pointer for last node */}
        {isLast && (
          <motion.div
            className="flex items-center mx-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + staggerDelay }}
          >
            <div
              className={`text-${isSingly ? 'blue' : 'purple'}-500 font-bold text-xl mr-1`}
            >
              →
            </div>
            <div className="text-gray-500 text-sm font-mono">null</div>
          </motion.div>
        )}

        {/* Prev pointer for doubly linked list (shown as curved arrow below) */}
        {!isSingly && index > 0 && node.prev && (
          <>
            {/* Curved arrow below nodes */}
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + staggerDelay }}
            >
              <svg
                width="60"
                height="14"
                viewBox="0 0 60 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1 L30 13 L55 1"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M5 1 L1 5"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M5 1 L9 5"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-6 text-purple-500 text-xs font-bold">
                prev
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    )
  }

  // Render removed nodes (for exit animations)
  const renderRemovedNodes = (
    prevList: any[],
    currentList: any[],
    listId: string,
  ) => {
    return prevList
      .filter((node) =>
        wasNodeRemoved(node.id, listId === 'list1' ? list1 : list2, prevList),
      )
      .map((node) => (
        <motion.div
          key={`removed-${node.id}`}
          className="flex flex-col items-center mb-2 opacity-50"
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Empty placeholder to maintain layout during animation */}
        </motion.div>
      ))
  }

  // Render an operation message based on the animation type
  const renderOperationMessage = () => {
    if (!animationType) return null

    const getStatusColor = () => {
      switch (animationType) {
        case 'add':
          return 'text-green-400'
        case 'remove':
          return 'text-red-400'
        case 'update':
          return 'text-blue-400'
        case 'merge':
          return 'text-purple-400'
        case 'reset':
          return 'text-yellow-400'
        default:
          return 'text-green-400'
      }
    }

    return (
      <motion.div
        className={`${getStatusColor()} font-bold text-center mb-4 p-2 bg-gray-800 rounded-lg`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        {operationDetails}
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ...
        </motion.span>
      </motion.div>
    )
  }

  // Memoize the lists to avoid unnecessary re-renders
  const renderList1 = useMemo(() => {
    return list1.map((node, index) =>
      renderNode(node, index, index === list1.length - 1, list1, prevList1),
    )
  }, [list1, prevList1, highlightedNode, animationType])

  const renderList2 = useMemo(() => {
    return list2.map((node, index) =>
      renderNode(node, index, index === list2.length - 1, list2, prevList2),
    )
  }, [list2, prevList2, highlightedNode, animationType])

  return (
    <div className="space-y-6">
      {renderOperationMessage()}

      {/* List 1 */}
      <div
        className={`bg-gray-800 p-4 pb-8 rounded-lg shadow-md ${activeList === 'list1' ? 'ring-2 ring-green-400' : ''}`}
      >
        <h2 className="text-xl font-bold mb-2 text-green-400 flex items-center">
          <span>List 1</span>
          {activeList === 'list1' && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </h2>
        <div className="overflow-x-auto p-2 pt-6 pb-10 min-h-[150px]">
          <div className="flex items-center">
            <AnimatePresence mode="sync">
              {list1.length > 0 ? (
                renderList1
              ) : (
                <motion.div
                  key="empty-list1"
                  className="text-gray-400 flex items-center justify-center w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Empty list
                </motion.div>
              )}
              {renderRemovedNodes(prevList1, list1, 'list1')}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* List 2 */}
      <div
        className={`bg-gray-800 p-4 pb-8 rounded-lg shadow-md ${activeList === 'list2' ? 'ring-2 ring-green-400' : ''}`}
      >
        <h2 className="text-xl font-bold mb-2 text-green-400 flex items-center">
          <span>List 2</span>
          {activeList === 'list2' && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </h2>
        <div className="overflow-x-auto p-2 pt-6 pb-10 min-h-[150px]">
          <div className="flex items-center">
            <AnimatePresence mode="sync">
              {list2.length > 0 ? (
                renderList2
              ) : (
                <motion.div
                  key="empty-list2"
                  className="text-gray-400 flex items-center justify-center w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Empty list
                </motion.div>
              )}
              {renderRemovedNodes(prevList2, list2, 'list2')}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Instructions and current state info */}
      <div className="bg-gray-800 p-3 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center">
          <div className="text-gray-400 text-sm mb-2 sm:mb-0 text-center sm:text-left">
            Click on a node to highlight it. Try operations like Add, Remove,
            Sort, Reverse, and Connect.
          </div>
          <div className="text-sm text-gray-500">
            Current type:{' '}
            <span
              className={`font-bold ${listType === 'singly' ? 'text-blue-400' : 'text-purple-400'}`}
            >
              {listType === 'singly' ? 'Singly' : 'Doubly'} Linked
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkedListVisualizer
