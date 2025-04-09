import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import LinkedListVisualizer from './linkedlist-visualizer'
import { apiClient } from '../utils/api/api'
import { toast } from 'sonner'
import { LinkedListVisualizationData } from '../types/linkedlist'

const LinkedListPage: React.FC = () => {
  const [listType, setListType] = useState<'singly' | 'doubly'>('singly')
  const [nodeValue, setNodeValue] = useState<number>(0)
  const [visualizationData, setVisualizationData] =
    useState<LinkedListVisualizationData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeList, setActiveList] = useState<'list1' | 'list2'>('list1')
  const [showRemoveInput, setShowRemoveInput] = useState<boolean>(false)
  const [removeValue, setRemoveValue] = useState<number>(0)

  // Initialize the visualization when component mounts
  useEffect(() => {
    resetVisualization()
  }, [listType])

  // Reset visualization with default values
  const resetVisualization = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.resetLinkedList({
        listType: listType,
      })
      setVisualizationData(response)
      toast.success('Visualization reset')
    } catch (error) {
      toast.error('Failed to reset visualization')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add a node to the active list
  const addNode = async () => {
    if (nodeValue === undefined || nodeValue === null) {
      toast.error('Please enter a valid node value')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.addNode({
        listType: listType,
        value: nodeValue,
        listId: activeList,
      })
      setVisualizationData(response)
      toast.success('Node added')
    } catch (error) {
      toast.error('Failed to add node')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Remove a node by value from the active list
  const removeNodeByValue = async () => {
    // Check if list is empty
    if (
      (activeList === 'list1' &&
        (!visualizationData?.lists.list1 ||
          visualizationData.lists.list1.length === 0)) ||
      (activeList === 'list2' &&
        (!visualizationData?.lists.list2 ||
          visualizationData.lists.list2.length === 0))
    ) {
      toast.error(`List ${activeList === 'list1' ? '1' : '2'} is already empty`)
      return
    }

    // Check if value exists in the list
    const activeListData =
      activeList === 'list1'
        ? visualizationData?.lists.list1
        : visualizationData?.lists.list2
    const valueExists = activeListData?.some(
      (node) => node.value === removeValue,
    )

    if (!valueExists) {
      toast.error(
        `Value ${removeValue} not found in List ${activeList === 'list1' ? '1' : '2'}`,
      )
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.removeNodeByValue({
        listType: listType,
        value: removeValue,
        listId: activeList,
      })
      setVisualizationData(response)
      toast.success(`Node with value ${removeValue} removed`)
      setShowRemoveInput(false)
    } catch (error) {
      toast.error('Failed to remove node')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reverse the active list
  const reverseList = async () => {
    // Check if list is empty
    if (
      (activeList === 'list1' &&
        (!visualizationData?.lists.list1 ||
          visualizationData.lists.list1.length === 0)) ||
      (activeList === 'list2' &&
        (!visualizationData?.lists.list2 ||
          visualizationData.lists.list2.length === 0))
    ) {
      toast.error(
        `Cannot reverse: List ${activeList === 'list1' ? '1' : '2'} is empty`,
      )
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.reverseList({
        listType: listType,
        listId: activeList,
      })
      setVisualizationData(response)
      toast.success('List reversed')
    } catch (error) {
      toast.error('Failed to reverse list')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Connect two lists
  const connectLists = async (sorted: boolean) => {
    // Check if either list is empty
    if (
      !visualizationData?.lists.list1 ||
      visualizationData.lists.list1.length === 0
    ) {
      toast.error('Cannot connect: List 1 is empty')
      return
    }

    if (
      !visualizationData?.lists.list2 ||
      visualizationData.lists.list2.length === 0
    ) {
      toast.error('Cannot connect: List 2 is empty')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.connectLists({
        listType: listType,
        sorted: sorted,
      })
      setVisualizationData(response)
      toast.success(sorted ? 'Lists merged (sorted)' : 'Lists connected')
    } catch (error) {
      toast.error('Failed to connect lists')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sort active list
  const sortActiveList = async () => {
    // Check if active list is empty
    if (
      (activeList === 'list1' &&
        (!visualizationData?.lists.list1 ||
          visualizationData.lists.list1.length === 0)) ||
      (activeList === 'list2' &&
        (!visualizationData?.lists.list2 ||
          visualizationData.lists.list2.length === 0))
    ) {
      toast.error(
        `Cannot sort: List ${activeList === 'list1' ? '1' : '2'} is empty`,
      )
      return
    }

    setIsLoading(true)
    try {
      // Call the backend API to sort the list
      const response = await apiClient.sortList({
        listType: listType,
        listId: activeList,
      })
      setVisualizationData(response)
      toast.success(`List ${activeList === 'list1' ? '1' : '2'} sorted`)
    } catch (error) {
      toast.error('Failed to sort list')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle remove input visibility
  const toggleRemoveInput = () => {
    setShowRemoveInput(!showRemoveInput)
  }

  // Handle Enter key press in inputs
  const handleInputKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* List type selector */}
        <div className="mb-6 flex justify-center space-x-4">
          <Button
            onClick={() => setListType('singly')}
            className={`${listType === 'singly' ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-gray-700'}`}
          >
            Singly Linked List
          </Button>
          <Button
            onClick={() => setListType('doubly')}
            className={`${listType === 'doubly' ? 'bg-purple-600 ring-2 ring-purple-300' : 'bg-gray-700'}`}
          >
            Doubly Linked List
          </Button>
        </div>

        {/* Control panel with all options */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column - List selection and node operations */}
            <div className="space-y-4">
              {/* List selector */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setActiveList('list1')}
                  className={`${
                    activeList === 'list1'
                      ? 'bg-green-600 ring-2 ring-white ring-opacity-60'
                      : 'bg-gray-700'
                  }`}
                >
                  List 1{' '}
                  {activeList === 'list1' && <span className="ml-1">✓</span>}
                </Button>
                <Button
                  onClick={() => setActiveList('list2')}
                  className={`${
                    activeList === 'list2'
                      ? 'bg-green-600 ring-2 ring-white ring-opacity-60'
                      : 'bg-gray-700'
                  }`}
                >
                  List 2{' '}
                  {activeList === 'list2' && <span className="ml-1">✓</span>}
                </Button>
              </div>

              {/* Add node controls */}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-24"
                  value={nodeValue}
                  onChange={(e) => {
                    const val =
                      e.target.value === '' ? 0 : parseInt(e.target.value)
                    if (!isNaN(val)) {
                      setNodeValue(val)
                    }
                  }}
                  onKeyDown={(e) => handleInputKeyDown(e, addNode)}
                  placeholder="Value"
                />
                <Button
                  onClick={addNode}
                  disabled={isLoading}
                  className="bg-green-600"
                >
                  Add Node
                </Button>
              </div>

              {/* Remove node controls */}
              <div>
                <Button
                  onClick={toggleRemoveInput}
                  disabled={isLoading}
                  className="bg-red-600 w-full"
                >
                  {showRemoveInput ? 'Cancel Remove' : 'Remove Node'}
                </Button>
              </div>

              {/* Specific value removal (conditionally rendered) */}
              {showRemoveInput && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-24"
                    value={removeValue}
                    onChange={(e) => {
                      const val =
                        e.target.value === '' ? 0 : parseInt(e.target.value)
                      if (!isNaN(val)) {
                        setRemoveValue(val)
                      }
                    }}
                    onKeyDown={(e) => handleInputKeyDown(e, removeNodeByValue)}
                    placeholder="Value"
                  />
                  <Button
                    onClick={removeNodeByValue}
                    disabled={isLoading}
                    className="bg-red-700"
                  >
                    Remove Node
                  </Button>
                </div>
              )}
            </div>

            {/* Right column - List operations */}
            <div className="space-y-4">
              {/* Operation controls */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={reverseList}
                  disabled={isLoading}
                  className="bg-yellow-600"
                >
                  Reverse
                </Button>

                <Button
                  onClick={sortActiveList}
                  disabled={isLoading}
                  className="bg-orange-600"
                >
                  Sort List
                </Button>

                <Button
                  onClick={() => connectLists(false)}
                  disabled={isLoading}
                  className="bg-blue-600"
                >
                  Connect Lists
                </Button>

                <Button
                  onClick={() => connectLists(true)}
                  disabled={isLoading}
                  className="bg-purple-600"
                >
                  Merge Sorted
                </Button>

                <Button
                  onClick={resetVisualization}
                  disabled={isLoading}
                  className="bg-gray-600 col-span-2"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization area */}
        <div className="bg-gray-800 p-4 rounded-lg">
          {visualizationData ? (
            <LinkedListVisualizer
              data={visualizationData}
              activeList={activeList}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p>No visualization data available. Click "Reset" to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LinkedListPage
