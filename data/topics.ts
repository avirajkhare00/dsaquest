export interface StoryChapter {
  id: number;
  title: string;
  emoji: string;
  narrative: string;
  concept: string;
  codeExample?: string;
  tip?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Pattern {
  name: string;
  description: string;
  useCase: string;
}

export interface Topic {
  slug: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
  gradient: string;
  textColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToComplete: string;
  keyComplexities: { operation: string; complexity: string }[];
  patterns: Pattern[];
  story: StoryChapter[];
  quiz: QuizQuestion[];
}

export const topics: Topic[] = [
  {
    slug: 'arrays',
    title: 'Arrays & Strings',
    emoji: '📚',
    tagline: 'The Foundation of Everything',
    description: 'Master the most fundamental data structure — arrays — and unlock the two-pointer and sliding window patterns used in 40% of LeetCode problems.',
    color: '#6366f1',
    gradient: 'from-indigo-400 to-purple-500',
    textColor: 'text-indigo-600',
    difficulty: 'Beginner',
    timeToComplete: '25 min',
    keyComplexities: [
      { operation: 'Access by index', complexity: 'O(1)' },
      { operation: 'Search (unsorted)', complexity: 'O(n)' },
      { operation: 'Insert at end', complexity: 'O(1) amortized' },
      { operation: 'Insert at middle', complexity: 'O(n)' },
      { operation: 'Delete at middle', complexity: 'O(n)' },
    ],
    patterns: [
      { name: 'Two Pointers', description: 'Use left/right pointers moving toward each other', useCase: 'Pair sum, palindrome check, container with most water' },
      { name: 'Sliding Window', description: 'Move a fixed or variable window across the array', useCase: 'Max subarray sum, longest substring without repeating chars' },
      { name: 'Prefix Sum', description: 'Pre-compute cumulative sums for O(1) range queries', useCase: 'Subarray sum equals k, range sum queries' },
    ],
    story: [
      {
        id: 1,
        emoji: '🏛️',
        title: 'The Library of Alexandria',
        narrative: `Welcome, young scholar, to the Library of Alexandria — the greatest library of the ancient world! 📜

Inside, thousands of scrolls are stored on a single, impossibly long shelf. Each scroll sits in a numbered slot — slot 0, slot 1, slot 2, and so on. This is exactly how an **array** works!

When the head librarian needs scroll #42, she walks straight to slot 42. No searching. No wandering. Just... slot 42. She knows *exactly* where it is because every slot is the same size and they're laid out sequentially in memory.`,
        concept: 'An array stores elements in contiguous memory locations. Because each element is the same size, you can calculate any element\'s address instantly: address = base_address + (index × element_size)',
        codeExample: `// Arrays in JavaScript/TypeScript
const scrolls = ["Homer", "Plato", "Aristotle", "Socrates"];

// O(1) — instant access!
console.log(scrolls[2]); // "Aristotle"

// O(n) — must check each one
const found = scrolls.find(s => s === "Plato"); // "Plato"`,
        tip: '🎯 Interview tip: When you see "find pair" or "check if sorted", think arrays + two pointers first!',
      },
      {
        id: 2,
        emoji: '👆👆',
        title: 'The Two Pointer Magic',
        narrative: `A merchant arrives at the library with a puzzle: "I have a **sorted** list of scroll weights. Find me two scrolls that together weigh exactly 100 lbs!"

The naive approach: check every possible pair. But a clever junior librarian has a better idea. She places one finger at the **lightest** scroll (left) and one at the **heaviest** (right).

- If their sum is **too heavy** → move the right finger left (to something lighter)
- If their sum is **too light** → move the left finger right (to something heavier)
- If it's **exactly right** → 🎉 Found it!

This is the **Two Pointer** technique — turning O(n²) into O(n)!`,
        concept: 'Two Pointers works on sorted arrays. Start with left=0, right=n-1. Move them based on whether current sum is too big or too small. Each pointer moves at most n times → O(n) total.',
        codeExample: `function twoSum(nums: number[], target: number): [number, number] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;   // need bigger
    else right--;                     // need smaller
  }
  return [-1, -1]; // not found
}

// twoSum([1, 3, 5, 7, 9, 11], 12) → [1, 4] (3+9)`,
        tip: '🎯 Interview tip: Two pointers works ONLY on sorted arrays (or when the problem allows sorting). If array is unsorted and you can\'t sort, use a HashMap instead.',
      },
      {
        id: 3,
        emoji: '🪟',
        title: 'The Sliding Window Spell',
        narrative: `The library has a new problem: the Queen wants the **most popular section** — the consecutive k shelves with the most total readers.

Brute force? Calculate sum for every window of k shelves. O(n×k). Terrible!

The librarian's trick: slide a **window** across the shelf. When the window moves one step right:
- **Add** the new element on the right ➕
- **Remove** the element that left on the left ➖

No re-summing the whole window! Just two operations per step. O(n) total. This is the **Sliding Window** pattern.`,
        concept: 'Sliding Window maintains a running computation as a window slides across the array. Fixed window: add right element, remove left element. Variable window: expand right until constraint breaks, shrink from left.',
        codeExample: `// Maximum sum subarray of size k — O(n)
function maxSumSubarray(nums: number[], k: number): number {
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]; // slide!
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// Longest substring without repeating characters — variable window
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) { seen.delete(s[left++]); }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
        tip: '🎯 Interview tip: If the problem asks for "subarray/substring with condition", think sliding window. Variable window = shrink from left when condition breaks.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the time complexity of accessing an element at index i in an array?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Array access is O(1) because elements are stored in contiguous memory. The CPU can calculate the exact memory address instantly: base + (i × element_size).',
      },
      {
        id: 2,
        question: 'You have a sorted array and need to find two numbers that sum to a target. What\'s the most efficient approach?',
        options: ['Nested for loops — O(n²)', 'Sort + binary search — O(n log n)', 'Two pointers — O(n)', 'HashMap — O(n)'],
        correctIndex: 2,
        explanation: 'Since the array is already sorted, two pointers is optimal at O(n). HashMap is also O(n) but uses O(n) space. Two pointers uses O(1) extra space, making it superior here.',
      },
      {
        id: 3,
        question: 'What is the time complexity of inserting an element in the middle of an array of size n?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Inserting in the middle requires shifting all subsequent elements one position to the right, which takes O(n) time in the worst case.',
      },
      {
        id: 4,
        question: 'The sliding window technique is MOST useful when?',
        options: ['Finding an element in an unsorted array', 'Finding a subarray/substring satisfying a condition', 'Sorting an array efficiently', 'Reversing an array'],
        correctIndex: 1,
        explanation: 'Sliding window shines for contiguous subarray/substring problems. It reduces O(n²) brute force to O(n) by maintaining a running computation as the window slides.',
      },
      {
        id: 5,
        question: 'What does "amortized O(1)" mean for array append operations?',
        options: ['Every single append is O(1)', 'Arrays never need to resize', 'The AVERAGE cost over many appends is O(1), even though occasional resizes are O(n)', 'Appending is always O(n)'],
        correctIndex: 2,
        explanation: 'Dynamic arrays double in size when full. While a resize operation copies all elements (O(n)), it happens so rarely that when you average the cost over all insertions, each append costs O(1) amortized.',
      },
    ],
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    emoji: '🔗',
    tagline: 'Follow the Chain',
    description: 'Master the pointer-based structure behind many interview problems. Learn node traversal, fast/slow pointers, and the art of reversing a list.',
    color: '#ec4899',
    gradient: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-600',
    difficulty: 'Intermediate',
    timeToComplete: '30 min',
    keyComplexities: [
      { operation: 'Access by index', complexity: 'O(n)' },
      { operation: 'Search', complexity: 'O(n)' },
      { operation: 'Insert at head', complexity: 'O(1)' },
      { operation: 'Insert at tail', complexity: 'O(1) with tail ptr' },
      { operation: 'Delete (given node)', complexity: 'O(1)' },
    ],
    patterns: [
      { name: 'Fast & Slow Pointers', description: 'Two pointers at different speeds to detect cycles or find midpoints', useCase: 'Cycle detection, find middle, nth from end' },
      { name: 'Reverse a List', description: 'Iteratively reassign next pointers using prev/curr/next', useCase: 'Palindrome LL, reverse k-groups, reorder list' },
      { name: 'Dummy Head Node', description: 'Use a fake head node to simplify edge cases', useCase: 'Merge sorted lists, delete specific nodes' },
    ],
    story: [
      {
        id: 1,
        emoji: '🕵️',
        title: 'The Spy\'s Dead Drop Network',
        narrative: `You're Agent K — a secret operative running a spy network using **dead drops**: hidden locations where messages are left.

Here's the system: each dead drop location contains a **message** AND a note saying *exactly* where the next dead drop is. To read all messages, you start at Location #1 and follow the chain.

This is a **Linked List**! Each location is a **node** containing:
- 📦 Data (the secret message)
- 👉 Next pointer (directions to the next location)

Unlike arrays (one giant shelf), linked list nodes can be **anywhere** in memory. You just follow the pointers.`,
        concept: 'A linked list is a chain of nodes. Each node has data and a pointer to the next node. The last node points to null. The head pointer gives you the entry point.',
        codeExample: `// Node definition
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

// Building: 1 → 2 → 3 → null
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);

// Traversal — O(n)
let curr = head;
while (curr !== null) {
  console.log(curr.val);
  curr = curr.next;
}`,
        tip: '🎯 Interview tip: Always check for null before accessing .next. The most common linked list bug is a null pointer exception!',
      },
      {
        id: 2,
        emoji: '🐢🐇',
        title: 'The Tortoise and the Hare',
        narrative: `Enemy agents suspect there's a **loop** in our dead drop network — they've created a circular route to trap operatives!

Agent K uses a brilliant trick: she sends **two operatives** along the route simultaneously:
- 🐢 **Slow operative**: moves one dead drop at a time
- 🐇 **Fast operative**: moves TWO dead drops at a time

If there's a loop, the fast operative will eventually **lap** the slow one — they'll meet at the same location. If there's no loop, the fast operative reaches the end.

This is **Floyd's Cycle Detection Algorithm** — used in linked list problems everywhere!`,
        concept: 'Floyd\'s algorithm: slow moves 1 step, fast moves 2 steps. If there\'s a cycle, they MUST meet (fast catches up at rate of 1 step per iteration). If no cycle, fast reaches null. Finding cycle start: reset one pointer to head, move both 1 step at a time — they meet at the cycle start.',
        codeExample: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;           // 1 step
    fast = fast.next.next;       // 2 steps
    if (slow === fast) return true; // met! cycle exists
  }
  return false; // fast hit null, no cycle
}

// Find middle of linked list (same trick!)
function findMiddle(head: ListNode): ListNode {
  let slow = head;
  let fast = head;

  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  return slow; // slow is at the middle
}`,
        tip: '🎯 Interview tip: Any time you see "cycle", "middle", or "nth from end" with a linked list — fast/slow pointers is your go-to!',
      },
      {
        id: 3,
        emoji: '🔄',
        title: 'The Great Reversal',
        narrative: `Mission: the enemy has captured the tail of our dead drop network. We need to **reverse the entire chain** so we can access it from the other direction!

Agent K walks along the chain. At each location, she changes the "next" sign to point BACKWARD (to where she just came from), then moves forward.

She needs to remember 3 things:
- **prev**: where she came from
- **curr**: where she is now
- **next**: where she's going (save BEFORE changing the sign!)

Three pointers. One pass. O(n) time, O(1) space. Elegant.`,
        concept: 'Reverse a linked list iteratively with 3 pointers. At each step: 1) Save next node, 2) Point current node backward, 3) Advance both pointers. After the loop, prev is the new head.',
        codeExample: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next;  // 1. Save next
    curr.next = prev;         // 2. Reverse pointer
    prev = curr;              // 3. Advance prev
    curr = next;              // 4. Advance curr
  }

  return prev; // prev is now the new head
}

// Check if linked list is a palindrome
function isPalindrome(head: ListNode | null): boolean {
  // 1. Find middle
  // 2. Reverse second half
  // 3. Compare both halves
  // 4. Restore list (optional)
  let slow = head, fast = head;
  while (fast?.next && fast.next.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  // slow is now at middle — reverse from here
  let prev = null, curr = slow!.next;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // Compare
  let left = head, right = prev;
  while (right) {
    if (left!.val !== right.val) return false;
    left = left!.next;
    right = right.next;
  }
  return true;
}`,
        tip: '🎯 Interview tip: Draw it out! Linked list problems are 10x easier when you sketch the nodes and arrows. Most bugs come from forgetting to save the next pointer before overwriting it.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the time complexity of accessing the kth element in a singly linked list?',
        options: ['O(1)', 'O(log n)', 'O(k)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'You must traverse from the head, following next pointers one by one. In the worst case (kth element near the end), this is O(k) — or O(n) in big-O terms.',
      },
      {
        id: 2,
        question: 'In Floyd\'s cycle detection, what happens when slow and fast pointers meet?',
        options: ['They\'ve both reached the end (null)', 'A cycle definitely exists in the list', 'The list has exactly n/2 nodes', 'The meeting point is always the cycle start'],
        correctIndex: 1,
        explanation: 'If fast and slow pointers meet, a cycle definitely exists. Fast moves 2 steps, slow moves 1 — in a cycle, fast will eventually catch slow. Note: the meeting point is NOT necessarily the cycle start.',
      },
      {
        id: 3,
        question: 'When reversing a linked list iteratively, why must you save curr.next BEFORE overwriting curr.next?',
        options: ['To remember the previous node', 'To avoid losing your place in the list — you\'d have no way to continue forward', 'To calculate the new head', 'It\'s not required'],
        correctIndex: 1,
        explanation: 'Once you set curr.next = prev, you\'ve lost the reference to the rest of the list! You must save curr.next first: const next = curr.next; curr.next = prev; — then advance using the saved next.',
      },
      {
        id: 4,
        question: 'What is the advantage of using a "dummy head" node when manipulating linked lists?',
        options: ['It makes the list circular', 'It eliminates special cases for the head node, simplifying code', 'It reduces time complexity', 'It\'s required for cycle detection'],
        correctIndex: 1,
        explanation: 'A dummy (sentinel) head node sits before the real head. It means you never have to special-case "am I at the head?" — all nodes including the first real node have a "previous" node (the dummy).',
      },
      {
        id: 5,
        question: 'To find the nth node from the END of a linked list in ONE pass, you should:',
        options: ['Reverse the list first', 'Use two pointers: advance the first n steps ahead, then move both until first reaches end', 'Count total length, then subtract n', 'Use recursion'],
        correctIndex: 1,
        explanation: 'Two-pointer trick: advance pointer A by n steps. Then advance both A and B together. When A reaches null, B is at the nth from the end. One pass, O(1) extra space!',
      },
    ],
  },
  {
    slug: 'sorting',
    title: 'Sorting Algorithms',
    emoji: '🏆',
    tagline: 'The Art of Order',
    description: 'Watch algorithms compete to sort data. Understand Bubble, Merge, and Quick sort through visual step-by-step animations and learn which to use when.',
    color: '#f59e0b',
    gradient: 'from-amber-400 to-orange-500',
    textColor: 'text-amber-600',
    difficulty: 'Intermediate',
    timeToComplete: '35 min',
    keyComplexities: [
      { operation: 'Bubble Sort (worst)', complexity: 'O(n²)' },
      { operation: 'Merge Sort', complexity: 'O(n log n)' },
      { operation: 'Quick Sort (avg)', complexity: 'O(n log n)' },
      { operation: 'Quick Sort (worst)', complexity: 'O(n²)' },
      { operation: 'All comparison sorts', complexity: 'Ω(n log n)' },
    ],
    patterns: [
      { name: 'Divide & Conquer', description: 'Split problem in half, solve recursively, combine results', useCase: 'Merge sort, count inversions, closest pair of points' },
      { name: 'In-Place Partitioning', description: 'Partition array around a pivot without extra space', useCase: 'Quick sort, kth largest element, Dutch national flag' },
      { name: 'Sort + Two Pointers', description: 'Sort first to enable O(n) two-pointer techniques', useCase: '3Sum, 4Sum, closest pair, merge intervals' },
    ],
    story: [
      {
        id: 1,
        emoji: '🫧',
        title: 'The Bubble Sort Games',
        narrative: `The Great Sorting Olympics are underway! 🏟️ Our first competitor: **Bubble Sort**, represented by a friendly but slow bubble.

Bubble sort's strategy: walk through the array repeatedly, comparing adjacent elements. If they're out of order — **swap them**! After each full pass, the largest element "bubbles up" to its correct position at the end.

After n passes, everything is sorted. Simple? Yes. Efficient? Not really.

Picture sorting a row of 10,000 athletes by height. Bubble sort would make up to 50 million comparisons. Meanwhile, the crowd has gone home. 😴`,
        concept: 'Bubble Sort makes n passes. In each pass, compare adjacent elements and swap if needed. After pass k, the k largest elements are in place at the end. Best case O(n) if already sorted (with optimization), worst case O(n²).',
        codeExample: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // swap
        swapped = true;
      }
    }

    // Optimization: if no swap in a pass, array is sorted!
    if (!swapped) break;
  }
  return arr;
}

