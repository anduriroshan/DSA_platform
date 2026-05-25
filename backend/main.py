"""FastAPI application entry point for DSA Platform backend."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from config import ALLOWED_ORIGINS
from database import engine, init_db, SessionLocal
from models.database_models import Algorithm
from routers import execute, algorithms, health


# ─── Seed Data ──────────────────────────────────────────────────────

SEED_ALGORITHMS = [
    {
        "slug": "bubble-sort",
        "name": "Bubble Sort",
        "category": "sorting",
        "difficulty": "easy",
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)",
        "description": "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. It gets its name because smaller elements 'bubble' to the top of the list.",
        "sample_code_python": """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Example
data = [64, 34, 25, 12, 22, 11, 90]
print("Original:", data)
print("Sorted:", bubble_sort(data))""",
    },
    {
        "slug": "selection-sort",
        "name": "Selection Sort",
        "category": "sorting",
        "difficulty": "easy",
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)",
        "description": "Selection Sort divides the array into a sorted and unsorted region. It repeatedly finds the minimum element from the unsorted region and places it at the beginning of the unsorted region, effectively growing the sorted region by one element each pass.",
        "sample_code_python": """def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Example
data = [64, 25, 12, 22, 11]
print("Original:", data)
print("Sorted:", selection_sort(data))""",
    },
    {
        "slug": "insertion-sort",
        "name": "Insertion Sort",
        "category": "sorting",
        "difficulty": "easy",
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)",
        "description": "Insertion Sort builds the final sorted array one item at a time. It picks each element and inserts it into its correct position among the previously sorted elements, shifting larger elements one position to the right.",
        "sample_code_python": """def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Example
data = [12, 11, 13, 5, 6]
print("Original:", data)
print("Sorted:", insertion_sort(data))""",
    },
    {
        "slug": "merge-sort",
        "name": "Merge Sort",
        "category": "sorting",
        "difficulty": "medium",
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)",
        "description": "Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts each half, and then merges the sorted halves back together. It guarantees O(n log n) performance in all cases.",
        "sample_code_python": """def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example
data = [38, 27, 43, 3, 9, 82, 10]
print("Original:", data)
print("Sorted:", merge_sort(data))""",
    },
    {
        "slug": "quick-sort",
        "name": "Quick Sort",
        "category": "sorting",
        "difficulty": "medium",
        "time_complexity": "O(n log n) avg, O(n²) worst",
        "space_complexity": "O(log n)",
        "description": "Quick Sort selects a 'pivot' element and partitions the array so that elements less than the pivot come before it and elements greater come after it. It then recursively sorts the sub-arrays. It's one of the most efficient general-purpose sorting algorithms.",
        "sample_code_python": """def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Example
data = [10, 7, 8, 9, 1, 5]
print("Original:", data)
print("Sorted:", quick_sort(data.copy()))""",
    },
    {
        "slug": "heap-sort",
        "name": "Heap Sort",
        "category": "sorting",
        "difficulty": "medium",
        "time_complexity": "O(n log n)",
        "space_complexity": "O(1)",
        "description": "Heap Sort treats the array as an implicit binary max-heap. It first builds a max-heap by sifting each non-leaf node down, then repeatedly swaps the root (the largest element) with the last unsorted element and re-heapifies the reduced heap, growing a sorted region at the end of the array. Sorts in place with guaranteed O(n log n), but is not stable.",
        "sample_code_python": """def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    # Build max-heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

# Example
data = [12, 11, 13, 5, 6, 7]
print("Original:", data)
print("Sorted:", heap_sort(data))""",
    },
    {
        "slug": "counting-sort",
        "name": "Counting Sort",
        "category": "sorting",
        "difficulty": "medium",
        "time_complexity": "O(n + k)",
        "space_complexity": "O(n + k)",
        "description": "Counting Sort is a non-comparison sort that works when keys fall in a small known range. It counts occurrences of each key, converts those into cumulative positions, then places each element into its final slot in a single right-to-left pass — which keeps the sort stable. Linear time when the key range k is O(n).",
        "sample_code_python": """def counting_sort(arr):
    if not arr:
        return arr
    min_val, max_val = min(arr), max(arr)
    k = max_val - min_val + 1
    count = [0] * k
    for x in arr:
        count[x - min_val] += 1
    # Cumulative positions
    for i in range(1, k):
        count[i] += count[i - 1]
    output = [0] * len(arr)
    # Right-to-left preserves stability
    for x in reversed(arr):
        count[x - min_val] -= 1
        output[count[x - min_val]] = x
    return output

