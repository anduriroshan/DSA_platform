import { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { algorithmRegistry } from '../../utils/algorithmRegistry';

export default function LearnTab() {
  const { currentAlgorithm, currentStep, frames } = useVisualizerStore();
  const config = algorithmRegistry[currentAlgorithm];
  const activeLineRef = useRef<HTMLDivElement>(null);

  const frame = frames[currentStep];
  const activeLine = frame && 'codeLineHighlight' in frame ? frame.codeLineHighlight : -1;

  // Auto-scroll active pseudocode line into view (inside the pseudocode block only)
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [activeLine]);

  if (!config) return null;
  const isStable = ['bubble-sort', 'insertion-sort', 'merge-sort', 'counting-sort', 'radix-sort'].includes(config.slug);

  return (
    <div className="learn-tab">
      <div className="learn-section">
        <p className="learn-p">{config.description}</p>
      </div>

      <div className="learn-section">
        <h2 className="learn-h2">▸ COMPLEXITY ANALYSIS</h2>
        <div className="learn-stats-grid">
          <div className="learn-stat">
            <div className="learn-stat-label">TIME</div>
            <div className="learn-stat-value">{config.timeComplexity}</div>
          </div>
          <div className="learn-stat">
            <div className="learn-stat-label">SPACE</div>
            <div className="learn-stat-value">{config.spaceComplexity}</div>
          </div>
          {config.visualizerType === 'array' && (
            <div className="learn-stat">
              <div className="learn-stat-label">STABLE</div>
              <div className={`learn-stat-value ${isStable ? 'good' : 'warn'}`}>{isStable ? 'YES' : 'NO'}</div>
            </div>
          )}
          <div className="learn-stat">
            <div className="learn-stat-label">DIFFICULTY</div>
            <div className={`learn-stat-value ${config.difficulty}`}>
              {config.difficulty.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="learn-section">
        <h2 className="learn-h2">▸ HOW IT WORKS</h2>
        <ul className="learn-list">
          {getHowItWorks(config.slug).map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="learn-section">
        <h2 className="learn-h2">▸ PSEUDOCODE  <span className="pseudo-sync-label">◆ SYNCS WITH VIZ</span></h2>
        <div className="pseudocode-block-inline">
          <div className="pseudocode-block-lines">
            {config.pseudocode.map((line, idx) => (
              <div
                key={idx}
                ref={idx === activeLine ? activeLineRef : undefined}
                className={`pseudocode-line ${idx === activeLine ? 'active' : ''}`}
              >
                <span className="line-number">{idx + 1}</span>
                <span className="line-content">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="learn-section">
        <h2 className="learn-h2">▸ WHEN TO USE IT</h2>
        <div className="learn-callout">
          <div className="learn-callout-title">▸ USE CASES</div>
          <div className="learn-callout-body">{getUseCases(config.slug)}</div>
        </div>
      </div>
    </div>
  );
}

function getHowItWorks(slug: string): string[] {
  const map: Record<string, string[]> = {
    'bubble-sort': [
      'Start at the beginning of the array.',
      'Compare each pair of adjacent elements.',
      'If they are in the wrong order, swap them.',
      'After one full pass, the largest element "bubbles up" to the end.',
      'Repeat the process until no swaps are needed.',
    ],
    'selection-sort': [
      'Divide the array into a sorted and unsorted region.',
      'Find the minimum element in the unsorted region.',
      'Swap it with the first element of the unsorted region.',
      'Move the boundary one step to the right.',
      'Repeat until the unsorted region is empty.',
    ],
    'insertion-sort': [
      'Treat the first element as already sorted.',
      'Pick the next element (the "key").',
      'Shift larger elements in the sorted region to the right.',
      'Insert the key into its correct position.',
      'Repeat for every element in the array.',
    ],
    'merge-sort': [
      'Recursively split the array into two halves until each piece has one element.',
      'Merge two sorted halves by comparing their fronts and picking the smaller.',
      'Continue merging upward until the full array is reassembled in sorted order.',
      'Uses extra memory but guarantees O(n log n) performance.',
    ],
    'quick-sort': [
      'Pick a "pivot" element (often the last element).',
      'Partition the array so smaller elements go left and larger go right.',
      'Recursively quick-sort the left and right partitions.',
      'The pivot ends up in its final sorted position after each partition.',
      'No extra array needed — partitioning happens in place.',
    ],
    'heap-sort': [
      'Treat the array as an implicit binary heap: parent at i, children at 2i+1 and 2i+2.',
      'Phase 1 — Build max-heap: call heapify on every non-leaf node from n/2-1 down to 0.',
      'Heapify sifts a node down by swapping with the larger child until the heap property holds.',
      'Phase 2 — Repeatedly swap arr[0] (the max) with the last unsorted element, then heapify the reduced heap.',
      'Sorts in-place with O(1) extra space; unlike merge sort, it is NOT stable.',
    ],
    'counting-sort': [
      'Find the min and max to compute the key range k = max - min + 1.',
      'Build a count array of size k: count[v - min] = number of occurrences of v.',
      'Convert counts to cumulative counts so count[i] = number of elements ≤ i+min.',
      'Iterate the input right-to-left, placing each value at output[count[v-min]-1] and decrementing — this preserves stability.',
      'Linear time when k is O(n); becomes wasteful when k ≫ n.',
    ],
    'radix-sort': [
      'Find the maximum value to know how many digits d to process.',
      'Starting at the least significant digit, run a stable counting sort using that digit as the key.',
      'Advance to the next digit (multiply exp by 10) and repeat.',
      'After d passes the array is fully sorted — relies on the per-digit sort being STABLE.',
      'Works only on non-negative integers (or fixed-width keys); not a comparison sort.',
    ],
    'linear-search': [
      'Start at the first element of the array.',
      'Compare each element to the target.',
      'Return the index immediately when a match is found.',
      'If you reach the end without a match, return -1.',
    ],
    'binary-search': [
      'Requires the array to be sorted.',
      'Set low = 0 and high = n-1.',
      'Find the middle element. If it matches the target — done.',
      'If the target is smaller, search the left half. Otherwise the right.',
      'Repeat, halving the search range each iteration.',
    ],
    'jump-search': [
      'Requires a sorted array. Pick block size m = ⌊√n⌋ — the optimum for this strategy.',
      'Jump forward by m: 0, m, 2m, … until you land on or past an element ≥ target.',
      'When that happens, perform a linear scan backwards/forwards within the previous block.',
      'Total cost ≈ √n jumps + √n linear steps → O(√n).',
      'Faster than linear search but slower than binary search; useful when seeking forward is cheap but jumping back is expensive (e.g., linked lists with skip pointers).',
    ],
    'interpolation-search': [
      'Requires a sorted array of uniformly (or roughly uniformly) distributed values.',
      'Instead of probing the midpoint, estimate the position using linear interpolation: pos = low + (target - arr[low]) × (high - low) / (arr[high] - arr[low]).',
      'If arr[pos] equals the target, done. Otherwise narrow [low, high] to the half on the same side as the target.',
      'Average O(log log n) when values are uniformly distributed; degrades to O(n) on skewed data (e.g., exponential distributions).',
      'Pre-check target ∈ [arr[low], arr[high]] before each probe to avoid out-of-range positions.',
    ],
    'stack': [
      'A LIFO (Last-In, First-Out) data structure.',
      'push(x) adds an element to the top.',
      'pop() removes and returns the top element.',
      'peek() returns the top without removing.',
      'Used in function call stacks, undo buffers, and parsers.',
    ],
    'queue': [
      'A FIFO (First-In, First-Out) data structure.',
      'enqueue(x) adds to the back of the queue.',
      'dequeue() removes and returns the front element.',
      'Used in task scheduling, BFS, and message buffers.',
    ],
    'linked-list': [
      'Each node holds a value and a pointer to the next node.',
      'Insertion at the head is O(1) — just rewire the head pointer.',
      'Searching is O(n) — must walk node-by-node.',
      'Unlike arrays, size grows dynamically with no copying.',
    ],
    'doubly-linked-list': [
      'Every node stores TWO pointers: next (forward) and prev (backward); head.prev and tail.next are null.',
      'Insertion at head/tail is O(1) when you already hold the head/tail reference — just rewire 2-4 pointers.',
      'Deletion is O(1) once you have the node itself: node.prev.next = node.next; node.next.prev = node.prev. (Compare with a singly-linked list which needs an O(n) search for the predecessor.)',
      'Traversal works in both directions — invaluable for LRU caches and editor cursors that need to step backward.',
      'Costs ~2× the pointer memory of a singly-linked list; harder to keep both pointers consistent under concurrent updates.',
    ],
    'bst-operations': [
      'Each node has at most two children: left and right.',
      'For every node: left subtree values < node < right subtree values.',
      'Insert by walking left for smaller values, right for larger, until a null slot is found.',
      'Balanced BSTs give O(log n) search; degenerate ones drop to O(n).',
    ],
    'bst-search': [
      'Start at the root.',
      'If target equals the current node value, return success.',
      'If target is smaller, descend into the left subtree; if larger, descend right.',
      'Stop when the target is found or when you fall off the tree (null child).',
      'On a balanced BST this runs in O(log n); on a degenerate (linked-list-shaped) BST it degrades to O(n).',
    ],
    'bst-delete': [
      'Locate the node to delete using a normal BST search.',
      'Case 1 — leaf node: simply detach it from its parent.',
      'Case 2 — one child: splice the node out by linking its parent directly to its only child.',
      'Case 3 — two children: find the in-order successor (smallest value in the right subtree), copy its value into the node being deleted, then recursively delete that successor (which has at most one child).',
      'Always preserves the BST invariant; runs in O(h) where h is tree height.',
    ],
    'inorder-traversal': [
      'Recursively traverse the left subtree.',
      'Visit (process) the current node.',
      'Recursively traverse the right subtree.',
      'On a BST, inorder produces values in sorted ascending order — that property is the basis of tree-based sets/maps.',
      'Iterative variant uses an explicit stack to simulate the recursion.',
    ],
    'preorder-traversal': [
      'Visit the current node first.',
      'Recursively traverse the left subtree.',
      'Recursively traverse the right subtree.',
      'Produces a sequence from which the tree can be uniquely reconstructed (with null markers), making it ideal for serialization.',
      'Also the natural order for prefix-expression evaluation and tree copy.',
    ],
    'postorder-traversal': [
      'Recursively traverse the left subtree.',
      'Recursively traverse the right subtree.',
      'Visit the current node last — after both children are fully processed.',
      'Used to safely free/delete a tree (children gone before parent) and to evaluate expression trees bottom-up.',
      'Forms the basis of dependency resolution algorithms like topological sort via DFS.',
    ],
    'level-order-traversal': [
      'Breadth-first traversal — visits all nodes at depth d before any at depth d+1.',
      'Use a FIFO queue: enqueue the root, then repeatedly dequeue a node, visit it, and enqueue its children left-to-right.',
      'Memory usage is the maximum width of the tree (the bottom level for a complete tree, ≈ n/2).',
      'Foundation for shortest-path on unweighted trees/graphs and for "print tree level by level" problems.',
    ],
    'min-heap': [
      'Stored as a flat array — node at index i has children at 2i+1 and 2i+2, parent at floor((i-1)/2). No pointers needed.',
      'Heap-order invariant: every parent ≤ both children (for a min-heap). The root is always the global minimum.',
      'insert(v): append at the end, then sift-UP — repeatedly swap with parent while parent > current. O(log n).',
      'extractMin(): swap root with last element, pop the last, then sift-DOWN from the root by swapping with the smaller child until order is restored. O(log n).',
      'buildHeap(arr): call siftDown on every non-leaf node from n/2-1 down to 0. Tight analysis gives O(n), not O(n log n), because most nodes are near the leaves.',
      'Not stable, and not designed for arbitrary-key search (O(n)). For decrease-key operations you need a node→index map.',
    ],
    'graph-bfs': [
      'Use a FIFO queue and a visited set. Enqueue the source and mark it visited; set dist[source] = 0.',
      'Repeatedly dequeue a node u, then for each neighbor v: if v is unvisited, mark it, set dist[v] = dist[u]+1, and enqueue v.',
      'BFS visits every node at distance k before any node at distance k+1 — the "level-by-level" expansion.',
      'On an unweighted graph the discovered distances ARE the shortest-path distances. The discovery edges form the BFS tree.',
      'Runs in O(V + E) with adjacency lists; degrades to O(V²) with adjacency matrices on sparse graphs.',
      'Cannot handle weighted shortest paths in general — use Dijkstra (non-negative weights) or Bellman-Ford instead.',
    ],
    'graph-dfs': [
      'Start at the source; mark it as "on the recursion stack" (visiting).',
      'For each neighbor v: if v is unvisited, recurse into it (this edge is a tree edge); otherwise skip (back edge in undirected, possibly forward/cross in directed).',
      'When all neighbors are explored, mark the node as fully visited and return — this is the post-order moment.',
      'DFS naturally produces discovery and finish times, which underpin topological sort, cycle detection, SCC (Tarjan/Kosaraju), and bridge/articulation-point algorithms.',
      'Iterative implementations swap recursion for an explicit stack — same O(V + E) complexity, plus O(V) stack memory.',
      'Unlike BFS, DFS does NOT find shortest paths on unweighted graphs.',
    ],
    'fibonacci-dp': [
      'Naive recursion F(n) = F(n-1) + F(n-2) recomputes the same subproblems exponentially many times — O(φⁿ).',
      'Bottom-up DP defines dp[i] = F(i), initializes dp[0]=0 and dp[1]=1, then fills i = 2..n in a single pass.',
      'Each cell reads exactly the two cells to its left, so total work is O(n) and the table makes the dependency structure explicit.',
      'Space can be reduced to O(1) by keeping only the last two values (rolling variables) — a standard "DP table compression" trick.',
      'The DP-table view scales to harder problems (LCS, knapsack, edit distance) where memoization saves the same work, but the table is 2-D.',
    ],
    'lcs': [
      'Define dp[i][j] = length of the LCS of B[0..i-1] and A[0..j-1]. Use (|B|+1) × (|A|+1) so the empty-prefix row/column gives base case 0.',
      'On character match (B[i-1] == A[j-1]): dp[i][j] = dp[i-1][j-1] + 1 — extend the LCS of the prefixes one shorter on both sides.',
      'On mismatch: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) — drop the last character from whichever string and take the better option.',
      'Fill row by row, left to right. The bottom-right cell dp[|B|][|A|] is the LCS length.',
      'To reconstruct the actual subsequence, traceback from (|B|, |A|): on match emit the char and move diagonally; on mismatch move toward the larger neighbor (up if dp[i-1][j] ≥ dp[i][j-1] else left).',
      'Space can be reduced to O(min(m,n)) by keeping only the previous row, but you lose the ability to traceback without recomputation.',
    ],
  };
  return map[slug] ?? ['No detailed steps available yet — explore the pseudocode below for the algorithm logic.'];
}

function getUseCases(slug: string): string {
  const map: Record<string, string> = {
    'bubble-sort': 'Mostly educational — easy to understand but inefficient on large inputs. Useful when teaching sorting concepts or for very small / nearly-sorted arrays.',
    'selection-sort': 'When the cost of writing (swapping) is high relative to reading. Performs at most n swaps, fewer than bubble sort.',
    'insertion-sort': 'Excellent for small arrays (~20 elements) or nearly-sorted data. Used inside hybrid sorts like Timsort for small partitions.',
    'merge-sort': "External sorting (huge datasets that don't fit in memory), and as the basis for Python's sorted() and Java's Arrays.sort() for objects.",
    'quick-sort': 'The default in-memory sort for many standard libraries (C, C++). Fast on average but worst-case O(n²) without good pivot choice.',
    'heap-sort': 'Used when guaranteed O(n log n) worst-case is required AND no extra memory may be allocated (unlike merge sort). The underlying max-heap is also the standard implementation of priority queues (e.g., Linux CFS scheduler, Dijkstra and Prim with binary heaps, Python heapq). Not stable, so usually loses to Timsort or Introsort for general-purpose use.',
    'counting-sort': 'Sorting integers within a small known range — graders sorting scores 0–100, byte-frequency tables, or histogramming. Often used as the stable inner loop of Radix Sort.',
    'radix-sort': 'Sorting large batches of fixed-width keys: 32-bit integers, IPv4 addresses, US ZIP codes, license plates. Used in some database engines and in GPU-friendly sorting libraries (e.g., CUB, Thrust) because each digit pass is highly parallelizable.',
    'linear-search': "Unsorted data, or very small arrays where binary search overhead isn't worth it. Also for linked lists where random access is unavailable.",
    'binary-search': 'Sorted arrays where you need fast lookup. Forms the basis of search trees and many divide-and-conquer algorithms.',
    'jump-search': 'A middle ground between linear and binary search — useful on sorted structures where random access is possible but expensive (e.g., disk pages, sorted linked lists with skip pointers). Skip lists generalize the same idea to O(log n).',
    'interpolation-search': 'Searching huge sorted arrays where keys are roughly uniformly distributed: phone-book lookups, sorted timestamps, evenly-spaced sensor data. Beats binary search in practice on such data but loses badly on skewed distributions.',
    'stack': 'Function calls (the call stack), expression parsing, undo/redo systems, depth-first search, and matching brackets.',
    'queue': 'Task scheduling, breadth-first search, print spoolers, and message-passing between threads.',
    'linked-list': "When frequent insertions/deletions are needed and random access isn't. Building blocks for stacks, queues, and hash table chains.",
    'doubly-linked-list': "LRU caches (the linked list inside Java's LinkedHashMap, Redis's eviction lists, Python's collections.OrderedDict): O(1) move-to-front when you already hold a hash-map pointer to the node. Editor cursors and undo/redo systems that step in either direction. The Linux kernel's list_head is a circular doubly-linked list used for almost every kernel queue (processes, modules, network buffers). Browser History (back/forward) is conceptually the same structure.",
    'min-heap': "Priority queues throughout standard libraries: Python's heapq, C++'s std::priority_queue, Java's PriorityQueue (all binary heaps). Dijkstra and Prim use a min-heap for O((V+E) log V) shortest-path / MST. The Linux CFS scheduler uses a red-black tree, but earlier schedulers and many embedded RTOSes use binary heaps. Event simulators (Kafka delayed-message queue, simulation frameworks) keep upcoming events ordered by timestamp via a min-heap. Top-k queries scan in O(n log k) using a size-k min-heap.",
    'graph-bfs': "Unweighted shortest paths — Facebook/LinkedIn 'degrees of connection' between users; web crawlers (each link is one hop); puzzle solvers (Rubik's cube, sliding puzzles) where each move has uniform cost; peer-to-peer flood-fill / network broadcast (e.g., Ethereum block propagation); bipartite testing; minimum spanning tree on unweighted graphs.",
    'graph-dfs': "Detecting cycles (Git's commit-graph integrity checks), topological sort (build systems like Make, Bazel, npm dependency resolution), strongly-connected components (Tarjan/Kosaraju used inside compilers for variable scope and inside graph databases like Neo4j), finding bridges and articulation points (network reliability analysis). Solving mazes (the recursive backtracker maze generator is just DFS). Linux's du and find use DFS over the directory tree.",
    'fibonacci-dp': "The canonical 'gateway' DP problem — used as the teaching example for memoization vs tabulation in essentially every algorithms textbook (CLRS, Skiena, Sedgewick). Real-world cousins include rod-cutting, climbing-stairs counting, and certain combinatorial recurrences in bioinformatics (e.g., RNA secondary structure pairings). The O(1)-space rolling-variable form is the version you'll actually ship; the table form is for teaching the dependency pattern.",
    'lcs': "diff and git's three-way merge are LCS at heart — most modern implementations use Myers's diff algorithm (an LCS-on-edit-graph variant). Bioinformatics: sequence alignment of DNA/protein strings (BLAST, Needleman-Wunsch is a weighted LCS variant). Plagiarism detection, file synchronization (rsync's delta), and natural-language similarity scoring all reduce to LCS or its weighted edit-distance siblings.",
    'bst-operations': 'Ordered data with fast lookups, insertions, and deletions. Database indexes (B-trees), filesystem trees, and set/map implementations.',
    'bst-search': "C++ std::set / std::map and Java TreeMap use Red-Black trees (a balanced BST) backed by this exact search routine. Also the lookup primitive for filesystem directory trees and in-memory indexes.",
    'bst-delete': 'The trickiest BST operation — required by any in-memory ordered set/map. Balanced variants (AVL, Red-Black) layer rotations on top of this same three-case skeleton. Real systems like PostgreSQL B-trees and Linux rbtree.c use the same successor-replacement idea.',
    'inorder-traversal': 'Producing sorted output from a BST (std::map iteration in C++, in-order iterators in Java TreeMap), serializing for sorted dumps, and validating BST invariants in tests.',
    'preorder-traversal': "Tree serialization (LeetCode's serialize/deserialize, Git's tree objects), cloning, and producing prefix notation for compilers and expression evaluators.",
    'postorder-traversal': "Safely freeing trees in languages without GC, evaluating expression trees (compilers, calculators), and DFS-based topological sort. Linux's directory removal (rm -r) is effectively a postorder traversal.",
    'level-order-traversal': "Foundation of BFS — shortest paths in unweighted graphs, web crawlers, social-graph 'friends of friends' queries, and the textbook 'print binary tree level by level' interview question.",
  };
  return map[slug] ?? 'Explore where this concept appears in real systems by checking the pseudocode and running examples.';
}
