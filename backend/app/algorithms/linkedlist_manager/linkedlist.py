import uuid
from typing import Literal, List
from app.models.linkedlist import LinkedListNode, LinkedListVisualizationData


class LinkedListManager:
    """Manager for linked list operations."""

    def __init__(self):
        """Initialize the linked list manager."""
        self.list1 = []
        self.list2 = []
        self.list_type = "singly"

    def _get_visualization_data(self) -> LinkedListVisualizationData:
        """Get the current visualization data."""
        return LinkedListVisualizationData(
            listType=self.list_type, lists={"list1": self.list1, "list2": self.list2}
        )

    def _generate_id(self) -> str:
        """Generate a unique ID for a node."""
        return f"node-{uuid.uuid4().hex[:8]}"

    def _create_node(self, value: int) -> LinkedListNode:
        """Create a new node with the given value."""
        if self.list_type == "singly":
            return LinkedListNode(id=self._generate_id(), value=value, next=None)
        else:
            return LinkedListNode(
                id=self._generate_id(), value=value, next=None, prev=None
            )

    def _create_linked_list(self, nodes: List[LinkedListNode]) -> List[LinkedListNode]:
        """Create a properly linked list from a list of nodes."""
        if not nodes:
            return []

        linked_list = []
        for i, node in enumerate(nodes):
            # Reset next pointer
            node.next = None if i == len(nodes) - 1 else nodes[i + 1].id

            # Reset prev pointer for doubly linked list
            if self.list_type == "doubly":
                node.prev = None if i == 0 else nodes[i - 1].id

            linked_list.append(node)

        return linked_list

    def reset(
        self, list_type: Literal["singly", "doubly"]
    ) -> LinkedListVisualizationData:
        """Reset the linked lists with default values."""
        self.list_type = list_type

        # Create default list 1
        default_values = [1, 2, 3, 4, 5]
        nodes = [self._create_node(value) for value in default_values]
        self.list1 = self._create_linked_list(nodes)

        # Create default list 2
        default_values_2 = [6, 7, 8, 9, 10]
        nodes = [self._create_node(value) for value in default_values_2]
        self.list2 = self._create_linked_list(nodes)

        return self._get_visualization_data()

    def add_node(
        self,
        list_type: Literal["singly", "doubly"],
        value: int,
        list_id: Literal["list1", "list2"],
    ) -> LinkedListVisualizationData:
        """Add a node to the specified list."""
        self.list_type = list_type
        target_list = self.list1 if list_id == "list1" else self.list2

        node = self._create_node(value)

        if target_list:
            # Set next pointer of previous node
            target_list[-1].next = node.id

            # Set prev pointer for doubly linked list
            if list_type == "doubly":
                node.prev = target_list[-1].id

        if list_id == "list1":
            self.list1.append(node)
        else:
            self.list2.append(node)

        return self._get_visualization_data()

    def remove_last_node(
        self, list_type: Literal["singly", "doubly"], list_id: Literal["list1", "list2"]
    ) -> LinkedListVisualizationData:
        """Remove the last node from the specified list."""
        self.list_type = list_type
        target_list = self.list1 if list_id == "list1" else self.list2

        if not target_list:
            # List is already empty
            return self._get_visualization_data()

        if len(target_list) <= 1:
            if list_id == "list1":
                self.list1 = []
            else:
                self.list2 = []
        else:
            # Update the next pointer of the second-to-last node
            target_list[-2].next = None
            if list_id == "list1":
                self.list1 = target_list[:-1]
            else:
                self.list2 = target_list[:-1]

        return self._get_visualization_data()

    def reverse_list(
        self, list_type: Literal["singly", "doubly"], list_id: Literal["list1", "list2"]
    ) -> LinkedListVisualizationData:
        """Reverse the specified list."""
        self.list_type = list_type
        target_list = self.list1 if list_id == "list1" else self.list2

        if len(target_list) <= 1:
            return self._get_visualization_data()

        # Reverse the list (we'll rebuild the links)
        reversed_nodes = [node for node in target_list]
        reversed_nodes.reverse()

        # Create properly linked reversed list
        reversed_list = self._create_linked_list(reversed_nodes)

        if list_id == "list1":
            self.list1 = reversed_list
        else:
            self.list2 = reversed_list

        return self._get_visualization_data()

    def sort_list(
        self, list_type: Literal["singly", "doubly"], list_id: Literal["list1", "list2"]
    ) -> LinkedListVisualizationData:
        """Sort a single list by node values."""
        self.list_type = list_type
        target_list = self.list1 if list_id == "list1" else self.list2

        if len(target_list) <= 1:
            return self._get_visualization_data()

        # Create copies of all nodes to sort
        nodes_to_sort = []

        # Copy nodes from the target list
        for node in target_list:
            new_node = LinkedListNode(
                id=node.id,
                value=node.value,
                next=None,
                prev=None if self.list_type != "doubly" else None,
            )
            nodes_to_sort.append(new_node)

        # Sort nodes by value
        nodes_to_sort.sort(key=lambda x: x.value)

        # Create properly linked list from sorted nodes
        sorted_list = self._create_linked_list(nodes_to_sort)

        # Update the appropriate list
        if list_id == "list1":
            self.list1 = sorted_list
        else:
            self.list2 = sorted_list

        return self._get_visualization_data()

    def connect_lists(
        self, list_type: Literal["singly", "doubly"], sorted: bool
    ) -> LinkedListVisualizationData:
        """Connect or merge two lists."""
        self.list_type = list_type

        # Check if either list is empty
        if not self.list1 or not self.list2:
            return self._get_visualization_data()

        if sorted:
            # Create copies of all nodes
            all_nodes = []

            # Copy nodes from both lists
            for node in self.list1:
                new_node = LinkedListNode(
                    id=node.id,
                    value=node.value,
                    next=None,
                    prev=None if self.list_type != "doubly" else None,
                )
                all_nodes.append(new_node)

            for node in self.list2:
                new_node = LinkedListNode(
                    id=node.id,
                    value=node.value,
                    next=None,
                    prev=None if self.list_type != "doubly" else None,
                )
                all_nodes.append(new_node)

            # Sort all nodes by value
            all_nodes.sort(key=lambda x: x.value)

            # Create properly linked list from sorted nodes
            self.list1 = self._create_linked_list(all_nodes)
            self.list2 = []
        else:
            # Simple concatenation
            if self.list1 and self.list2:
                # Connect list1 to list2
                self.list1[-1].next = self.list2[0].id

                # Update prev pointer in doubly linked list
                if list_type == "doubly":
                    self.list2[0].prev = self.list1[-1].id

                self.list1.extend(self.list2)
                self.list2 = []

        return self._get_visualization_data()

    def remove_node_by_value(
        self,
        list_type: Literal["singly", "doubly"],
        value: int,
        list_id: Literal["list1", "list2"],
    ) -> LinkedListVisualizationData:
        """Remove a node with the specified value from the list."""
        self.list_type = list_type
        target_list = self.list1 if list_id == "list1" else self.list2

        if not target_list:
            # List is already empty
            return self._get_visualization_data()

        # Find the index of the node with the given value
        node_index = None
        for i, node in enumerate(target_list):
            if node.value == value:
                node_index = i
                break

        if node_index is None:
            # Value not found in the list
            return self._get_visualization_data()

        # Handle removal based on position in the list
        if node_index == 0:
            # Removing the first node
            if len(target_list) > 1:
                # If there are more nodes, update the second node's prev pointer (for doubly linked list)
                if self.list_type == "doubly" and len(target_list) > 1:
                    target_list[1].prev = None

                # Remove the first node
                if list_id == "list1":
                    self.list1 = target_list[1:]
                else:
                    self.list2 = target_list[1:]
            else:
                # If it's the only node, just empty the list
                if list_id == "list1":
                    self.list1 = []
                else:
                    self.list2 = []
        elif node_index == len(target_list) - 1:
            # Removing the last node (similar to remove_last_node)
            target_list[node_index - 1].next = None
            if list_id == "list1":
                self.list1 = target_list[:-1]
            else:
                self.list2 = target_list[:-1]
        else:
            # Removing a node in the middle
            # Update next pointer of previous node
            target_list[node_index - 1].next = target_list[node_index + 1].id

            # Update prev pointer of next node (for doubly linked list)
            if self.list_type == "doubly":
                target_list[node_index + 1].prev = target_list[node_index - 1].id

            # Remove the node
            new_list = target_list[:node_index] + target_list[node_index + 1 :]
            if list_id == "list1":
                self.list1 = new_list
            else:
                self.list2 = new_list

        return self._get_visualization_data()