# Example
data = [4, 2, 2, 8, 3, 3, 1]
print("Original:", data)
print("Sorted:", counting_sort(data))""",
    },
    {
        "slug": "radix-sort",
        "name": "Radix Sort",
        "category": "sorting",
        "difficulty": "medium",
        "time_complexity": "O(d · (n + k))",
        "space_complexity": "O(n + k)",
        "description": "Radix Sort (LSD variant) sorts integers digit by digit, starting from the least significant digit, using a stable counting sort as the inner subroutine. After d passes (one per digit), the array is fully sorted. Beats O(n log n) when keys have a small fixed width.",
        "sample_code_python": """def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for x in arr:
        count[(x // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        count[digit] -= 1
        output[count[digit]] = arr[i]
    return output

def radix_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        arr = counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

# Example
data = [170, 45, 75, 90, 802, 24, 2, 66]
print("Original:", data)
print("Sorted:", radix_sort(data))""",
    },
    {
        "slug": "linear-search",
        "name": "Linear Search",
        "category": "searching",
        "difficulty": "easy",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "description": "Linear Search sequentially checks each element of the list until the target is found or the list is exhausted. It's the simplest search algorithm and works on both sorted and unsorted arrays.",
        "sample_code_python": """def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found at index i
    return -1  # Not found

# Example
data = [10, 23, 45, 70, 11, 15]
target = 70
result = linear_search(data, target)
print(f"Searching for {target} in {data}")
print(f"Found at index: {result}" if result != -1 else "Not found")""",
    },
    {
        "slug": "binary-search",
        "name": "Binary Search",
        "category": "searching",
        "difficulty": "easy",
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)",
        "description": "Binary Search works on sorted arrays by repeatedly dividing the search interval in half. It compares the target with the middle element: if they match, the search is done; otherwise, it eliminates the half where the target cannot lie.",
        "sample_code_python": """def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Example
data = [2, 3, 4, 10, 40, 50, 70]
target = 10
result = binary_search(data, target)
print(f"Searching for {target} in {data}")
print(f"Found at index: {result}" if result != -1 else "Not found")""",
    },
    {
        "slug": "jump-search",
        "name": "Jump Search",
        "category": "searching",
        "difficulty": "medium",
        "time_complexity": "O(√n)",
        "space_complexity": "O(1)",
        "description": "Jump Search works on a sorted array by jumping ahead in fixed blocks of size √n until it lands on or past an element ≥ the target, then performing a linear scan within that final block. It's a middle ground between linear and binary search, useful where jumping forward is cheap but random access is expensive.",
        "sample_code_python": """import math

def jump_search(arr, target):
    n = len(arr)
    if n == 0:
        return -1
    step = int(math.sqrt(n))
    prev = 0
    curr = 0
    # Jump ahead while current value is less than target
    while curr < n and arr[curr] < target:
        prev = curr + 1
        curr += step
    # Linear scan within the final block
    end = min(curr, n - 1)
    for i in range(prev, end + 1):
        if arr[i] == target:
            return i
        if arr[i] > target:
            break
    return -1

# Example
data = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
target = 55
result = jump_search(data, target)
print(f"Searching for {target} in sorted array of length {len(data)}")
print(f"Found at index: {result}" if result != -1 else "Not found")""",
    },
    {
        "slug": "interpolation-search",
        "name": "Interpolation Search",
        "category": "searching",
        "difficulty": "medium",
        "time_complexity": "O(log log n) avg, O(n) worst",
        "space_complexity": "O(1)",
        "description": "Interpolation Search improves on binary search for sorted arrays whose values are roughly uniformly distributed. Instead of probing the midpoint, it estimates the position of the target by linear interpolation between the endpoints. Performs in O(log log n) on uniform data but degrades to O(n) on skewed distributions.",
        "sample_code_python": """def interpolation_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high and arr[low] <= target <= arr[high]:
        if low == high:
            return low if arr[low] == target else -1
        # Interpolation formula
        pos = low + ((target - arr[low]) * (high - low)) // (arr[high] - arr[low])
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1

# Example
data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
target = 70
result = interpolation_search(data, target)
print(f"Searching for {target} in {data}")
print(f"Found at index: {result}" if result != -1 else "Not found")""",
    },
    {
        "slug": "stack",
        "name": "Stack",
        "category": "data-structures",
        "difficulty": "easy",
        "time_complexity": "O(1) push/pop",
        "space_complexity": "O(n)",
        "description": "A Stack is a Last-In-First-Out (LIFO) data structure. Elements are added (pushed) and removed (popped) from the top of the stack only. Think of it like a stack of plates — you can only add or remove from the top.",
        "sample_code_python": """class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)
        print(f"Pushed {item} -> Stack: {self.items}")

    def pop(self):
        if self.is_empty():
            print("Stack underflow!")
            return None
        item = self.items.pop()
        print(f"Popped {item} -> Stack: {self.items}")
        return item

    def peek(self):
        return self.items[-1] if self.items else None

    def is_empty(self):
        return len(self.items) == 0

# Example
s = Stack()
s.push(10)
s.push(20)
s.push(30)
s.pop()
s.pop()
s.push(40)
print(f"Top: {s.peek()}")""",
    },
    {
        "slug": "queue",
        "name": "Queue",
        "category": "data-structures",
        "difficulty": "easy",
        "time_complexity": "O(1) enqueue/dequeue",
        "space_complexity": "O(n)",
        "description": "A Queue is a First-In-First-Out (FIFO) data structure. Elements are added (enqueued) at the rear and removed (dequeued) from the front. Think of it like a line of people waiting — first person in is the first person served.",
        "sample_code_python": """from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)
        print(f"Enqueued {item} -> Queue: {list(self.items)}")

    def dequeue(self):
        if self.is_empty():
            print("Queue underflow!")
            return None
        item = self.items.popleft()
        print(f"Dequeued {item} -> Queue: {list(self.items)}")
        return item

    def front(self):
        return self.items[0] if self.items else None

    def is_empty(self):
        return len(self.items) == 0