// Time:  O(n²) worst/avg, O(n) best (already sorted)
// Space: O(1) — in-place`,
        tip: '🎯 Interview tip: Bubble sort is almost never the right answer in interviews. But knowing WHY it\'s O(n²) and how the optimization works shows depth.',
      },
      {
        id: 2,
        emoji: '⚡',
        title: 'Merge Sort — Divide and Conquer',
        narrative: `Next up: **Merge Sort**, the systematic champion! Its philosophy: "I can\'t sort 8 items easily, but I CAN sort 1 item trivially, and I CAN merge two sorted halves efficiently."

Strategy:
1. 🔪 **Divide**: Split array in half (recursively) until you have 1-element arrays
2. ⚔️ **Conquer**: 1-element arrays are trivially sorted
3. 🔗 **Merge**: Merge pairs of sorted arrays into larger sorted arrays

The secret weapon: merging two sorted arrays is O(n)! You just compare the front elements of each half and take the smaller one.

This guarantees O(n log n) always — no bad inputs. That's why JavaScript's Array.prototype.sort() often uses merge sort (or TimSort, its cousin).`,
        concept: 'Merge sort uses O(log n) levels of recursion (halving each time). At each level, you do O(n) total work (merging). Total: O(n log n). Space: O(n) for temporary arrays during merge. STABLE sort — equal elements maintain relative order.',
        codeExample: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr; // base case

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  // Compare fronts of both halves
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  // Append remaining elements
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Time:  O(n log n) — ALWAYS (best, worst, average)
// Space: O(n) — needs extra arrays for merging`,
        tip: '🎯 Interview tip: Use merge sort logic to count inversions (pairs where arr[i] > arr[j] but i < j) — a classic problem that\'s hard without understanding merge sort!',
      },
      {
        id: 3,
        emoji: '⚡',
        title: 'Quick Sort — The Gambler',
        narrative: `Our final competitor: **Quick Sort** — the speed demon with a gambling problem! 🎲

Quick sort picks a **pivot** element, then partitions the array: everything smaller goes left, everything larger goes right. Then it recursively sorts both sides.

The gamble: if you pick a great pivot (near the median), you split the array in half each time → O(n log n). Pick a terrible pivot (always the min or max) → O(n²).

That's why in practice, good implementations use random pivots or the "median of three" trick. On average, quick sort is FASTER than merge sort because it sorts **in-place** (no extra array allocation) and has excellent cache performance.

Most production sort algorithms (like C++ std::sort) are introspective sorts based on quick sort.`,
        concept: 'Quick sort is in-place, O(n log n) average. The partition step puts the pivot in its FINAL position and splits into two sub-problems. Key insight: after partitioning, the pivot never moves again.',
        codeExample: `function quickSort(arr: number[], low = 0, high = arr.length - 1): void {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high]; // use last element as pivot
  let i = low - 1;         // index of smaller element

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // place pivot
  return i + 1; // pivot's final index
}

// Time:  O(n log n) avg, O(n²) worst (sorted input + bad pivot)
// Space: O(log n) — recursion stack`,
        tip: '🎯 Interview tip: "Kth Largest Element" uses Quick Select — same as quick sort but you only recurse into ONE side (the side containing k). Expected O(n) time!',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'Why is O(n log n) the theoretical LOWER BOUND for comparison-based sorting?',
        options: ['Because computers are slow', 'There are n! possible arrangements, and log₂(n!) ≈ n log n comparisons needed to distinguish them', 'Because merge sort uses n log n', 'It\'s actually O(n²) as lower bound'],
        correctIndex: 1,
        explanation: 'Information theory argument: with n elements, there are n! possible orderings. Each comparison gives 1 bit of info, so you need log₂(n!) ≈ n log n comparisons minimum. This is why no comparison sort can beat O(n log n) in the worst case.',
      },
      {
        id: 2,
        question: 'What makes merge sort preferred over quick sort in some cases?',
        options: ['Merge sort is always faster', 'Merge sort is stable and guarantees O(n log n) worst case', 'Merge sort uses less memory', 'Merge sort is simpler to implement'],
        correctIndex: 1,
        explanation: 'Merge sort is STABLE (preserves relative order of equal elements) and always O(n log n). Quick sort can degrade to O(n²) on bad pivots and is NOT stable. When stability matters or worst-case guarantees are needed, use merge sort.',
      },
      {
        id: 3,
        question: 'What is the worst-case input for naive Quick Sort (using last element as pivot)?',
        options: ['A random array', 'An array with all duplicate elements', 'An already sorted (or reverse sorted) array', 'An array with negative numbers'],
        correctIndex: 2,
        explanation: 'With an already-sorted array and last-element pivot, every partition picks the maximum as pivot, creating partitions of size (n-1) and 0. This leads to O(n) recursive calls each doing O(n) work = O(n²).',
      },
      {
        id: 4,
        question: 'If you need to sort 1 million records by timestamp where records with the same timestamp must maintain insertion order, which sort should you use?',
        options: ['Quick Sort — fastest in practice', 'Bubble Sort — simplest', 'Merge Sort — it\'s stable', 'Any sort works, order doesn\'t matter for equal elements'],
        correctIndex: 2,
        explanation: '"Must maintain insertion order for equal elements" = you need a STABLE sort. Merge sort is stable. Quick sort in its standard form is not. This is a very common interview question disguised as a practical problem.',
      },
      {
        id: 5,
        question: 'Quick Select finds the kth smallest element in expected O(?) time:',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
        correctIndex: 2,
        explanation: 'Quick Select only recurses into ONE partition (the one containing the kth element). Expected partitions: n + n/2 + n/4 + ... = 2n = O(n). This is why it\'s the go-to for "Kth largest element" problems.',
      },
    ],
  },
  {
    slug: 'trees',
    title: 'Trees & BST',
    emoji: '🌳',
    tagline: 'Hierarchy Unlocked',
    description: 'Conquer the most common interview data structure. Master tree traversals, BST operations, and the elegant patterns that solve dozens of LeetCode problems.',
    color: '#10b981',
    gradient: 'from-emerald-400 to-teal-500',
    textColor: 'text-emerald-600',
    difficulty: 'Advanced',
    timeToComplete: '40 min',
    keyComplexities: [
      { operation: 'BST Search (balanced)', complexity: 'O(log n)' },
      { operation: 'BST Search (unbalanced)', complexity: 'O(n)' },
      { operation: 'Insert / Delete', complexity: 'O(log n) balanced' },
      { operation: 'DFS Traversal', complexity: 'O(n)' },
      { operation: 'BFS (Level Order)', complexity: 'O(n)' },
    ],
    patterns: [
      { name: 'DFS (Recursive)', description: 'Recursively process left subtree, root, right subtree in some order', useCase: 'Validate BST, max depth, path sum, lowest common ancestor' },
      { name: 'BFS (Queue)', description: 'Process nodes level by level using a queue', useCase: 'Level order traversal, minimum depth, right side view' },
      { name: 'BST Property', description: 'Left subtree < root < right subtree at every node', useCase: 'Inorder gives sorted order, validate BST, kth smallest' },
    ],
    story: [
      {
        id: 1,
        emoji: '👑',
        title: 'The Royal Family Tree',
        narrative: `The Kingdom of Algorithmia has a Royal Family Tree, and the royal archivist needs your help organizing it! 👑

Each **noble** (node) has:
- A **name** (data/value)
- At most **two children** (left and right) — it's a binary tree!
- Exactly **one parent** (except the King/Queen at the **root**)

The tree follows the **Royal Succession Law** (BST property):
- All nobles in the LEFT branch have **smaller** names (come earlier alphabetically)
- All nobles in the RIGHT branch have **larger** names

This means if you need to find someone: go left if they come before the current noble, right if they come after. Each step eliminates HALF the tree! O(log n) search.`,
        concept: 'Binary Search Tree (BST): each node has at most 2 children. BST property: left subtree values < node value < right subtree values. This gives O(log n) search/insert/delete for BALANCED trees. Inorder traversal of BST gives elements in SORTED order.',
        codeExample: `class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

// BST Search — O(log n) balanced, O(n) unbalanced
function search(root: TreeNode | null, target: number): boolean {
  if (!root) return false;
  if (root.val === target) return true;
  if (target < root.val) return search(root.left, target);
  return search(root.right, target);
}

// BST Insert
function insert(root: TreeNode | null, val: number): TreeNode {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;
}`,
        tip: '🎯 Interview tip: "Inorder traversal of BST gives sorted order" unlocks dozens of problems: kth smallest, validate BST, find closest value.',
      },
      {
        id: 2,
        emoji: '🗺️',
        title: 'The Three Exploration Spells',
        narrative: `The royal archivist knows three ancient spells to explore the entire family tree. All three visit every noble exactly once — O(n) — but in different orders:

🟣 **Pre-order** (Root → Left → Right): Meet the noble FIRST, then explore their left branch, then right. Used to COPY or SERIALIZE a tree.

🟡 **In-order** (Left → Root → Right): Explore left branch, meet the noble, then right. For BST, this visits nobles in SORTED order!

🔴 **Post-order** (Left → Right → Root): Explore both branches FIRST, then meet the noble. Used to CALCULATE or DELETE a tree (children before parents).

🔵 **Level-order (BFS)**: Meet all nobles on level 1, then level 2, then level 3... Uses a QUEUE.`,
        concept: 'Tree traversals are the foundation of 70% of tree interview problems. DFS uses the call stack (implicit O(h) space where h = height). BFS uses an explicit queue (O(w) space where w = max width). For DFS: think "when should I process the current node?"',
        codeExample: `// Pre-order: Root → Left → Right
function preorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
}

// In-order: Left → Root → Right (BST → sorted!)
function inorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

// Post-order: Left → Right → Root
function postorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...postorder(root.left), ...postorder(root.right), root.val];
}

// Level-order BFS
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
        tip: '🎯 Interview tip: "Maximum depth", "path sum", "diameter" → DFS (post-order, compute from leaves up). "Minimum depth", "right side view", "zigzag" → BFS.',
      },
      {
        id: 3,
        emoji: '🧙',
        title: 'The Master Pattern: DFS Template',
        narrative: `After studying hundreds of tree problems, the royal wizard discovered that most can be solved with ONE powerful template:

**The DFS Pattern**: Every tree problem is a question you answer recursively. The key is deciding: what information does each node need to RECEIVE from the parent, and what does it RETURN to the parent?

Classic patterns:
- **Max Depth**: return 1 + max(left_depth, right_depth)
- **Validate BST**: pass min/max bounds down, return is_valid up
- **Path Sum**: subtract val from target, check if leaf with target=0
- **Lowest Common Ancestor**: if found both nodes, current node is LCA

Once you see this pattern, tree problems transform from "impossible" to "straightforward".`,
        concept: 'The DFS template: define what the recursive function returns. At each node: 1) Get results from left child, 2) Get results from right child, 3) Combine with current node\'s value, 4) Return combined result. Edge case: always handle null root first.',
        codeExample: `// Template: Maximum path sum (hard LeetCode problem)
let maxSum = -Infinity;

function maxPathSum(root: TreeNode | null): number {
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;

    // Get max contribution from each child (ignore if negative)
    const left = Math.max(0, dfs(node.left));
    const right = Math.max(0, dfs(node.right));

    // Update global max (path through current node)
    maxSum = Math.max(maxSum, node.val + left + right);

    // Return max contribution to PARENT (can only go one direction)
    return node.val + Math.max(left, right);
  }
  dfs(root);
  return maxSum;
}

// Validate BST: pass bounds down
function isValidBST(
  root: TreeNode | null,
  min = -Infinity,
  max = Infinity
): boolean {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
}`,
        tip: '🎯 Interview tip: For "Lowest Common Ancestor" — if you find p in left subtree and q in right subtree, current node IS the LCA. This recursive insight solves it elegantly in O(n).',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What does in-order traversal of a Binary SEARCH Tree (BST) produce?',
        options: ['A random ordering', 'Elements in reverse sorted order', 'Elements in sorted (ascending) order', 'Elements by level'],
        correctIndex: 2,
        explanation: 'In-order traversal visits Left → Root → Right. In a BST, left subtree < root < right subtree. So in-order visits nodes in ascending order. This is used to get the kth smallest element, validate BST, etc.',
      },
      {
        id: 2,
        question: 'What is the space complexity of DFS on a tree with height h?',
        options: ['O(1)', 'O(log n)', 'O(h) — due to the recursive call stack', 'O(n)'],
        correctIndex: 2,
        explanation: 'DFS uses the call stack, which grows to h frames deep (where h = tree height). For a balanced tree, h = O(log n). For a degenerate (linked list) tree, h = O(n). So O(h) is the precise answer.',
      },
      {
        id: 3,
        question: 'Which traversal would you use to SERIALIZE a tree so you can reconstruct it exactly?',
        options: ['In-order only (not sufficient to reconstruct)', 'Pre-order (root first, then subtrees)', 'Post-order', 'BFS level-order'],
        correctIndex: 1,
        explanation: 'Pre-order (root, left, right) combined with null markers is sufficient to reconstruct a tree. In-order alone is NOT sufficient. Both pre+in or post+in together work, but pre-order with nulls (like LeetCode serialization) is most common.',
      },
      {
        id: 4,
        question: 'When finding the Lowest Common Ancestor (LCA) of nodes p and q in a BST, the elegant solution is:',
        options: ['BFS from both p and q simultaneously', 'If p and q are both less than root, go left. Both greater, go right. Otherwise, root IS the LCA', 'Store all ancestors of p, then find first match with q\'s ancestors', 'Reverse in-order traversal'],
        correctIndex: 1,
        explanation: 'In a BST, the LCA is where p and q "diverge." If both are less than root, LCA must be in left subtree. If both greater, in right subtree. When one is on each side (or equals root), the current node IS the LCA. O(h) time, O(1) extra space!',
      },
      {
        id: 5,
        question: 'A "balanced" BST guarantees O(log n) operations. What makes a BST unbalanced, degrading to O(n)?',
        options: ['Having too many nodes', 'Inserting elements in sorted order (making it a linked list)', 'Having duplicate values', 'Using iterative instead of recursive approach'],
        correctIndex: 1,
        explanation: 'Inserting 1,2,3,4,5 into a BST creates a right-only chain (each node is larger, goes right). This is O(n) height — as bad as a linked list. This is why self-balancing trees (AVL, Red-Black) exist — they rebalance after each insert.',
      },
    ],
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find(t => t.slug === slug);
}
