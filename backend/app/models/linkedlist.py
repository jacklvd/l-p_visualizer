from pydantic import BaseModel
from typing import Dict, List, Optional, Literal


class LinkedListNode(BaseModel):
    """Represents a node in a linked list."""

    id: str
    value: int
    next: Optional[str] = None
    prev: Optional[str] = None


class LinkedListOperationRequest(BaseModel):
    """Base request for linked list operations."""

    listType: Literal["singly", "doubly"]


class AddNodeRequest(LinkedListOperationRequest):
    """Request to add a node to a list."""

    value: int
    listId: Literal["list1", "list2"] = "list1"


class RemoveNodeRequest(LinkedListOperationRequest):
    """Request to remove a node from a list."""

    listId: Literal["list1", "list2"] = "list1"


# New request type for removing a node by value
class RemoveNodeByValueRequest(LinkedListOperationRequest):
    """Request to remove a node with a specific value from a list."""

    value: int
    listId: Literal["list1", "list2"] = "list1"


class ReverseListRequest(LinkedListOperationRequest):
    """Request to reverse a list."""

    listId: Literal["list1", "list2"] = "list1"


class ConnectListsRequest(LinkedListOperationRequest):
    """Request to connect or merge two lists."""

    sorted: bool = False


class SortListRequest(LinkedListOperationRequest):
    """Request to sort a single list."""

    listId: Literal["list1", "list2"] = "list1"


class LinkedListVisualizationData(BaseModel):
    """Data for linked list visualization."""

    listType: Literal["singly", "doubly"]
    lists: Dict[str, List[LinkedListNode]]