# Example
q = Queue()
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
q.dequeue()
q.dequeue()
q.enqueue(40)
print(f"Front: {q.front()}")""",
    },
    {
        "slug": "linked-list",
        "name": "Linked List",
        "category": "data-structures",
        "difficulty": "medium",
        "time_complexity": "O(n) search, O(1) insert/delete at head",
        "space_complexity": "O(n)",
        "description": "A Linked List is a linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, elements are not stored in contiguous memory, allowing efficient insertions and deletions at any position.",
        "sample_code_python": """class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_end(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node

    def delete_node(self, key):
        curr = self.head
        if curr and curr.data == key:
            self.head = curr.next
            return
        prev = None
        while curr and curr.data != key:
            prev = curr
            curr = curr.next
        if curr:
            prev.next = curr.next

    def display(self):
        elements = []
        curr = self.head
        while curr:
            elements.append(str(curr.data))
            curr = curr.next
        print(" -> ".join(elements) + " -> None")

# Example
ll = LinkedList()
for val in [10, 20, 30, 40]:
    ll.insert_at_end(val)
ll.display()
ll.delete_node(20)
ll.display()""",
    },
    {
        "slug": "doubly-linked-list",
        "name": "Doubly Linked List",
        "category": "data-structures",
        "difficulty": "medium",
        "time_complexity": "O(n) search, O(1) insert/delete at known node",
        "space_complexity": "O(n)",
        "description": "A Doubly Linked List is a linear data structure where each node carries pointers to BOTH its next and previous neighbors. This enables O(1) deletion when you already hold the node and allows traversal in both directions — the trade-off is roughly 2x the pointer memory of a singly-linked list.",
        "sample_code_python": """class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def insert_at_head(self, data):
        new = Node(data)
        new.next = self.head
        if self.head:
            self.head.prev = new
        else:
            self.tail = new
        self.head = new

    def insert_at_tail(self, data):
        new = Node(data)
        new.prev = self.tail
        if self.tail:
            self.tail.next = new
        else:
            self.head = new
        self.tail = new

    def delete(self, key):
        curr = self.head
        while curr and curr.data != key:
            curr = curr.next
        if not curr:
            return
        if curr.prev: curr.prev.next = curr.next
        else:         self.head = curr.next
        if curr.next: curr.next.prev = curr.prev
        else:         self.tail = curr.prev

    def traverse_forward(self):
        out, c = [], self.head
        while c: out.append(c.data); c = c.next
        return out

    def traverse_backward(self):
        out, c = [], self.tail
        while c: out.append(c.data); c = c.prev
        return out

# Example
dll = DoublyLinkedList()
for v in [20, 30, 40]:
    dll.insert_at_tail(v)
dll.insert_at_head(10)
print("Forward :", dll.traverse_forward())
print("Backward:", dll.traverse_backward())
dll.delete(30)
print("After delete 30:", dll.traverse_forward())""",
    },
    {
        "slug": "min-heap",
        "name": "Min-Heap / Priority Queue",
        "category": "data-structures",
        "difficulty": "medium",
        "time_complexity": "O(log n) insert/extract, O(n) build-heap",
        "space_complexity": "O(1) extra",
        "description": "A Min-Heap is an array-backed complete binary tree satisfying the heap-order invariant: every parent is ≤ its children. The root is always the global minimum, making it the standard backing structure for priority queues, Dijkstra/Prim, top-k queries, and event simulators.",
        "sample_code_python": """class MinHeap:
    def __init__(self):
        self.h = []

    def _sift_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self.h[i] < self.h[parent]:
                self.h[i], self.h[parent] = self.h[parent], self.h[i]
                i = parent
            else:
                return

    def _sift_down(self, i):
        n = len(self.h)
        while True:
            l, r = 2 * i + 1, 2 * i + 2
            smallest = i
            if l < n and self.h[l] < self.h[smallest]: smallest = l
            if r < n and self.h[r] < self.h[smallest]: smallest = r
            if smallest == i: return
            self.h[i], self.h[smallest] = self.h[smallest], self.h[i]
            i = smallest

    def insert(self, val):
        self.h.append(val)
        self._sift_up(len(self.h) - 1)

    def extract_min(self):
        if not self.h:
            return None
        top = self.h[0]
        last = self.h.pop()
        if self.h:
            self.h[0] = last
            self._sift_down(0)
        return top

    @classmethod
    def from_list(cls, arr):
        # O(n) build-heap
        heap = cls()
        heap.h = list(arr)
        for i in range(len(heap.h) // 2 - 1, -1, -1):
            heap._sift_down(i)
        return heap

# Example
h = MinHeap.from_list([9, 4, 7, 1, 8, 3, 5])
print("Heap array:", h.h)
h.insert(2)
print("After insert(2):", h.h)
print("extract_min:", h.extract_min())
print("After extract:", h.h)""",
    },
    {
        "slug": "bst-operations",
        "name": "BST Operations",
        "category": "trees",
        "difficulty": "medium",
        "time_complexity": "O(h) where h = height",
        "space_complexity": "O(n)",
        "description": "A Binary Search Tree (BST) is a binary tree where every node's left subtree contains only values less than the node, and the right subtree contains only values greater. This enables efficient search, insert, and delete operations averaging O(log n) time.",
        "sample_code_python": """class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return search(root.left, val)
    return search(root.right, val)

def inorder(root):
    if root:
        inorder(root.left)
        print(root.val, end=" ")
        inorder(root.right)

# Example
root = None
for val in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, val)

print("Inorder traversal:")
inorder(root)
print()
result = search(root, 40)
print(f"Search 40: {'Found' if result else 'Not found'}")""",
    },
    {
        "slug": "bst-search",
        "name": "BST Search",
        "category": "trees",
        "difficulty": "easy",
        "time_complexity": "O(h)",
        "space_complexity": "O(1) iterative",
        "description": "BST Search walks the tree from the root, going left when the target is smaller than the current node and right when larger, until either the target is found or a null link is reached. On a balanced BST this is O(log n); on a degenerate (linked-list-shaped) BST it degrades to O(n).",
        "sample_code_python": """class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def search(root, target):
    while root:
        if target == root.val:
            return root
        root = root.left if target < root.val else root.right
    return None

# Example
root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)
print("Search 40:", "Found" if search(root, 40) else "Not found")
print("Search 25:", "Found" if search(root, 25) else "Not found")""",
    },
    {
        "slug": "bst-delete",
        "name": "BST Delete",
        "category": "trees",
        "difficulty": "hard",
        "time_complexity": "O(h)",
        "space_complexity": "O(h) recursion stack",
        "description": "BST Delete removes a value while preserving the BST property. There are three cases: (1) leaf — remove directly; (2) one child — splice the node out and connect parent to grandchild; (3) two children — replace with the in-order successor (smallest value in the right subtree), then recursively delete that successor.",
        "sample_code_python": """class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def find_min(node):
    while node.left:
        node = node.left
    return node

