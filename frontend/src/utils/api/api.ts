import axios from 'axios'
import { ApiClient, API_ENDPOINTS } from '../../types/api'
import { MazeGenerationRequest, MazeResponse } from '../../types/maze'
import { PathFindingRequest, PathResponse } from '../../types/pathfinding'
import {
  LinkedListOperationRequest,
  LinkedListVisualizationData,
  AddNodeRequest,
  RemoveNodeRequest,
  ReverseListRequest,
  ConnectListsRequest,
  SortListRequest,
  RemoveNodeByValueRequest,
} from '../../types/linkedlist'

const API_BASE_URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API client implementation
export const apiClient: ApiClient = {
  // Generate maze using the backend API
  generateMaze: async (
    request: MazeGenerationRequest,
  ): Promise<MazeResponse> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.GENERATE_MAZE,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error generating maze:', error)
      throw error
    }
  },

  // Find path using the backend API
  findPath: async (request: PathFindingRequest): Promise<PathResponse> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.FIND_PATH,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error finding path:', error)
      throw error
    }
  },

  // Reset linked list
  resetLinkedList: async (
    request: LinkedListOperationRequest,
  ): Promise<LinkedListVisualizationData> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.RESET_LINKEDLIST,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error resetting linked list:', error)
      throw error
    }
  },

  // Add node to linked list
  addNode: async (
    request: AddNodeRequest,
  ): Promise<LinkedListVisualizationData> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADD_NODE, request)
      return response.data
    } catch (error) {
      console.error('Error adding node:', error)
      throw error
    }
  },

  // Remove node from linked list
  removeNode: async (
    request: RemoveNodeRequest,
  ): Promise<LinkedListVisualizationData> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.REMOVE_NODE,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error removing node:', error)
      throw error
    }
  },

  // Reverse linked list
  reverseList: async (
    request: ReverseListRequest,
  ): Promise<LinkedListVisualizationData> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.REVERSE_LIST,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error reversing list:', error)
      throw error
    }
  },

  // Connect linked lists
  connectLists: async (
    request: ConnectListsRequest,
  ): Promise<LinkedListVisualizationData> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CONNECT_LISTS,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error connecting lists:', error)
      throw error
    }
  },

  sortList: async (
    request: SortListRequest,
  ): Promise<LinkedListVisualizationData> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.SORT_LIST,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error sorting list:', error)
      throw error
    }
  },
  removeNodeByValue: async (
    request: RemoveNodeByValueRequest,
  ): Promise<LinkedListVisualizationData> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.REMOVE_NODE_BY_VALUE,
        request,
      )
      return response.data
    } catch (error) {
      console.error('Error removing node by value:', error)
      throw error
    }
  },
}
