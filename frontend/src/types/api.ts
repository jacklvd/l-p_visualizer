import { MazeGenerationRequest, MazeResponse } from './maze'
import { PathFindingRequest, PathResponse } from './pathfinding'
import {
  LinkedListVisualizationData,
  LinkedListOperationRequest,
  AddNodeRequest,
  RemoveNodeRequest,
  ReverseListRequest,
  ConnectListsRequest,
  SortListRequest,
  RemoveNodeByValueRequest,
} from './linkedlist'

// API endpoints
export const API_ENDPOINTS = {
  GENERATE_MAZE: '/api/maze/generate',
  FIND_PATH: '/api/path/find',
  RESET_LINKEDLIST: '/api/linkedlist/reset',
  ADD_NODE: '/api/linkedlist/add-node',
  REMOVE_NODE: '/api/linkedlist/remove-node',
  REVERSE_LIST: '/api/linkedlist/reverse',
  CONNECT_LISTS: '/api/linkedlist/connect',
  SORT_LIST: '/api/linkedlist/sort',
  REMOVE_NODE_BY_VALUE: '/api/linkedlist/remove-node-by-value',
}

// Request/Response types for LinkedList
export interface ParseLinkedListCodeRequest {
  code: string
  input?: string
}

export type ParseLinkedListCodeResponse = LinkedListVisualizationData

export interface ApiClient {
  generateMaze: (request: MazeGenerationRequest) => Promise<MazeResponse>
  findPath: (request: PathFindingRequest) => Promise<PathResponse>

  // New linked list operations
  resetLinkedList: (
    request: LinkedListOperationRequest,
  ) => Promise<LinkedListVisualizationData>

  addNode: (request: AddNodeRequest) => Promise<LinkedListVisualizationData>

  removeNode: (
    request: RemoveNodeRequest,
  ) => Promise<LinkedListVisualizationData>

  reverseList: (
    request: ReverseListRequest,
  ) => Promise<LinkedListVisualizationData>

  connectLists: (
    request: ConnectListsRequest,
  ) => Promise<LinkedListVisualizationData>
  sortList: (request: SortListRequest) => Promise<LinkedListVisualizationData>
  removeNodeByValue: (
    request: RemoveNodeByValueRequest,
  ) => Promise<LinkedListVisualizationData>
}