def delete(root, val):
    if not root:
        return None
    if val < root.val:
        root.left = delete(root.left, val)
    elif val > root.val:
        root.right = delete(root.right, val)
    else:
        if not root.left and not root.right:
            return None
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        successor = find_min(root.right)
        root.val = successor.val
        root.right = delete(root.right, successor.val)
    return root

def inorder(root, out=None):
    if out is None:
        out = []
    if root:
        inorder(root.left, out)
        out.append(root.val)
        inorder(root.right, out)
    return out

# Example
root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)
print("Before:", inorder(root))
root = delete(root, 30)
print("After deleting 30:", inorder(root))""",
    },
    {
        "slug": "inorder-traversal",
        "name": "Inorder Traversal",
        "category": "trees",
        "difficulty": "medium",
        "time_complexity": "O(n)",
        "space_complexity": "O(h) recursion stack",
        "description": "Inorder traversal visits the left subtree, then the current node, then the right subtree. On a Binary Search Tree this yields values in sorted ascending order — the basis of tree-backed ordered sets and maps.",
        "sample_code_python": """class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def inorder(root, out=None):
    if out is None:
        out = []
    if root:
        inorder(root.left, out)
        out.append(root.val)
        inorder(root.right, out)
    return out

root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)
print("Inorder:", inorder(root))""",
    },
    {
        "slug": "preorder-traversal",
        "name": "Preorder Traversal",
        "category": "trees",
        "difficulty": "medium",
        "time_complexity": "O(n)",
        "space_complexity": "O(h) recursion stack",
        "description": "Preorder traversal visits the current node first, then its left subtree, then its right subtree. The sequence (with null markers) uniquely identifies the tree, which makes preorder a natural choice for serialization and cloning.",
        "sample_code_python": """class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def preorder(root, out=None):
    if out is None:
        out = []
    if root:
        out.append(root.val)
        preorder(root.left, out)
        preorder(root.right, out)
    return out

