from fastapi import APIRouter, HTTPException
from app.models.linkedlist import (
    LinkedListOperationRequest,
    AddNodeRequest,
    RemoveNodeRequest,
    RemoveNodeByValueRequest,
    ReverseListRequest,
    ConnectListsRequest,
    LinkedListVisualizationData,
    SortListRequest,
)
from app.algorithms.linkedlist_manager.linkedlist import LinkedListManager

router = APIRouter()
list_manager = LinkedListManager()


@router.post("/reset", response_model=LinkedListVisualizationData)
async def reset_linked_list(request: LinkedListOperationRequest):
    """Reset the linked list to default values."""
    return list_manager.reset(request.listType)


@router.post("/add-node", response_model=LinkedListVisualizationData)
async def add_node(request: AddNodeRequest):
    """Add a node to the linked list."""
    return list_manager.add_node(request.listType, request.value, request.listId)


@router.post("/remove-node", response_model=LinkedListVisualizationData)
async def remove_node(request: RemoveNodeRequest):
    """Remove the last node from the linked list."""
    return list_manager.remove_last_node(request.listType, request.listId)


@router.post("/remove-node-by-value", response_model=LinkedListVisualizationData)
async def remove_node_by_value(request: RemoveNodeByValueRequest):
    """Remove a node with the specified value from the linked list."""
    return list_manager.remove_node_by_value(
        request.listType, request.value, request.listId
    )


@router.post("/reverse", response_model=LinkedListVisualizationData)
async def reverse_list(request: ReverseListRequest):
    """Reverse the linked list."""
    return list_manager.reverse_list(request.listType, request.listId)


@router.post("/connect", response_model=LinkedListVisualizationData)
async def connect_lists(request: ConnectListsRequest):
    """Connect or merge two linked lists."""
    return list_manager.connect_lists(request.listType, request.sorted)


@router.post("/sort", response_model=LinkedListVisualizationData)
async def sort_list(request: SortListRequest):
    """Sort a single linked list by node values."""
    return list_manager.sort_list(request.listType, request.listId)
