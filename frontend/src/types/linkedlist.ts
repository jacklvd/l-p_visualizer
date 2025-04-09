// Node types
export interface LinkedListNode {
  id: string
  value: number
  next: string | null
  prev?: string | null
}

export interface LinkedListVisualizationData {
  listType: 'singly' | 'doubly'
  lists: {
    list1: LinkedListNode[]
    list2: LinkedListNode[]
  }
}

// Operation request types
export interface LinkedListOperationRequest {
  listType: 'singly' | 'doubly'
}

export interface AddNodeRequest extends LinkedListOperationRequest {
  value: number
  listId?: 'list1' | 'list2'
}

export interface RemoveNodeRequest extends LinkedListOperationRequest {
  listId?: 'list1' | 'list2'
}

export interface ReverseListRequest extends LinkedListOperationRequest {
  listId?: 'list1' | 'list2'
}

export interface ConnectListsRequest extends LinkedListOperationRequest {
  sorted?: boolean
}

export interface SortListRequest extends LinkedListOperationRequest {
  listId: 'list1' | 'list2'
}

export interface RemoveNodeByValueRequest extends LinkedListOperationRequest {
  value: number
  listId?: 'list1' | 'list2'
}