root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)
print("Preorder:", preorder(root))""",
    },
    {
        "slug": "postorder-traversal",
        "name": "Postorder Traversal",
        "category": "trees",
        "difficulty": "medium",
        "time_complexity": "O(n)",
        "space_complexity": "O(h) recursion stack",
        "description": "Postorder traversal visits the left subtree, then the right subtree, then the current node — children are always processed before their parent. Useful for safely freeing trees, evaluating expression trees bottom-up, and DFS-based topological sort.",
        "sample_code_python": """class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def postorder(root, out=None):
    if out is None:
        out = []
    if root:
        postorder(root.left, out)
        postorder(root.right, out)
        out.append(root.val)
    return out

root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)
print("Postorder:", postorder(root))""",
    },
    {
        "slug": "level-order-traversal",
        "name": "Level-Order Traversal",
        "category": "trees",
        "difficulty": "medium",
        "time_complexity": "O(n)",
        "space_complexity": "O(w) where w = max width",
        "description": "Level-order (breadth-first) traversal visits all nodes at depth d before any at depth d+1, using a FIFO queue. It's the foundation of BFS shortest-path algorithms on unweighted trees and graphs.",
        "sample_code_python": """from collections import deque

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def level_order(root):
    if not root:
        return []
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        out.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    return out

root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)
print("Level-order:", level_order(root))""",
    },
    {
        "slug": "graph-bfs",
        "name": "Graph BFS",
        "category": "graphs",
        "difficulty": "medium",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V)",
        "description": "Breadth-First Search explores a graph level by level using a FIFO queue, discovering all nodes at distance k from the source before any node at distance k+1. On an unweighted graph it produces shortest-path distances and a BFS tree from the source.",
        "sample_code_python": """from collections import deque

def bfs(graph, source):
    visited = {source}
    dist = {source: 0}
    parent = {source: None}
    q = deque([source])
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in visited:
                visited.add(v)
                dist[v] = dist[u] + 1
                parent[v] = u
                q.append(v)
    return dist, parent

