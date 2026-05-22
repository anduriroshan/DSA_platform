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
        "slug": "tree-traversals",
        "name": "Tree Traversals",
        "category": "trees",
        "difficulty": "medium",
        "time_complexity": "O(n)",
        "space_complexity": "O(h) recursion stack",
        "description": "Tree traversal is the process of visiting every node in a tree exactly once. The three main depth-first traversals are: Inorder (Left-Root-Right), Preorder (Root-Left-Right), and Postorder (Left-Right-Root). Each produces a different ordering of the nodes.",
        "sample_code_python": """class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder(root, result=None):
    if result is None:
        result = []
    if root:
        inorder(root.left, result)
        result.append(root.val)
        inorder(root.right, result)
    return result

def preorder(root, result=None):
    if result is None:
        result = []
    if root:
        result.append(root.val)
        preorder(root.left, result)
        preorder(root.right, result)
    return result

def postorder(root, result=None):
    if result is None:
        result = []
    if root:
        postorder(root.left, result)
        postorder(root.right, result)
        result.append(root.val)
    return result

# Build a sample tree
#        1
#       / \\
#      2   3
#     / \\
#    4   5
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

print("Inorder:  ", inorder(root))
print("Preorder: ", preorder(root))
print("Postorder:", postorder(root))""",
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