# Example: undirected graph as adjacency dict
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'G'],
    'F': ['C', 'G'],
    'G': ['E', 'F', 'H'],
    'H': ['G'],
}
dist, parent = bfs(graph, 'A')
print("Distances:", dist)
print("BFS parents:", parent)""",
    },
    {
        "slug": "graph-dfs",
        "name": "Graph DFS",
        "category": "graphs",
        "difficulty": "medium",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V) recursion stack",
        "description": "Depth-First Search dives along each branch as deep as possible before backtracking. It is the foundation of cycle detection, topological sort, strongly-connected components, and many graph-theoretic decompositions.",
        "sample_code_python": """def dfs(graph, source):
    visited = set()
    order = []
    parent = {source: None}

    def visit(u, p):
        visited.add(u)
        order.append(u)
        for v in graph[u]:
            if v == p:        # skip the edge we came in on (undirected)
                continue
            if v not in visited:
                parent[v] = u
                visit(v, u)

    visit(source, None)
    return order, parent

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'G'],
    'F': ['C', 'G'],
    'G': ['E', 'F', 'H'],
    'H': ['G'],
}
order, parent = dfs(graph, 'A')
print("DFS discovery order:", order)
print("DFS parents:", parent)""",
    },
    {
        "slug": "fibonacci-dp",
        "name": "Fibonacci (DP)",
        "category": "dynamic-programming",
        "difficulty": "easy",
        "time_complexity": "O(n)",
        "space_complexity": "O(n) — O(1) with rolling variables",
        "description": "Bottom-up dynamic programming computes Fibonacci in O(n) by filling a 1-D table where dp[i] = dp[i-1] + dp[i-2]. This eliminates the exponential redundancy of the naive recursive definition and is the canonical teaching example for memoization vs. tabulation.",
        "sample_code_python": """def fib(n):
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

def fib_optimized(n):
    # O(1) space — rolling variables
    if n < 2:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Example
for n in range(10):
    print(f"F({n}) = {fib(n)}")
print("F(50) =", fib_optimized(50))""",
    },
    {
        "slug": "lcs",
        "name": "Longest Common Subsequence",
        "category": "dynamic-programming",
        "difficulty": "medium",
        "time_complexity": "O(m·n)",
        "space_complexity": "O(m·n) — O(min(m,n)) with row compression",
        "description": "The Longest Common Subsequence problem finds the longest subsequence common to two strings. It uses a 2-D DP table where dp[i][j] is the LCS length of the first i characters of B and the first j characters of A. The same DP underlies diff/merge tools, file synchronization, and bioinformatics sequence alignment.",
        "sample_code_python": """def lcs(A, B):
    m, n = len(B), len(A)
    # dp[i][j] = LCS length of B[:i] and A[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if B[i - 1] == A[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    # Traceback to recover the subsequence
    i, j = m, n
    chars = []
    while i > 0 and j > 0:
        if B[i - 1] == A[j - 1]:
            chars.append(B[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return dp[m][n], ''.join(reversed(chars))

# Example
A, B = "AGCAT", "GAC"
length, subseq = lcs(A, B)
print(f"A = {A}")
print(f"B = {B}")
print(f"LCS length = {length}")
print(f"LCS string = '{subseq}'")""",
    },
]


def seed_database():
    """Seed the database with algorithm data if empty."""
    db: Session = SessionLocal()
    try:
        existing_count = db.query(Algorithm).count()
        if existing_count == 0:
            for algo_data in SEED_ALGORITHMS:
                algo = Algorithm(**algo_data)
                db.add(algo)
            db.commit()
            print(f"[OK] Seeded {len(SEED_ALGORITHMS)} algorithms into the database.")
        else:
            print(f"[OK] Database already has {existing_count} algorithms. Skipping seed.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
    finally:
        db.close()


# ─── App Lifecycle ──────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup
    print("[START] Starting DSA Platform API...")
    init_db()
    seed_database()
    print("[OK] Database initialized.")
    print("[OK] API ready at http://localhost:8000")
    print("[OK] Docs at http://localhost:8000/docs")
    yield
    # Shutdown
    print("[SHUTDOWN] Shutting down DSA Platform API...")


# ─── App Instance ───────────────────────────────────────────────────

app = FastAPI(
    title="DSA Learning Platform API",
    description="Backend API for the interactive DSA visualization and learning platform.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(algorithms.router)
app.include_router(execute.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
