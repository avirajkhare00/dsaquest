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

export interface LeetcodeProblem {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
}

export interface Pattern {
  name: string;
  description: string;
  useCase: string;
  problems?: LeetcodeProblem[];
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
      { name: 'Two Pointers', description: 'Use left/right pointers moving toward each other', useCase: 'Pair sum, palindrome check, container with most water', problems: [
        { title: 'Two Sum II', difficulty: 'Medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
        { title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
        { title: 'Container With Most Water', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
      ]},
      { name: 'Sliding Window', description: 'Move a fixed or variable window across the array', useCase: 'Max subarray sum, longest substring without repeating chars', problems: [
        { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
        { title: 'Minimum Window Substring', difficulty: 'Hard', url: 'https://leetcode.com/problems/minimum-window-substring/' },
        { title: 'Maximum Average Subarray I', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
      ]},
      { name: 'Prefix Sum', description: 'Pre-compute cumulative sums for O(1) range queries', useCase: 'Subarray sum equals k, range sum queries', problems: [
        { title: 'Subarray Sum Equals K', difficulty: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
        { title: 'Range Sum Query - Immutable', difficulty: 'Easy', url: 'https://leetcode.com/problems/range-sum-query-immutable/' },
        { title: 'Product of Array Except Self', difficulty: 'Medium', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
      ]},
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
      { name: 'Fast & Slow Pointers', description: 'Two pointers at different speeds to detect cycles or find midpoints', useCase: 'Cycle detection, find middle, nth from end', problems: [
        { title: 'Linked List Cycle', difficulty: 'Easy', url: 'https://leetcode.com/problems/linked-list-cycle/' },
        { title: 'Middle of the Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
        { title: 'Happy Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/happy-number/' },
      ]},
      { name: 'Reverse a List', description: 'Iteratively reassign next pointers using prev/curr/next', useCase: 'Palindrome LL, reverse k-groups, reorder list', problems: [
        { title: 'Reverse Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
        { title: 'Palindrome Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/palindrome-linked-list/' },
        { title: 'Reverse Nodes in k-Group', difficulty: 'Hard', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      ]},
      { name: 'Dummy Head Node', description: 'Use a fake head node to simplify edge cases', useCase: 'Merge sorted lists, delete specific nodes', problems: [
        { title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
        { title: 'Remove Nth Node From End of List', difficulty: 'Medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
        { title: 'Add Two Numbers', difficulty: 'Medium', url: 'https://leetcode.com/problems/add-two-numbers/' },
      ]},
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
      { name: 'Divide & Conquer', description: 'Split problem in half, solve recursively, combine results', useCase: 'Merge sort, count inversions, closest pair of points', problems: [
        { title: 'Sort an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/sort-an-array/' },
        { title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' },
        { title: 'Merge Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-sorted-array/' },
      ]},
      { name: 'In-Place Partitioning', description: 'Partition array around a pivot without extra space', useCase: 'Quick sort, kth largest element, Dutch national flag', problems: [
        { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
        { title: 'Sort Colors', difficulty: 'Medium', url: 'https://leetcode.com/problems/sort-colors/' },
        { title: 'Wiggle Sort II', difficulty: 'Medium', url: 'https://leetcode.com/problems/wiggle-sort-ii/' },
      ]},
      { name: 'Sort + Two Pointers', description: 'Sort first to enable O(n) two-pointer techniques', useCase: '3Sum, 4Sum, closest pair, merge intervals', problems: [
        { title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
        { title: 'Merge Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/' },
        { title: '4Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/4sum/' },
      ]},
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
      { name: 'DFS (Recursive)', description: 'Recursively process left subtree, root, right subtree in some order', useCase: 'Validate BST, max depth, path sum, lowest common ancestor', problems: [
        { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
        { title: 'Path Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/path-sum/' },
        { title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      ]},
      { name: 'BFS (Queue)', description: 'Process nodes level by level using a queue', useCase: 'Level order traversal, minimum depth, right side view', problems: [
        { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
        { title: 'Minimum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/' },
        { title: 'Binary Tree Right Side View', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
      ]},
      { name: 'BST Property', description: 'Left subtree < root < right subtree at every node', useCase: 'Inorder gives sorted order, validate BST, kth smallest', problems: [
        { title: 'Validate Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
        { title: 'Kth Smallest Element in a BST', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
        { title: 'Convert Sorted Array to BST', difficulty: 'Easy', url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/' },
      ]},
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
  // ─── Hash Tables ───────────────────────────────────────────────────────────
  {
    slug: 'hash-tables',
    title: 'Hash Tables',
    emoji: '🗂️',
    tagline: 'O(1) Lookup Magic',
    description: 'Unlock the secret weapon behind 60% of array/string problems. Master the HashMap pattern, frequency counting, and two-sum style tricks that interviewers love.',
    color: '#8b5cf6',
    gradient: 'from-violet-400 to-purple-600',
    textColor: 'text-violet-600',
    difficulty: 'Beginner',
    timeToComplete: '25 min',
    keyComplexities: [
      { operation: 'Insert (avg)', complexity: 'O(1)' },
      { operation: 'Lookup (avg)', complexity: 'O(1)' },
      { operation: 'Delete (avg)', complexity: 'O(1)' },
      { operation: 'Insert (worst)', complexity: 'O(n)' },
      { operation: 'Space', complexity: 'O(n)' },
    ],
    patterns: [
      { name: 'Frequency Count', description: 'Count occurrences of each element in a single pass', useCase: 'Anagram check, most frequent element, first unique char', problems: [
        { title: 'Valid Anagram', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/' },
        { title: 'Top K Frequent Elements', difficulty: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
        { title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/' },
      ]},
      { name: 'Two-Sum Pattern', description: 'Store complement (target - x) in map, look up on each step', useCase: 'Two sum, three sum, subarray sum equals k', problems: [
        { title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
        { title: 'Subarray Sum Equals K', difficulty: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
        { title: 'Longest Consecutive Sequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      ]},
      { name: 'Seen / Visited Set', description: 'Use a Set to check membership in O(1) instead of O(n)', useCase: 'Duplicate detection, cycle detection, contains duplicate', problems: [
        { title: 'Contains Duplicate', difficulty: 'Easy', url: 'https://leetcode.com/problems/contains-duplicate/' },
        { title: 'Happy Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/happy-number/' },
        { title: 'Intersection of Two Arrays', difficulty: 'Easy', url: 'https://leetcode.com/problems/intersection-of-two-arrays/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🏨',
        title: 'The Magic Hotel',
        narrative: `Welcome to the **Magic Hotel** — a hotel so efficient it can find any guest's room in an instant, no matter how many guests there are.

The secret? A **magic concierge** who transforms each guest's name into a room number. Tell her "Alice" and she instantly computes room 42. Tell her "Bob" → room 7. This transformation is a **hash function**.

The hotel (hash table) is an array of rooms. The hash function maps any key to an index. To find a guest? Just run their name through the hash function → go directly to that room. O(1). No searching floors. No checking every room.

This is a **HashMap**: a data structure that maps **keys to values** using a hash function for instant lookup.`,
        concept: 'A hash table maps keys to values via a hash function that converts a key to an array index. Average case: O(1) insert, lookup, delete. JavaScript\'s Map and Object, Python\'s dict, Java\'s HashMap — all hash tables under the hood.',
        codeExample: `// HashMap basics in JavaScript/TypeScript
const map = new Map<string, number>();

// Insert — O(1) avg
map.set("Alice", 42);
map.set("Bob", 7);

// Lookup — O(1) avg
map.get("Alice"); // 42
map.has("Charlie"); // false

// Delete — O(1) avg
map.delete("Bob");

// Iterate
for (const [key, val] of map) {
  console.log(key, val);
}

// Object as hash map (simpler, string keys only)
const freq: Record<string, number> = {};
freq["a"] = (freq["a"] ?? 0) + 1;`,
        tip: '🎯 Interview tip: When you see O(n²) nested loops looking for a match, think "can I store what I\'ve seen in a HashMap and look it up in O(1)?" — this converts most O(n²) solutions to O(n).',
      },
      {
        id: 2,
        emoji: '🔢',
        title: 'The Frequency Counter',
        narrative: `A detective needs to know: **are these two words anagrams?** ("listen" and "silent", for example.)

Brute force: sort both, compare. O(n log n).

The HashMap way: **count the frequency** of each letter in word 1. Then subtract for each letter in word 2. If all counts hit zero — it's an anagram! O(n).

This **frequency counting** pattern is everywhere:
- Is this a valid anagram?
- What's the most frequent character?
- First non-repeating character?
- Group anagrams together?

All solved with one pass to build a frequency map, one pass to use it.`,
        concept: 'Frequency counting: one pass to build Map<element, count>, one pass to query it. Total O(n) time, O(k) space where k = number of distinct elements. For fixed alphabet (26 letters), space is O(1).',
        codeExample: `// Valid Anagram — O(n)
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const freq = new Map<string, number>();

  // Count up for s
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);

  // Count down for t
  for (const ch of t) {
    if (!freq.has(ch)) return false;
    freq.set(ch, freq.get(ch)! - 1);
    if (freq.get(ch) === 0) freq.delete(ch);
  }

  return freq.size === 0;
}

// First unique character — O(n)
function firstUniqueChar(s: string): number {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) return i;
  }
  return -1;
}`,
        tip: '🎯 Interview tip: "Group Anagrams" — the key insight is that all anagrams have the SAME sorted string. Map from sorted → list of words. One pass: O(n × k log k) where k = word length.',
      },
      {
        id: 3,
        emoji: '🎯',
        title: 'The Two-Sum Trick',
        narrative: `The most famous interview problem of all time: given an array and a target, find two numbers that sum to the target.

Brute force: try every pair → O(n²). With a HashMap: O(n).

The trick: as you walk through the array, **store what you need** (target − current) in the map. For each new element, check if YOU are what some previous element needed.

"I need 7. You are 7. We found each other." 💘

This "store complement, look up on arrival" pattern extends to:
- Three Sum (sort + two pointers + fix one)
- Subarray Sum Equals K (prefix sum + HashMap)
- Longest Consecutive Sequence (Set membership)`,
        concept: 'Two-Sum with HashMap: for each element x, check if (target-x) is in the map. If yes, found! If no, store x in the map. Single pass = O(n) time, O(n) space. Trade space for time — the classic interview trade-off.',
        codeExample: `// Two Sum — O(n) time, O(n) space
function twoSum(nums: number[], target: number): [number, number] {
  const seen = new Map<number, number>(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [-1, -1]; // no solution
}

// Subarray Sum Equals K — prefix sum + HashMap
function subarraySum(nums: number[], k: number): number {
  const prefixCount = new Map<number, number>([[0, 1]]);
  let sum = 0, count = 0;

  for (const num of nums) {
    sum += num;
    // If (sum - k) was seen before, those subarrays sum to k
    count += prefixCount.get(sum - k) ?? 0;
    prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1);
  }
  return count;
}`,
        tip: '🎯 Interview tip: Two Sum on a SORTED array → use two pointers (O(1) space). Two Sum on UNSORTED → HashMap (O(n) space). Know which to use and WHY — interviewers listen for this nuance.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the average-case time complexity of looking up a key in a HashMap?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Hash tables compute the array index from the key directly via the hash function, so lookup is O(1) average. Worst case (all keys collide) is O(n), but good hash functions make this extremely rare.',
      },
      {
        id: 2,
        question: 'What is a "hash collision" and how is it typically handled?',
        options: ['When two keys map to the same index — handled by chaining (linked list at that bucket) or open addressing', 'When the hash table runs out of memory', 'When a key is not found in the table', 'When the hash function returns a negative number'],
        correctIndex: 0,
        explanation: 'A collision occurs when two different keys produce the same hash index. Chaining puts multiple items in a linked list at that bucket. Open addressing probes for the next empty slot. JavaScript\'s Map handles this internally.',
      },
      {
        id: 3,
        question: 'For the Two Sum problem on an UNSORTED array (find indices of two numbers summing to target), the optimal approach is:',
        options: ['Sort then two pointers — O(n log n)', 'HashMap — store complement, O(n)', 'Nested loops — O(n²)', 'Binary search — O(log n)'],
        correctIndex: 1,
        explanation: 'HashMap gives O(n) time and O(n) space. Sorting would lose original indices (you need indices, not just values). Two pointers on sorted array gives values but not original indices without extra bookkeeping.',
      },
      {
        id: 4,
        question: 'To check if an array contains any duplicates in O(n) time and O(n) space, you would:',
        options: ['Sort and check adjacent elements', 'Use nested loops to compare all pairs', 'Insert each element into a Set; if insertion fails (already present), duplicate found', 'Use a binary search tree'],
        correctIndex: 2,
        explanation: 'A Set provides O(1) average membership check. Walk the array: if element is in the set → duplicate! Otherwise add it. One pass = O(n). The Set uses O(n) extra space.',
      },
      {
        id: 5,
        question: 'The "Subarray Sum Equals K" problem is solved with:',
        options: ['Sliding window', 'Prefix sum + HashMap', 'Two pointers', 'Dynamic programming'],
        correctIndex: 1,
        explanation: 'Sliding window only works for non-negative numbers. This problem can have negative numbers. Prefix sum approach: for each index i, if (prefix[i] - k) was seen before, there\'s a subarray ending at i with sum k. HashMap stores prefix sum frequencies in O(1) lookup.',
      },
    ],
  },

  // ─── Graphs ────────────────────────────────────────────────────────────────
  {
    slug: 'graphs',
    title: 'Graphs & BFS/DFS',
    emoji: '🕸️',
    tagline: 'Connect the Dots',
    description: 'The most powerful and flexible data structure. Master BFS for shortest paths, DFS for cycle detection, and the patterns behind network, social, and map problems.',
    color: '#06b6d4',
    gradient: 'from-cyan-400 to-sky-600',
    textColor: 'text-cyan-600',
    difficulty: 'Advanced',
    timeToComplete: '45 min',
    keyComplexities: [
      { operation: 'BFS / DFS', complexity: 'O(V + E)' },
      { operation: 'Add edge', complexity: 'O(1)' },
      { operation: 'Check edge (adj list)', complexity: 'O(degree)' },
      { operation: 'Space (adj list)', complexity: 'O(V + E)' },
      { operation: 'Space (matrix)', complexity: 'O(V²)' },
    ],
    patterns: [
      { name: 'BFS (Shortest Path)', description: 'Use a queue to explore level by level — guarantees shortest path in unweighted graphs', useCase: 'Shortest path, word ladder, 0-1 matrix, rotting oranges', problems: [
        { title: 'Word Ladder', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-ladder/' },
        { title: 'Rotting Oranges', difficulty: 'Medium', url: 'https://leetcode.com/problems/rotting-oranges/' },
        { title: 'Shortest Path in Binary Matrix', difficulty: 'Medium', url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/' },
      ]},
      { name: 'DFS (Explore all)', description: 'Use recursion/stack to go deep before backtracking — finds all paths and components', useCase: 'Number of islands, cycle detection, topological sort, clone graph', problems: [
        { title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
        { title: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
        { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      ]},
      { name: 'Union-Find', description: 'Efficiently track connected components with path compression and union by rank', useCase: 'Number of connected components, redundant connection, accounts merge', problems: [
        { title: 'Number of Connected Components', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
        { title: 'Redundant Connection', difficulty: 'Medium', url: 'https://leetcode.com/problems/redundant-connection/' },
        { title: 'Accounts Merge', difficulty: 'Medium', url: 'https://leetcode.com/problems/accounts-merge/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🗺️',
        title: 'The City of Nodes',
        narrative: `Imagine a city where **places** (nodes/vertices) are connected by **roads** (edges). Some roads are one-way (directed), some go both ways (undirected).

This city IS a graph. Your social network is a graph (you ↔ friends). The internet is a graph (pages linked together). Google Maps is a graph (intersections and roads).

A graph has:
- **Vertices (V)**: the nodes — cities, people, web pages
- **Edges (E)**: the connections — roads, friendships, links
- **Weighted edges**: roads with distances/costs
- **Directed edges**: one-way streets

We represent graphs two ways:
- **Adjacency List**: each node stores its neighbors (space efficient for sparse graphs)
- **Adjacency Matrix**: a V×V grid where matrix[i][j]=1 means edge exists (good for dense graphs)`,
        concept: 'Adjacency list is preferred for most interview problems: O(V+E) space vs O(V²) for matrix. BFS and DFS both run in O(V+E) time — you visit each vertex once and traverse each edge once.',
        codeExample: `// Building a graph with adjacency list
const graph = new Map<number, number[]>();

function addEdge(u: number, v: number, directed = false) {
  if (!graph.has(u)) graph.set(u, []);
  if (!graph.has(v)) graph.set(v, []);
  graph.get(u)!.push(v);
  if (!directed) graph.get(v)!.push(u);
}

addEdge(0, 1); addEdge(0, 2); addEdge(1, 3);
addEdge(2, 3); addEdge(3, 4);

// Graph: 0—1—3—4
//        |   |
//        2———

// For grid problems (very common!), the graph is implicit:
// neighbors of (r, c) = [(r-1,c),(r+1,c),(r,c-1),(r,c+1)]
const directions = [[-1,0],[1,0],[0,-1],[0,1]];`,
        tip: '🎯 Interview tip: Most graph problems in interviews use grids (2D arrays)! You don\'t need to build an explicit graph — the grid IS the graph, with implicit edges to 4 neighbors.',
      },
      {
        id: 2,
        emoji: '🌊',
        title: 'BFS — The Ripple Effect',
        narrative: `Drop a stone in a pond. Ripples spread **level by level** — first the immediate ring, then the next, then the next. This is **Breadth-First Search (BFS)**.

BFS uses a **queue** (FIFO). Start at the source, enqueue it. Then:
1. Dequeue a node
2. Process it
3. Enqueue all unvisited neighbors
4. Repeat until queue is empty

Why BFS = shortest path? Because you explore all nodes at distance 1 BEFORE any at distance 2. So the FIRST time you reach a node, it's via the shortest path.

Use cases: shortest path in unweighted graph, "minimum steps", "minimum operations", anything that asks for the **nearest** something.`,
        concept: 'BFS guarantees shortest path in unweighted graphs because it explores layer by layer. Time: O(V+E). Space: O(V) for the queue. Key: track visited nodes to avoid revisiting (prevent infinite loops in cyclic graphs).',
        codeExample: `// BFS — shortest path from source to target
function bfs(graph: Map<number, number[]>, start: number, end: number): number {
  const visited = new Set<number>([start]);
  const queue: [number, number][] = [[start, 0]]; // [node, distance]

  while (queue.length > 0) {
    const [node, dist] = queue.shift()!;
    if (node === end) return dist;

    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1; // unreachable
}

// Grid BFS — Number of steps to reach destination
function minSteps(grid: number[][], start: [number,number], end: [number,number]): number {
  const [rows, cols] = [grid.length, grid[0].length];
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const visited = new Set<string>([start.toString()]);
  const queue: [[number,number], number][] = [[start, 0]];

  while (queue.length) {
    const [[r, c], steps] = queue.shift()!;
    if (r === end[0] && c === end[1]) return steps;
    for (const [dr, dc] of dirs) {
      const [nr, nc] = [r + dr, c + dc];
      const key = \`\${nr},\${nc}\`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(key) && grid[nr][nc] === 0) {
        visited.add(key); queue.push([[nr, nc], steps + 1]);
      }
    }
  }
  return -1;
}`,
        tip: '🎯 Interview tip: BFS is your first thought for ANY "minimum/shortest" question on graphs or grids. If the problem says "minimum number of X", think BFS.',
      },
      {
        id: 3,
        emoji: '🕳️',
        title: 'DFS — Go Deep, Then Back',
        narrative: `While BFS spreads wide, **DFS dives deep**. It picks a path and follows it all the way to the end before backtracking. Like exploring a maze by always turning left until you hit a dead end.

DFS uses a **stack** (or recursion's call stack). It's the natural fit for:
- **Counting connected components** (islands in a grid)
- **Cycle detection** (back edge in DFS tree = cycle)
- **Topological sort** (order tasks with dependencies)
- **All paths** from source to destination

The classic: **Number of Islands**. Each '1' cell is land. Count groups of connected land. DFS from each unvisited '1', mark all connected cells as visited — that's one island. Repeat.`,
        concept: 'DFS visits nodes as deep as possible first. Recursion uses the call stack implicitly (O(h) space where h = depth). For iterative DFS, use an explicit stack. Key for grids: mark cells visited BEFORE adding to stack to avoid duplicates.',
        codeExample: `// Number of Islands — classic DFS on grid
function numIslands(grid: string[][]): number {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  function dfs(r: number, c: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] !== '1') return;
    grid[r][c] = '0'; // mark visited (sink the island)
    dfs(r + 1, c); dfs(r - 1, c);
    dfs(r, c + 1); dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { dfs(r, c); count++; }
    }
  }
  return count;
}

// Detect cycle in directed graph — DFS with 3 states
// 0: unvisited, 1: in current path, 2: fully processed
function hasCycle(numNodes: number, adj: number[][]): boolean {
  const state = new Array(numNodes).fill(0);

  function dfs(node: number): boolean {
    state[node] = 1; // in progress
    for (const neighbor of adj[node]) {
      if (state[neighbor] === 1) return true;  // back edge = cycle!
      if (state[neighbor] === 0 && dfs(neighbor)) return true;
    }
    state[node] = 2; // done
    return false;
  }

  for (let i = 0; i < numNodes; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`,
        tip: '🎯 Interview tip: For "Number of Islands" and variants — if modifying input is allowed, "sinking" visited land (1→0) saves space vs a separate visited set. Always ask the interviewer if input can be modified!',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'Why does BFS guarantee the shortest path in an unweighted graph?',
        options: ['Because it uses a queue which is faster than a stack', 'Because it explores all nodes at distance k before any at distance k+1', 'Because it visits fewer nodes than DFS', 'It doesn\'t — DFS also guarantees shortest paths'],
        correctIndex: 1,
        explanation: 'BFS explores layer by layer (all nodes at distance 1, then distance 2, etc.). So the FIRST time it reaches a destination, it\'s via the fewest edges. For weighted graphs, you\'d need Dijkstra\'s algorithm instead.',
      },
      {
        id: 2,
        question: 'In the "Number of Islands" problem, when you run DFS from a land cell, you:',
        options: ['Count each cell as a separate island', 'Mark all connected land cells as visited, then count +1 island', 'Use BFS to find the island\'s border', 'Return the area of each island'],
        correctIndex: 1,
        explanation: 'Each DFS call from an unvisited \'1\' explores the entire island (all connected land cells), marking them visited (or \'0\'). When DFS returns, you increment island count by 1. The outer loop counts how many times DFS is initiated = number of islands.',
      },
      {
        id: 3,
        question: 'Which graph representation is most space-efficient for sparse graphs (few edges)?',
        options: ['Adjacency matrix — O(V²)', 'Adjacency list — O(V + E)', 'Edge list — but doesn\'t support fast neighbor lookup', 'Both are equal'],
        correctIndex: 1,
        explanation: 'Adjacency matrix always uses O(V²) space. For sparse graphs (E << V²), adjacency list uses O(V+E) which is much less. Most real-world graphs (social networks, road networks) are sparse.',
      },
      {
        id: 4,
        question: 'How do you detect a cycle in a DIRECTED graph using DFS?',
        options: ['If you visit the same node twice in any DFS call', 'If BFS and DFS produce different orderings', 'If you encounter a node that is currently IN the recursion stack (back edge)', 'If the graph has more edges than vertices'],
        correctIndex: 2,
        explanation: 'Track 3 states: unvisited, in-progress (on current recursion stack), completed. A cycle exists if DFS encounters an in-progress node — this is a "back edge" pointing to an ancestor. For undirected graphs, a repeated node that isn\'t the direct parent = cycle.',
      },
      {
        id: 5,
        question: 'Topological sort is only possible on graphs that are:',
        options: ['Connected and undirected', 'Directed and Acyclic (DAGs)', 'Complete graphs', 'Bipartite graphs'],
        correctIndex: 1,
        explanation: 'Topological sort orders vertices so every directed edge u→v has u before v. This is only meaningful for Directed Acyclic Graphs (DAGs). If there\'s a cycle, no such ordering exists (nothing can come "before" itself). Used for: task scheduling, build systems, course prerequisites.',
      },
    ],
  },

  // ─── Dynamic Programming ───────────────────────────────────────────────────
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    emoji: '🧩',
    tagline: 'Remember to Win',
    description: 'The boss level of coding interviews. Learn to identify overlapping subproblems, build memoization and tabulation solutions, and tackle classic DP patterns with confidence.',
    color: '#f43f5e',
    gradient: 'from-rose-400 to-red-600',
    textColor: 'text-rose-600',
    difficulty: 'Advanced',
    timeToComplete: '50 min',
    keyComplexities: [
      { operation: 'Fibonacci (naive)', complexity: 'O(2ⁿ)' },
      { operation: 'Fibonacci (DP)', complexity: 'O(n)' },
      { operation: 'Coin Change', complexity: 'O(n × amount)' },
      { operation: 'Longest Common Subseq.', complexity: 'O(m × n)' },
      { operation: 'DP space (typical)', complexity: 'O(n) or O(n²)' },
    ],
    patterns: [
      { name: 'Memoization (Top-Down)', description: 'Recursive solution + cache results to avoid recomputation', useCase: 'Natural recursive problems: Fibonacci, coin change, word break', problems: [
        { title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
        { title: 'Word Break', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-break/' },
        { title: 'Decode Ways', difficulty: 'Medium', url: 'https://leetcode.com/problems/decode-ways/' },
      ]},
      { name: 'Tabulation (Bottom-Up)', description: 'Fill a DP table iteratively from base cases up to the answer', useCase: 'Climbing stairs, knapsack, longest common subsequence', problems: [
        { title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
        { title: 'Longest Common Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
        { title: 'Edit Distance', difficulty: 'Medium', url: 'https://leetcode.com/problems/edit-distance/' },
      ]},
      { name: 'Space Optimization', description: 'Reduce 2D DP to 1D or O(1) when you only need the previous row', useCase: 'Fibonacci to O(1), 2D DP to O(n) rolling array', problems: [
        { title: 'House Robber', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber/' },
        { title: 'Jump Game', difficulty: 'Medium', url: 'https://leetcode.com/problems/jump-game/' },
        { title: 'Unique Paths', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-paths/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🌀',
        title: 'The Forgetful Robot',
        narrative: `A robot needs to compute the **100th Fibonacci number**. It starts recursively: fib(100) = fib(99) + fib(98). Then fib(99) = fib(98) + fib(97). And fib(98) = fib(97) + fib(96)...

The robot computes **fib(97) dozens of times** — it keeps forgetting what it already calculated! With pure recursion, fib(n) makes **2ⁿ calls**. fib(50) would take over a quadrillion operations. Useless.

The fix: **remember**. Every time the robot computes fib(k), it writes the answer in a notebook. Next time it needs fib(k), it just reads the notebook instead of recalculating.

This "compute once, cache forever" trick is called **memoization**, and it's the heart of Dynamic Programming.`,
        concept: 'Dynamic Programming: break a problem into overlapping subproblems, solve each ONCE, store the result. Two approaches: (1) Top-down memoization = recursion + cache. (2) Bottom-up tabulation = fill a table iteratively. Both reduce exponential to polynomial time.',
        codeExample: `// Fibonacci — naive O(2ⁿ) vs DP O(n)

// ❌ Naive recursion — recomputes everything
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2); // SLOW!
}

// ✅ Memoization (top-down) — O(n) time, O(n) space
function fibMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!; // cache hit!
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result); // store before returning
  return result;
}

// ✅ Tabulation (bottom-up) — O(n) time, O(1) space
function fibDP(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
        tip: '🎯 Interview tip: DP problems have TWO key properties: (1) Overlapping subproblems — same subproblem computed multiple times. (2) Optimal substructure — optimal solution built from optimal sub-solutions. Spot these → think DP.',
      },
      {
        id: 2,
        emoji: '🏗️',
        title: 'Building the DP Table',
        narrative: `The **Climbing Stairs** problem: you can climb 1 or 2 stairs at a time. How many distinct ways to reach stair n?

Instead of recursing from the top, let's **build up from the bottom**:
- 0 stairs: 1 way (do nothing)
- 1 stair: 1 way (jump 1)
- 2 stairs: 2 ways (1+1 or jump 2)
- 3 stairs: dp[1] + dp[2] = 3 ways
- 4 stairs: dp[2] + dp[3] = 5 ways

See the pattern? Each position's answer = sum of the two before it. It's Fibonacci in disguise!

This is **tabulation**: fill an array from small to large, using previous answers to build each new one. No recursion, no stack overflow. Just a loop.`,
        concept: 'Tabulation recipe: (1) Define dp[i] as the answer to the subproblem at i. (2) Define the base cases. (3) Write the recurrence relation (how dp[i] depends on previous entries). (4) Loop through and fill the table. (5) Return dp[n].',
        codeExample: `// Climbing Stairs — dp[i] = ways to reach step i
function climbStairs(n: number): number {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // base: 1 way to stand at ground
  dp[1] = 1; // base: 1 way to reach step 1

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]; // from 1 step below or 2 steps below
  }
  return dp[n];
}

// Coin Change — minimum coins to make amount
// dp[i] = min coins to make amount i
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // base: 0 coins to make amount 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1; // use this coin
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// coinChange([1,5,11], 15) → 3 (5+5+5)`,
        tip: '🎯 Interview tip: The hardest part of DP is defining dp[i]. Ask yourself: "What information do I need to solve the subproblem at i?" That\'s what dp[i] should store.',
      },
      {
        id: 3,
        emoji: '🧬',
        title: '2D DP — Two Sequences',
        narrative: `When the problem involves **TWO sequences** (strings, arrays), you often need a **2D DP table**.

Classic: **Longest Common Subsequence (LCS)**. Given "ABCDE" and "ACE", find the longest subsequence present in both ("ACE" = length 3).

Build a 2D table where dp[i][j] = LCS length of first i chars of s1 and first j chars of s2:
- If s1[i] === s2[j]: dp[i][j] = dp[i-1][j-1] + 1 (extend the match)
- Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (skip one char from either)

This pattern appears in: Edit Distance, Distinct Subsequences, Interleaving Strings — all the "hard" DP problems on LeetCode.`,
        concept: '2D DP: dp[i][j] represents answer for first i elements of A and first j elements of B. Typically O(m×n) time and space. Space optimization: since dp[i][j] only depends on row i-1, you can reduce to two 1D arrays (current and previous row).',
        codeExample: `// Longest Common Subsequence — O(m×n)
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  // dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
  const dp: number[][] = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1; // characters match!
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // skip one
      }
    }
  }
  return dp[m][n];
}

// Edit Distance (Levenshtein) — similar 2D DP
function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  const dp: number[][] = Array.from({length: m + 1}, (_, i) =>
    Array.from({length: n + 1}, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = word1[i-1] === word2[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}`,
        tip: '🎯 Interview tip: When stuck on a DP problem, draw the table on paper. Fill in the base cases. Then try to fill in dp[1][1] manually — the recurrence usually becomes obvious from looking at the pattern.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What are the TWO key properties a problem must have for Dynamic Programming to apply?',
        options: ['Must be sorted and must use recursion', 'Overlapping subproblems AND optimal substructure', 'Must have O(n²) brute force and be on arrays', 'Must have a greedy solution and a recursive solution'],
        correctIndex: 1,
        explanation: 'Overlapping subproblems: same subproblem computed multiple times (memoization helps). Optimal substructure: the optimal solution uses optimal solutions to subproblems. Both must hold. Greedy problems have optimal substructure but NOT overlapping subproblems.',
      },
      {
        id: 2,
        question: 'What is the time complexity of the Coin Change problem (min coins to make amount A with C coin types)?',
        options: ['O(A)', 'O(C × A)', 'O(C²)', 'O(2^A)'],
        correctIndex: 1,
        explanation: 'For each of the A amounts (from 1 to A), we try each of the C coins. Two nested loops: O(C × A). Space is O(A) for the dp array. This is the classic "knapsack-style" DP recurrence.',
      },
      {
        id: 3,
        question: 'What is the difference between memoization and tabulation?',
        options: ['Memoization is faster; tabulation uses more memory', 'Memoization is top-down (recursion+cache); tabulation is bottom-up (iterative)', 'They solve different types of problems', 'Memoization only works for 1D problems'],
        correctIndex: 1,
        explanation: 'Same result, different direction. Memoization: recurse from the answer down to base cases, caching along the way. Tabulation: start from base cases, build up to the answer iteratively. Tabulation avoids recursion overhead and stack overflow risk.',
      },
      {
        id: 4,
        question: 'For the Longest Common Subsequence of strings of length m and n, the DP solution has complexity:',
        options: ['O(m + n) time, O(1) space', 'O(m × n) time, O(m × n) space (reducible to O(n))', 'O(m × n × log n) time', 'O(2^(m+n)) time'],
        correctIndex: 1,
        explanation: 'The 2D DP table is m×n, filled in a double loop = O(m×n) time. Space is O(m×n) for the table, but can be optimized to O(n) by keeping only the current and previous row, since dp[i][j] only depends on dp[i-1][...].',
      },
      {
        id: 5,
        question: 'The "Climbing Stairs" problem (1 or 2 steps at a time, n steps total) is equivalent to:',
        options: ['Finding the nth prime number', 'Computing the nth Fibonacci number', 'Sorting n elements', 'Finding shortest path of length n'],
        correctIndex: 1,
        explanation: 'ways(n) = ways(n-1) + ways(n-2), with ways(0)=1, ways(1)=1. This is exactly the Fibonacci recurrence! Many DP problems disguise themselves as Fibonacci variants. Recognizing this pattern saves interview time.',
      },
    ],
  },

  // ─── Heaps ─────────────────────────────────────────────────────────────────
  {
    slug: 'heaps',
    title: 'Heaps & Priority Queues',
    emoji: '⛰️',
    tagline: 'Always Know the Best',
    description: 'Master the data structure that always gives you the min or max in O(1). Essential for Top-K problems, merge K sorted lists, task schedulers, and Dijkstra\'s algorithm.',
    color: '#d97706',
    gradient: 'from-yellow-400 to-amber-600',
    textColor: 'text-amber-700',
    difficulty: 'Intermediate',
    timeToComplete: '30 min',
    keyComplexities: [
      { operation: 'Get min/max', complexity: 'O(1)' },
      { operation: 'Insert', complexity: 'O(log n)' },
      { operation: 'Extract min/max', complexity: 'O(log n)' },
      { operation: 'Build heap', complexity: 'O(n)' },
      { operation: 'Heap sort', complexity: 'O(n log n)' },
    ],
    patterns: [
      { name: 'Top-K Elements', description: 'Use a min-heap of size K — discard anything smaller than current min', useCase: 'K largest elements, K closest points, K most frequent elements', problems: [
        { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
        { title: 'K Closest Points to Origin', difficulty: 'Medium', url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
        { title: 'Top K Frequent Elements', difficulty: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      ]},
      { name: 'Merge K Sorted', description: 'Push first element of each list into a min-heap, extract min repeatedly', useCase: 'Merge K sorted lists/arrays, smallest range covering K lists', problems: [
        { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
        { title: 'Smallest Range Covering Elements from K Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/' },
      ]},
      { name: 'Two Heaps', description: 'Use a max-heap for lower half and min-heap for upper half to track median', useCase: 'Find median from data stream, sliding window median', problems: [
        { title: 'Find Median from Data Stream', difficulty: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
        { title: 'Sliding Window Median', difficulty: 'Hard', url: 'https://leetcode.com/problems/sliding-window-median/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🏥',
        title: 'The Hospital Triage',
        narrative: `An emergency room gets patients continuously. The doctor must always treat the **most critical patient first** — not the one who arrived first.

A regular queue? Doesn't work — you need priority. An array sorted every time? O(n log n) for each arrival. Too slow.

Enter the **Priority Queue** (backed by a **Heap**): patients enter in any order, but the doctor always gets the most critical one instantly, O(1). Inserting a new patient: O(log n). Treating the most critical: O(log n).

The heap is a **complete binary tree** with one rule: every parent is more extreme than its children (min-heap: parent ≤ children; max-heap: parent ≥ children). The root is always the minimum (or maximum).`,
        concept: 'A heap is stored as an array: root at index 0, children of index i at 2i+1 and 2i+2, parent of index i at floor((i-1)/2). This compact layout enables O(log n) insert and extract while using O(n) space. JavaScript lacks a built-in heap — you simulate one or use a library.',
        codeExample: `// Min-Heap implementation in TypeScript
class MinHeap {
  private heap: number[] = [];

  push(val: number) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  peek(): number { return this.heap[0]; }
  size(): number { return this.heap.length; }

  private bubbleUp(i: number) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent] <= this.heap[i]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const [l, r] = [2 * i + 1, 2 * i + 2];
      if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}`,
        tip: '🎯 Interview tip: JavaScript doesn\'t have a built-in heap. In interviews, either implement a simple one OR mention you\'d use a library. Interviewers usually allow this and care about your USAGE pattern, not the implementation.',
      },
      {
        id: 2,
        emoji: '🏆',
        title: 'Top-K Pattern',
        narrative: `"Find the K largest elements in an array of 1 million numbers."

Naive: sort everything → O(n log n). For 1M elements, that's fine, but interviewers want better.

**Min-heap of size K**: Walk through the array. For each element:
- If heap has fewer than K elements → push it in
- Else if element > heap.min → pop the min, push the new element

After processing all elements, the heap contains the K largest! The heap min is always the Kth largest overall.

Why? The heap evicts the smallest element among the K candidates. What remains must be the K largest.

Time: O(n log K) — much better when K << n!`,
        concept: 'Top-K with min-heap: maintain a window of the K best candidates. For "K largest", use a min-heap (evict the smallest). For "K smallest", use a max-heap (evict the largest). Time: O(n log K). Space: O(K).',
        codeExample: `// K Largest Elements — O(n log k)
function kLargest(nums: number[], k: number): number[] {
  const heap = new MinHeap();

  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) heap.pop(); // evict smallest
  }

  // Heap now contains k largest elements
  const result: number[] = [];
  while (heap.size() > 0) result.push(heap.pop()!);
  return result;
}

// K Closest Points to Origin — O(n log k)
function kClosest(points: number[][], k: number): number[][] {
  // Use max-heap on distance (evict farthest)
  // Simulate with negative distances in a min-heap
  const heap: [number, number[]][] = []; // [dist, point]
  const dist = (p: number[]) => p[0] ** 2 + p[1] ** 2;

  for (const p of points) {
    heap.push([dist(p), p]);
    heap.sort((a, b) => b[0] - a[0]); // max-heap by distance
    if (heap.length > k) heap.shift(); // evict farthest
  }

  return heap.map(([, p]) => p);
}

// Kth Largest — just peek at heap min after processing
function findKthLargest(nums: number[], k: number): number {
  const result = kLargest(nums, k);
  return Math.min(...result); // min of k largest = kth largest
}`,
        tip: '🎯 Interview tip: "K largest" → min-heap size K. "K smallest" → max-heap size K. The counterintuitive choice (min-heap for largest) is the key insight interviewers test.',
      },
      {
        id: 3,
        emoji: '🔀',
        title: 'Merge K Sorted Lists',
        narrative: `You have **K sorted arrays** (or linked lists). Merge them into one sorted array.

Brute force: dump everything into one array, sort. O(N log N) where N = total elements.

Heap approach: put the **first element of each list** into a min-heap along with its list ID and index. Then:
1. Extract the min from the heap
2. Add it to the result
3. Insert the NEXT element from the same list into the heap

This always gives us the global minimum in O(log K) time. Total: O(N log K) — better because log K << log N when K is small.

This "feed the heap from multiple sorted sources" pattern also solves: Find smallest range covering K lists, merge K sorted streams.`,
        concept: 'Merge K sorted sources in O(N log K): use a min-heap of size K. Each heap entry = (value, source_id, index). Extract min, output it, push next element from same source. Heap size stays ≤ K throughout.',
        codeExample: `// Merge K Sorted Arrays — O(N log K)
function mergeKSorted(arrays: number[][]): number[] {
  // Heap entries: [value, arrayIndex, elementIndex]
  const heap: [number, number, number][] = [];

  // Initialize with first element of each array
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      heap.push([arrays[i][0], i, 0]);
    }
  }

  // Simple sort as heap (in interviews, use proper heap)
  const result: number[] = [];

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]); // O(k log k) — replace with real heap
    const [val, arrIdx, elemIdx] = heap.shift()!;
    result.push(val);

    // Push next element from same array
    if (elemIdx + 1 < arrays[arrIdx].length) {
      heap.push([arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1]);
    }
  }

  return result;
}

// Find Median from Data Stream — Two Heaps
class MedianFinder {
  private lower = new MaxHeap(); // lower half
  private upper = new MinHeap(); // upper half

  addNum(num: number) {
    this.lower.push(num);
    this.upper.push(this.lower.pop()!); // balance
    if (this.upper.size() > this.lower.size())
      this.lower.push(this.upper.pop()!);
  }

  findMedian(): number {
    if (this.lower.size() > this.upper.size()) return this.lower.peek();
    return (this.lower.peek() + this.upper.peek()) / 2;
  }
}`,
        tip: '🎯 Interview tip: "Two heaps" pattern for MEDIAN: max-heap holds the smaller half, min-heap holds the larger half. Median is either the top of the larger heap, or average of both tops. Balance them to differ by at most 1 in size.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the time complexity of extracting the minimum from a min-heap?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'Extracting the min removes the root (O(1) to grab it), then replaces it with the last element and sinks it down to restore the heap property. The sink-down is O(log n) since the heap has height log n.',
      },
      {
        id: 2,
        question: 'To find the K LARGEST elements efficiently, you should use:',
        options: ['A max-heap of all elements, then extract K times', 'A min-heap of size K — evict elements smaller than current min', 'Sort the array and take the last K elements', 'A max-heap of size K — evict elements larger than current max'],
        correctIndex: 1,
        explanation: 'A min-heap of size K maintains the K largest seen so far. The heap\'s minimum is the Kth largest. When a new element exceeds the heap\'s minimum, it replaces it. Time: O(n log K). Option A gives O(n + K log n) which is worse when K is large.',
      },
      {
        id: 3,
        question: 'In a heap stored as an array, if a node is at index i, where are its children?',
        options: ['Indices i+1 and i+2', 'Indices 2i and 2i+1', 'Indices 2i+1 and 2i+2', 'Indices i×2 and i÷2'],
        correctIndex: 2,
        explanation: 'With 0-based indexing: children of node i are at 2i+1 (left) and 2i+2 (right). Parent of node i is at floor((i-1)/2). This array layout allows O(1) parent/child access without pointers, making heaps very cache-friendly.',
      },
      {
        id: 4,
        question: 'Merging K sorted arrays of total N elements using a heap takes:',
        options: ['O(N log N)', 'O(N log K)', 'O(K log N)', 'O(N × K)'],
        correctIndex: 1,
        explanation: 'We extract N elements total. Each extraction + re-insertion is O(log K) (heap size stays ≤ K). Total: O(N log K). Since K ≤ N, log K ≤ log N, so this is better than sorting everything (O(N log N)).',
      },
      {
        id: 5,
        question: 'The "Find Median from Data Stream" problem is best solved with:',
        options: ['Sorting the stream after each insertion', 'A single max-heap of all elements', 'Two heaps: max-heap for lower half, min-heap for upper half', 'Binary search on a sorted array'],
        correctIndex: 2,
        explanation: 'Two heaps maintain the lower and upper halves. The median is the top of the larger heap (odd total) or average of both tops (even total). Each insertion is O(log n). Single heap doesn\'t help — you can\'t get the median without knowing the lower half\'s max.',
      },
    ],
  },

  // ─── Tries ─────────────────────────────────────────────────────────────────
  {
    slug: 'tries',
    title: 'Tries',
    emoji: '🌿',
    tagline: 'Prefix Trees & Autocomplete',
    description: 'The secret behind autocomplete, spell-checkers, and IP routing. Master the prefix tree that turns string search from O(n) to O(k) where k is just the word length.',
    color: '#0d9488',
    gradient: 'from-teal-400 to-cyan-600',
    textColor: 'text-teal-600',
    difficulty: 'Intermediate',
    timeToComplete: '30 min',
    keyComplexities: [
      { operation: 'Insert', complexity: 'O(k)' },
      { operation: 'Search', complexity: 'O(k)' },
      { operation: 'startsWith prefix', complexity: 'O(k)' },
      { operation: 'Space', complexity: 'O(n × k)' },
      { operation: 'Delete', complexity: 'O(k)' },
    ],
    patterns: [
      { name: 'Prefix Matching', description: 'Walk the trie one character at a time — reach the prefix node, then collect all words beneath', useCase: 'Autocomplete, word suggestions, longest common prefix', problems: [
        { title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
        { title: 'Longest Common Prefix', difficulty: 'Easy', url: 'https://leetcode.com/problems/longest-common-prefix/' },
        { title: 'Search Suggestions System', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-suggestions-system/' },
      ]},
      { name: 'Word Search in Trie', description: 'Combine DFS on a grid with trie lookup to prune search branches early', useCase: 'Word Search II, stream of characters, palindrome pairs', problems: [
        { title: 'Word Search II', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-search-ii/' },
        { title: 'Add and Search Word', difficulty: 'Medium', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
        { title: 'Stream of Characters', difficulty: 'Hard', url: 'https://leetcode.com/problems/stream-of-characters/' },
      ]},
      { name: 'Trie with Count', description: 'Store frequency or count at each node to rank suggestions or detect frequency', useCase: 'Top autocomplete suggestions, word frequency ranking', problems: [
        { title: 'Search Suggestions System', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-suggestions-system/' },
        { title: 'Replace Words', difficulty: 'Medium', url: 'https://leetcode.com/problems/replace-words/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🔤',
        title: 'The Spell-Checker\'s Secret',
        narrative: `Every time you type a word and your phone suggests completions, a **Trie** (prefix tree) is working behind the scenes. But why not just use a HashMap?

Imagine you need to find all words starting with "app" from a dictionary of 100,000 words. With a HashMap, you'd scan every single key — O(n). Terrible.

With a **Trie**, you just walk three nodes: 'a' → 'p' → 'p', and everything beneath that node IS your answer. No scanning needed.

A trie is a tree where:
- Each **node** represents one **character**
- The **path from root to any node** spells a prefix
- A special **isEnd** flag marks where complete words end`,
        concept: 'A Trie node has children[26] (one per letter) and an isEnd flag. Insert: walk/create nodes for each character, set isEnd=true at the last. Search: walk nodes for each character, return isEnd at the last. startsWith: same as search but don\'t check isEnd.',
        codeExample: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return node.isEnd; // must be a complete word
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true; // prefix exists — don't check isEnd
  }
}`,
        tip: '🎯 Interview tip: The key difference — search() checks isEnd=true, startsWith() doesn\'t. Many bugs come from confusing these two. Draw it out first!',
      },
      {
        id: 2,
        emoji: '🔮',
        title: 'Autocomplete — The Full Power',
        narrative: `You've built the trie. Now a user types "ap" and you need to return all words that start with "ap" — like a real autocomplete.

The trick is two-step:
1. **Navigate** to the prefix node (walk "a" → "p")
2. **DFS** from that node, collecting all complete words below

This is O(k + m) where k = prefix length and m = number of matching words. Much better than scanning the whole dictionary.

**Word Search II** takes this further: given a 2D grid of letters and a list of words, find all words that exist in the grid (connecting adjacent cells). Insert all words into a trie, then DFS each cell of the grid, pruning branches that don't exist in the trie. Without the trie, you'd search for each word individually — O(words × cells × 4^maxLen). With the trie, you search once and find all simultaneously.`,
        concept: 'Trie + DFS = powerful combination. For autocomplete: navigate to prefix node, then DFS collecting words where isEnd=true. For Word Search II: build trie from word list, then do grid DFS. At each cell, check if the current path exists in the trie — if not, prune immediately. This turns multiple independent searches into one shared search.',
        codeExample: `// Autocomplete: get all words with given prefix
function autocomplete(trie: Trie, prefix: string): string[] {
  let node = trie.root;
  for (const ch of prefix) {
    if (!node.children.has(ch)) return []; // prefix doesn't exist
    node = node.children.get(ch)!;
  }
  // DFS from prefix node
  const results: string[] = [];
  function dfs(n: TrieNode, path: string) {
    if (n.isEnd) results.push(path);
    for (const [ch, child] of n.children) dfs(child, path + ch);
  }
  dfs(node, prefix);
  return results;
}

// Word Search II — trie + grid DFS
function findWords(board: string[][], words: string[]): string[] {
  const trie = new Trie();
  words.forEach(w => trie.insert(w));

  const found = new Set<string>();
  const [rows, cols] = [board.length, board[0].length];

  function dfs(r: number, c: number, node: TrieNode, path: string) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const ch = board[r][c];
    if (ch === '#' || !node.children.has(ch)) return; // pruned!
    const next = node.children.get(ch)!;
    const word = path + ch;
    if (next.isEnd) found.add(word);
    board[r][c] = '#'; // mark visited
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc]) => dfs(r+dr, c+dc, next, word));
    board[r][c] = ch; // restore
  }

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      dfs(r, c, trie.root, '');

  return [...found];
}`,
        tip: '🎯 Interview tip: In Word Search II, mark cells visited with a sentinel (like "#") during DFS and restore after — this prevents using extra space for a visited set.',
      },
      {
        id: 3,
        emoji: '⚙️',
        title: 'Wildcards & Advanced Patterns',
        narrative: `The "Add and Search Words" problem introduces wildcards: "." matches any character. How do you search "d.g" in a trie?

When you hit a ".", you can't go to a specific child — you must try **all children** recursively. This turns search into DFS over the trie.

Another pattern: storing **frequency** at each node. When users type "ap", you want to return the 3 most searched words starting with "ap", not all of them. Store search count at the end nodes and sort the DFS results.

Tries also appear in problems like:
- **Replace Words**: replace all words in a sentence with their shortest root in the dictionary
- **Maximum XOR**: use a bit trie to find the number that XORs maximally with each element`,
        concept: 'Wildcard search: when character is ".", iterate ALL children with DFS. For frequency-ranked autocomplete: store count at isEnd nodes, use priority queue during DFS collection. The key insight is that tries generalize to any "prefix structure" — bits, phone digits, IP addresses.',
        codeExample: `// Add and Search Words (with wildcards)
class WordDictionary {
  root = new TrieNode();

  addWord(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    return this.dfs(word, 0, this.root);
  }

  private dfs(word: string, i: number, node: TrieNode): boolean {
    if (i === word.length) return node.isEnd;
    const ch = word[i];
    if (ch === '.') {
      // Try ALL children
      for (const child of node.children.values()) {
        if (this.dfs(word, i + 1, child)) return true;
      }
      return false;
    }
    if (!node.children.has(ch)) return false;
    return this.dfs(word, i + 1, node.children.get(ch)!);
  }
}`,
        tip: '🎯 Interview tip: Tries shine when the problem involves PREFIXES of strings. If you see "find all words starting with X" or "check if any word in a list is a prefix of Y", reach for a trie.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the time complexity of searching for a word of length k in a trie with n total words?',
        options: ['O(n)', 'O(k)', 'O(n × k)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'Trie search is O(k) where k = length of the word — you simply walk one node per character. It\'s independent of how many words are in the trie! This is the key advantage over a HashMap scan for prefix operations.',
      },
      {
        id: 2,
        question: 'The key difference between trie.search("apple") and trie.startsWith("apple") is:',
        options: ['search() is faster', 'search() checks isEnd=true at the last node; startsWith() just checks the prefix exists', 'startsWith() only works for short words', 'They are identical'],
        correctIndex: 1,
        explanation: 'Both walk the same path — one character per node. But search() requires the last node to have isEnd=true (complete word). startsWith() just checks that the path exists, regardless of isEnd. "apple" might be a prefix of "applesauce" but not itself be in the trie.',
      },
      {
        id: 3,
        question: 'Why is a trie better than a HashMap for finding all words with a given prefix?',
        options: ['Tries use less memory', 'HashMap lookup is O(n) but trie prefix navigation is O(k) then collect all', 'HashMaps can\'t store strings', 'Tries support all string operations that HashMaps do plus O(k) prefix access'],
        correctIndex: 3,
        explanation: 'With a HashMap, finding all words with prefix "app" requires scanning all keys — O(n). With a trie, navigate to the "app" node in O(3) steps, then collect all words beneath via DFS. The trie structures words by their shared prefixes, enabling efficient prefix operations.',
      },
      {
        id: 4,
        question: 'In the Word Search II problem, why does building a trie from the word list improve performance?',
        options: ['Trie uses less memory than the word list', 'You can search for ALL words simultaneously in one DFS, pruning invalid paths early', 'Grid DFS is not possible without a trie', 'It reduces the grid size'],
        correctIndex: 1,
        explanation: 'Without a trie, you\'d do one DFS per word — O(words × cells). With a trie, ONE DFS finds all words at once. The critical optimization: if the current path doesn\'t exist in the trie, you prune that entire branch. This is exponentially faster for large word lists.',
      },
      {
        id: 5,
        question: 'What does the isEnd flag in a trie node indicate?',
        options: ['The node has no children', 'A complete word ends at this node (though more words may continue past it)', 'This is the deepest level of the trie', 'The character at this node is the last letter of the alphabet'],
        correctIndex: 1,
        explanation: '"apple" and "applesauce" share the path a-p-p-l-e. The node at "e" has isEnd=true (marking "apple") AND has child "s" (continuing to "applesauce"). isEnd means "a word ends here" — the trie can have both words stored with isEnd set at different depths.',
      },
    ],
  },

  // ─── Backtracking ──────────────────────────────────────────────────────────
  {
    slug: 'backtracking',
    title: 'Backtracking',
    emoji: '🔙',
    tagline: 'Explore, Fail Fast, Undo',
    description: 'The systematic "try everything" strategy. Master the recursive exploration pattern behind permutations, subsets, combination sums, N-Queens, and Sudoku solvers.',
    color: '#7c3aed',
    gradient: 'from-violet-500 to-purple-700',
    textColor: 'text-violet-600',
    difficulty: 'Advanced',
    timeToComplete: '40 min',
    keyComplexities: [
      { operation: 'Subsets of n items', complexity: 'O(2ⁿ)' },
      { operation: 'Permutations of n', complexity: 'O(n!)' },
      { operation: 'Combinations C(n,k)', complexity: 'O(C(n,k) × k)' },
      { operation: 'N-Queens', complexity: 'O(n!)' },
      { operation: 'With pruning', complexity: 'Much faster in practice' },
    ],
    patterns: [
      { name: 'Subsets / Power Set', description: 'At each element: choose to include it or not — binary decision tree', useCase: 'Subsets, subsets with duplicates, target sum combinations', problems: [
        { title: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/' },
        { title: 'Subsets II', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets-ii/' },
        { title: 'Combination Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum/' },
      ]},
      { name: 'Permutations', description: 'At each position, try every unused element — swap or use a visited set', useCase: 'All permutations, next permutation, letter tile possibilities', problems: [
        { title: 'Permutations', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations/' },
        { title: 'Permutations II', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations-ii/' },
        { title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      ]},
      { name: 'Constraint Satisfaction', description: 'Build solution incrementally, prune branches that violate constraints', useCase: 'N-Queens, Sudoku solver, word search', problems: [
        { title: 'N-Queens', difficulty: 'Hard', url: 'https://leetcode.com/problems/n-queens/' },
        { title: 'Sudoku Solver', difficulty: 'Hard', url: 'https://leetcode.com/problems/sudoku-solver/' },
        { title: 'Word Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-search/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🏰',
        title: 'The Escape Room',
        narrative: `You're trapped in an escape room. There are 4 doors, each leading to more doors. Some paths lead out. Most are dead ends.

Your strategy: try Door 1. If it leads to a dead end, **backtrack** — return to where you were and try Door 2. Then Door 3. And so on. You systematically explore every possibility.

This is **backtracking**: a recursive approach that:
1. **Makes a choice** (open a door, add an element, place a queen)
2. **Recurses** (explore what happens next)
3. **Undoes the choice** when stuck (backtrack)
4. **Tries the next option**

It's brute force, but with **pruning** — if you know a path can't possibly lead to a solution, skip the entire subtree. This is what separates backtracking from pure brute force.`,
        concept: 'Backtracking template: for each choice → make the choice → recurse → undo the choice. The "undo" step (popping from a list, restoring a value, marking unvisited) is what makes it backtracking. Without undo, it\'s just DFS. The power is in the constraint-checking to prune early.',
        codeExample: `// The Universal Backtracking Template
function backtrack(
  choices: any[],
  current: any[],
  results: any[][],
  ...constraints: any[]
) {
  // Base case: found a valid solution
  if (isComplete(current)) {
    results.push([...current]); // always copy!
    return;
  }

  for (const choice of choices) {
    if (!isValid(choice, current)) continue; // prune!

    current.push(choice);        // make choice
    backtrack(/* next state */); // recurse
    current.pop();               // UNDO choice ← this is backtracking
  }
}

// Generate all subsets of [1,2,3]
function subsets(nums: number[]): number[][] {
  const results: number[][] = [];

  function bt(start: number, current: number[]) {
    results.push([...current]); // every state is a valid subset

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);    // include nums[i]
      bt(i + 1, current);       // recurse with remaining
      current.pop();            // exclude nums[i] (backtrack)
    }
  }

  bt(0, []);
  return results;
}
// subsets([1,2,3]) → [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]`,
        tip: '🎯 Interview tip: Always use [...current] (spread) when pushing to results — never push the reference! current gets mutated by backtracking, so you\'d see all results as empty arrays if you push the reference.',
      },
      {
        id: 2,
        emoji: '🎲',
        title: 'Permutations & Combinations',
        narrative: `Two fundamental backtracking problems:

**Permutations** of [1,2,3]: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] — **order matters**, use each element once. At each position, try every unused number (use a "used" set or swap in-place).

**Combination Sum**: find all combinations that sum to target (can reuse elements). At each step, choose any number ≥ current to avoid duplicates, subtract from remaining target.

The key insight: **where to start the loop** controls duplicates:
- Permutations: loop from 0 (order matters, use visited set)
- Combinations: loop from 'start' (order doesn't matter, no revisiting)
- Subsets with duplicates: sort first, skip nums[i] === nums[i-1]`,
        concept: 'Permutations: try all positions, use a visited array to skip used elements, O(n!). Combinations: start loop at current index (not 0) to avoid generating [1,2] and [2,1] separately, O(2^n). Duplicates: sort the input first, skip consecutive equal values at the same depth.',
        codeExample: `// Permutations — O(n!)
function permute(nums: number[]): number[][] {
  const results: number[][] = [];
  const used = new Array(nums.length).fill(false);

  function bt(current: number[]) {
    if (current.length === nums.length) { results.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      bt(current);
      current.pop();
      used[i] = false;
    }
  }
  bt([]);
  return results;
}

// Combination Sum — reuse allowed
function combinationSum(candidates: number[], target: number): number[][] {
  const results: number[][] = [];

  function bt(start: number, current: number[], remaining: number) {
    if (remaining === 0) { results.push([...current]); return; }
    if (remaining < 0) return; // pruned!

    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      bt(i, current, remaining - candidates[i]); // i (not i+1) = reuse allowed
      current.pop();
    }
  }
  bt(0, [], target);
  return results;
}`,
        tip: '🎯 Interview tip: Draw the decision tree before coding. Each level = one decision, each branch = one choice. The number of leaves = number of results. This instantly shows you the time complexity.',
      },
      {
        id: 3,
        emoji: '♛',
        title: 'N-Queens: Constraint Satisfaction',
        narrative: `Place N queens on an N×N chessboard so no two queens attack each other. This is the classic **constraint satisfaction** backtracking problem.

Strategy: place queens row by row. For each row, try every column. Before placing, check: is this column safe? Is the diagonal safe?

If no safe column exists in a row → backtrack to the previous row and try the next column there.

Without pruning: try all N^N positions. With backtracking: prune entire branches when a queen placement is invalid. For N=8, instead of 8^8 = 16M states, we explore only ~2,000.

The pruning insight: you don't need a 2D board. Track:
- 'cols': set of used columns
- 'diag1': set of (row - col) values (same diagonal)
- 'diag2': set of (row + col) values (anti-diagonal)`,
        concept: 'Constraint satisfaction: place one queen per row. Check validity in O(1) using column set and two diagonal sets. If valid: place, recurse, remove (backtrack). If you reach row N successfully: found a valid solution. Space-efficient: O(N) for the three sets instead of O(N²) board.',
        codeExample: `function solveNQueens(n: number): string[][] {
  const results: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // row - col
  const diag2 = new Set<number>(); // row + col
  const board: number[] = []; // board[row] = column where queen is placed

  function bt(row: number) {
    if (row === n) {
      results.push(board.map(col =>
        '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)
      ));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col))
        continue; // this position is attacked — prune!

      cols.add(col); diag1.add(row - col); diag2.add(row + col);
      board.push(col);
      bt(row + 1);
      board.pop();
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
    }
  }

  bt(0);
  return results;
}`,
        tip: '🎯 Interview tip: The diagonal check trick (row-col for \\ diagonals, row+col for / diagonals) is reusable in any chess-placement problem. Memorize it — it shows up in Sudoku Solver too.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the critical step that makes a recursive function "backtracking" (vs just DFS)?',
        options: ['Using a stack instead of recursion', 'UNDOING the choice after the recursive call returns', 'Checking constraints before recursing', 'Returning early when the base case is hit'],
        correctIndex: 1,
        explanation: 'The defining feature of backtracking is the undo step: make choice → recurse → UNDO choice. Without undoing, you can\'t reuse the same data structure for different branches. Popping from a list, unmarking visited, restoring a cell — these are all "undo" operations.',
      },
      {
        id: 2,
        question: 'How many subsets does a set of n elements have?',
        options: ['n!', 'n²', '2ⁿ', 'n log n'],
        correctIndex: 2,
        explanation: 'Each element has 2 choices: included or not. With n elements, that\'s 2×2×...×2 = 2ⁿ subsets. For n=3: {}, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3} = 8 = 2³.',
      },
      {
        id: 3,
        question: 'In backtracking, "pruning" means:',
        options: ['Deleting elements from the input', 'Skipping recursive calls when we know they cannot lead to a valid solution', 'Sorting the candidates before recursing', 'Limiting the recursion depth'],
        correctIndex: 1,
        explanation: 'Pruning eliminates branches of the decision tree that can\'t possibly yield a valid result. Example: in Combination Sum, if remaining < 0, return immediately — no need to explore further. Pruning is what makes backtracking practical vs pure brute force.',
      },
      {
        id: 4,
        question: 'When generating combinations (not permutations) to avoid duplicates like [1,2] and [2,1], you should:',
        options: ['Use a visited array', 'Sort the results and deduplicate', 'Start the inner loop from the current index (start), not from 0', 'Use a HashSet to skip duplicates'],
        correctIndex: 2,
        explanation: 'For combinations, starting the loop at `start` (not 0) ensures you only consider elements at or after the current position. This naturally prevents [2,1] after [1,2] since 1 < 2 and you never look backward. This is the cleanest O(1) deduplication.',
      },
      {
        id: 5,
        question: 'In the N-Queens problem, what is the most efficient way to check if a position (row, col) is safe?',
        options: ['Scan the entire board for conflicts', 'Check row above one by one', 'Use three sets: used columns, (row-col) diagonals, (row+col) anti-diagonals — O(1) check', 'Use a 2D boolean grid'],
        correctIndex: 2,
        explanation: 'All cells on the same \\ diagonal share the same (row-col) value. All cells on the same / anti-diagonal share the same (row+col) value. Storing these in sets gives O(1) conflict checking. This is much better than scanning the board which is O(n).',
      },
    ],
  },

  // ─── Greedy ────────────────────────────────────────────────────────────────
  {
    slug: 'greedy',
    title: 'Greedy Algorithms',
    emoji: '💰',
    tagline: 'Take the Best Now',
    description: 'Make the locally optimal choice at each step and trust it leads to the global optimum. Learn when greedy works and when you need DP instead — a critical distinction for interviews.',
    color: '#16a34a',
    gradient: 'from-green-400 to-emerald-600',
    textColor: 'text-green-600',
    difficulty: 'Intermediate',
    timeToComplete: '30 min',
    keyComplexities: [
      { operation: 'Activity Selection', complexity: 'O(n log n)' },
      { operation: 'Jump Game', complexity: 'O(n)' },
      { operation: 'Huffman Coding', complexity: 'O(n log n)' },
      { operation: 'Fractional Knapsack', complexity: 'O(n log n)' },
      { operation: 'Meeting Rooms', complexity: 'O(n log n)' },
    ],
    patterns: [
      { name: 'Interval Scheduling', description: 'Sort intervals, greedily pick the one that ends earliest (leaves most room)', useCase: 'Meeting rooms, non-overlapping intervals, minimum platforms', problems: [
        { title: 'Non-overlapping Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
        { title: 'Merge Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/' },
        { title: 'Meeting Rooms II', difficulty: 'Medium', url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      ]},
      { name: 'Greedy with Heap', description: 'Use a priority queue to always process the most/least urgent item', useCase: 'Task scheduler, reorganize string, rearrange k-distance apart', problems: [
        { title: 'Task Scheduler', difficulty: 'Medium', url: 'https://leetcode.com/problems/task-scheduler/' },
        { title: 'Reorganize String', difficulty: 'Medium', url: 'https://leetcode.com/problems/reorganize-string/' },
        { title: 'Gas Station', difficulty: 'Medium', url: 'https://leetcode.com/problems/gas-station/' },
      ]},
      { name: 'Greedy Linear Scan', description: 'Maintain a running "best so far" variable, update greedily', useCase: 'Jump Game, best time to buy stock, candy distribution', problems: [
        { title: 'Jump Game', difficulty: 'Medium', url: 'https://leetcode.com/problems/jump-game/' },
        { title: 'Jump Game II', difficulty: 'Medium', url: 'https://leetcode.com/problems/jump-game-ii/' },
        { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '💵',
        title: 'The Greedy Cashier',
        narrative: `A cashier needs to make change for $0.41 using the fewest coins: quarters, dimes, nickels, pennies.

The greedy strategy: **always use the largest coin that fits**.
- $0.41 → take a quarter (25¢) → $0.16 remaining
- Take a dime (10¢) → $0.06 remaining
- Take a nickel (5¢) → $0.01 remaining
- Take a penny (1¢) → done! Total: 4 coins

This works perfectly for standard US coins. But it **fails** for arbitrary coin systems! With coins [1, 3, 4] and target 6: greedy takes 4+1+1 = 3 coins, but 3+3 = 2 coins is optimal.

This example perfectly captures greedy: **simple, fast, sometimes wrong**. The skill is knowing when "locally optimal = globally optimal."`,
        concept: 'Greedy works when the problem has "greedy choice property": a locally optimal choice is part of some globally optimal solution. It also needs "optimal substructure": the subproblem after making the choice is also optimally solvable. When these hold, greedy beats DP in simplicity and speed.',
        codeExample: `// Fractional Knapsack — greedy works (take highest value/weight ratio)
function fractionalKnapsack(
  items: { weight: number; value: number }[],
  capacity: number
): number {
  // Sort by value/weight ratio (greedy choice)
  items.sort((a, b) => b.value / b.weight - a.value / a.weight);

  let totalValue = 0;
  for (const item of items) {
    if (capacity <= 0) break;
    const take = Math.min(item.weight, capacity);
    totalValue += (take / item.weight) * item.value;
    capacity -= take;
  }
  return totalValue;
}

// 0/1 Knapsack — greedy FAILS, need DP
// Can't take fractions, so greedy choice might be wrong

// Jump Game — greedy works
function canJump(nums: number[]): boolean {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false; // can't reach this index
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
        tip: '🎯 Interview tip: When you see "minimum number" or "maximum" problems, try greedy first. If it fails on a simple example, fall back to DP. The greedy→DP escalation is a common interview conversation.',
      },
      {
        id: 2,
        emoji: '📅',
        title: 'The Meeting Room Scheduler',
        narrative: `You have a list of meetings (start, end times). How do you fit the **maximum number** of non-overlapping meetings into a single room?

Greedy insight: **always pick the meeting that ends earliest**. Why? By finishing earliest, you leave the maximum possible time for future meetings.

Algorithm:
1. Sort meetings by **end time**
2. Take the first meeting
3. For each subsequent meeting, take it only if it starts ≥ last taken end time
4. Count meetings taken

Proof it's optimal: suppose greedy picks meeting A but optimal picks meeting B instead (both finish first among remaining options). B ends no earlier than A (since A was the earliest). Swapping B for A can only help — A ends earlier or at the same time, leaving at least as much room. So greedy is never worse.

This "exchange argument" proof works for many greedy interval problems.`,
        concept: 'Interval scheduling greedy: sort by end time, greedily select non-overlapping. For "minimum rooms needed": sort by start, use a min-heap of end times — heap size at any point = rooms currently in use. O(n log n) for the sort.',
        codeExample: `// Maximum non-overlapping meetings — O(n log n)
function maxMeetings(intervals: [number, number][]): number {
  intervals.sort((a, b) => a[1] - b[1]); // sort by END time
  let count = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) { // starts after last ends
      count++;
      lastEnd = intervals[i][1];
    }
  }
  return count;
}

// Minimum meeting rooms needed — O(n log n)
function minMeetingRooms(intervals: [number, number][]): number {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);

  let rooms = 0, maxRooms = 0, j = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[j]) {
      rooms++; // new meeting starts before any ends
    } else {
      j++; // a meeting ended, reuse that room
    }
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}`,
        tip: '🎯 Interview tip: "Non-overlapping intervals" / "remove minimum intervals to make non-overlapping" → sort by end time, greedily keep. "Minimum rooms / platforms" → sort starts and ends separately, use two-pointer.',
      },
      {
        id: 3,
        emoji: '🦘',
        title: 'Jump Game — Greedy Thinking',
        narrative: `"Jump Game": given an array where each element is your max jump length from that position, can you reach the last index?

Brute force / DP: O(n²) — for each position, check if any previous position can reach it.

Greedy insight: track the **furthest reachable index** as you walk. At each position i, update furthest = max(furthest, i + nums[i]). If i ever exceeds furthest, you're stuck.

Jump Game II (minimum jumps to reach end): at each "level" of reachable positions (like BFS), find the furthest you can reach in one more jump. Count levels.

The greedy here works because: if position i is reachable, then everything up to i + nums[i] is also potentially reachable. We only need the maximum reach, not the exact path.`,
        concept: 'Greedy linear scan: maintain one variable (maxReach, maxProfit, minPrice, etc.) and update it as you scan. No backtracking needed. This O(n) pattern works when the answer can be computed from a single left-to-right pass maintaining the optimal "running state".',
        codeExample: `// Jump Game I — can you reach end?
function canJump(nums: number[]): boolean {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true; // maxReach >= nums.length - 1
}

// Jump Game II — minimum jumps (BFS-like greedy)
function jump(nums: number[]): number {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {   // exhausted current jump range
      jumps++;            // must jump!
      curEnd = farthest;  // extend range
    }
  }
  return jumps;
}

// Best Time to Buy and Sell Stock — greedy with min tracking
function maxProfit(prices: number[]): number {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);          // greedy: track lowest buy
    maxProfit = Math.max(maxProfit, price - minPrice); // greedy: check best sell
  }
  return maxProfit;
}`,
        tip: '🎯 Interview tip: If greedy gives a "locally optimal" at each step but you\'re not sure it\'s globally optimal, try to find a counterexample with 3-4 elements. If you can\'t, it\'s likely correct. If you can, switch to DP.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'Greedy algorithms make locally optimal choices. When does this guarantee a globally optimal solution?',
        options: ['Always — greedy is always optimal', 'When the problem has greedy choice property AND optimal substructure', 'Only when the input is sorted', 'Only for graph problems'],
        correctIndex: 1,
        explanation: 'Two conditions: (1) Greedy choice property — a locally optimal choice is part of some globally optimal solution. (2) Optimal substructure — optimal solution to the original problem contains optimal solutions to subproblems. Without both, greedy can fail (like 0/1 Knapsack).',
      },
      {
        id: 2,
        question: 'For "maximum non-overlapping intervals", the greedy strategy is to sort by:',
        options: ['Start time, take non-overlapping from left', 'Duration (shortest first)', 'End time, greedily take the earliest-ending non-overlapping interval', 'End time descending'],
        correctIndex: 2,
        explanation: 'Sort by end time ascending, then greedily select intervals that start ≥ previous end. By always picking the earliest-ending available interval, you leave maximum room for future intervals. Sorting by start time or duration does NOT work — it\'s a common wrong answer.',
      },
      {
        id: 3,
        question: 'The greedy coin change algorithm (largest coin first) FAILS for which coin system?',
        options: ['US coins [1, 5, 10, 25]', 'Coins [1, 3, 4] with target 6 (optimal: 3+3=2 coins, greedy: 4+1+1=3 coins)', 'Any sorted coin system', 'Coins with gaps between denominations'],
        correctIndex: 1,
        explanation: 'US coins work because each denomination is a multiple of smaller ones. [1,3,4] breaks this: greedy picks 4 first (leaving 2, requiring two 1s = 3 total), but [3,3] is optimal (2 coins). This is why Coin Change uses DP, not greedy.',
      },
      {
        id: 4,
        question: 'In Jump Game, the greedy approach tracks:',
        options: ['The path of jumps taken', 'The maximum index reachable from any visited position', 'The minimum number of jumps', 'All positions reachable in exactly k jumps'],
        correctIndex: 1,
        explanation: 'Track maxReach = maximum index reachable from any position visited so far. At each position i: if i > maxReach, return false (stuck). Otherwise update maxReach = max(maxReach, i + nums[i]). One linear scan, O(n) time, O(1) space.',
      },
      {
        id: 5,
        question: 'What is the time complexity of the interval scheduling problem (maximum non-overlapping meetings)?',
        options: ['O(n)', 'O(n log n) — dominated by sorting', 'O(n²)', 'O(n log n) — but with O(n) space'],
        correctIndex: 1,
        explanation: 'Sorting takes O(n log n). The greedy selection scan is O(n). Total: O(n log n) dominated by the sort. Space is O(1) if we sort in-place (or O(log n) for sort stack). The sort is essential — without it, greedy selection doesn\'t work.',
      },
    ],
  },

  // ─── Bit Manipulation ──────────────────────────────────────────────────────
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    emoji: '⚡',
    tagline: 'Power of Binary',
    description: 'Harness the raw power of bitwise operations. Learn XOR tricks, bitmask patterns, and Brian Kernighan\'s algorithm — interview tricks that turn complex problems into one-liners.',
    color: '#2563eb',
    gradient: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-600',
    difficulty: 'Intermediate',
    timeToComplete: '25 min',
    keyComplexities: [
      { operation: 'Any bitwise op', complexity: 'O(1)' },
      { operation: 'Count set bits (naive)', complexity: 'O(log n)' },
      { operation: 'Count set bits (Kernighan)', complexity: 'O(set bits)' },
      { operation: 'Check power of 2', complexity: 'O(1)' },
      { operation: 'Enumerate subsets', complexity: 'O(2ⁿ × n)' },
    ],
    patterns: [
      { name: 'XOR Tricks', description: 'XOR cancels duplicates: a^a=0, a^0=a. Use to find unique elements or missing numbers', useCase: 'Single number, missing number, find two non-repeating', problems: [
        { title: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/' },
        { title: 'Missing Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/missing-number/' },
        { title: 'Single Number III', difficulty: 'Medium', url: 'https://leetcode.com/problems/single-number-iii/' },
      ]},
      { name: 'Bit Masking', description: 'Use AND to check/clear bits, OR to set bits, XOR to flip bits', useCase: 'Subsets enumeration, power of 2 check, divide without division', problems: [
        { title: 'Number of 1 Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/number-of-1-bits/' },
        { title: 'Power of Two', difficulty: 'Easy', url: 'https://leetcode.com/problems/power-of-two/' },
        { title: 'Counting Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/counting-bits/' },
      ]},
      { name: 'Bitmask DP', description: 'Use integer as a set representation — bit i=1 means element i is included', useCase: 'Traveling salesman, shortest path visiting all nodes, minimum cost to cut sticks', problems: [
        { title: 'Partition to K Equal Sum Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/' },
        { title: 'Minimum Number of Work Sessions', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🔬',
        title: 'The Binary World',
        narrative: `Every number in a computer is a sequence of **bits** — 0s and 1s. The number 13 is stored as 1101 in binary.

Four fundamental operations:
- **AND (&)**: both bits must be 1 → "both conditions true"
- **OR (|)**: at least one bit is 1 → "either condition true"
- **XOR (^)**: bits are different → "exactly one is true"
- **NOT (~)**: flip all bits → "negate"

Plus shifts:
- **Left shift (<<)**: multiply by 2 per shift (5 << 1 = 10)
- **Right shift (>>)**: divide by 2 per shift (10 >> 1 = 5)

These operations run in **O(1)** — a single CPU instruction. Problems that look hard in decimal become trivial in binary.`,
        concept: 'Key bit operations: check bit k: (n >> k) & 1. Set bit k: n | (1 << k). Clear bit k: n & ~(1 << k). Toggle bit k: n ^ (1 << k). Power of 2: n & (n-1) == 0. Brian Kernighan (remove lowest set bit): n & (n-1). Get lowest set bit: n & (-n).',
        codeExample: `// Essential bit operations
const n = 0b1101; // = 13

// Check if bit k is set
(n >> 2) & 1; // = 1 (bit 2 of 13 is set)
(n >> 1) & 1; // = 0 (bit 1 of 13 is not set)

// Set bit k
n | (1 << 1);  // = 0b1111 = 15

// Clear bit k
n & ~(1 << 3); // = 0b0101 = 5

// Toggle bit k
n ^ (1 << 2);  // = 0b1001 = 9

// Power of 2 check
(16 & 15) === 0;  // true (16 is power of 2)
(12 & 11) === 0;  // false (12 is not power of 2)

// Count set bits (Brian Kernighan)
function countBits(n: number): number {
  let count = 0;
  while (n > 0) { n &= (n - 1); count++; } // removes lowest set bit
  return count;
}
// countBits(13) = countBits(0b1101) = 3`,
        tip: '🎯 Interview tip: n & (n-1) removes the lowest set bit. This is used in Kernighan\'s algorithm (count set bits) and power-of-2 check. Memorize both tricks.',
      },
      {
        id: 2,
        emoji: '✨',
        title: 'XOR: The Magic Operator',
        narrative: `XOR has magical properties that solve problems that look impossible at first glance:

**Property 1**: a ^ a = 0 (number XORed with itself = 0)
**Property 2**: a ^ 0 = a (XOR with 0 = identity)
**Property 3**: XOR is commutative and associative

**Single Number**: an array where every element appears twice except one. XOR all elements together — all pairs cancel to 0, leaving just the single number! O(n) time, O(1) space.

**Missing Number**: numbers 0..n with one missing. XOR all indices (0..n) with all values. Pairs cancel, leaving the missing number.

**Find Duplicate**: XOR all indices with all values in an array that has one duplicate — pairs cancel.

Three completely different problems, one technique.`,
        concept: 'XOR is self-inverse (a^a=0), identity (a^0=a), commutative, associative. When you XOR a sequence where every element appears an even number of times except one, the result is that one element. Extend to "two unique elements" by splitting into two groups using XOR\'s lowest set bit.',
        codeExample: `// Single Number — O(n) time, O(1) space
function singleNumber(nums: number[]): number {
  return nums.reduce((xor, n) => xor ^ n, 0);
  // All pairs cancel: 2^2^3^3^5 = 0^0^5 = 5
}

// Missing Number — XOR index with value
function missingNumber(nums: number[]): number {
  let result = nums.length; // XOR with n itself
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i]; // cancel out pairs
  }
  return result;
}

// Single Number III — two elements appear once, rest appear twice
function singleNumberIII(nums: number[]): [number, number] {
  const xorAll = nums.reduce((x, n) => x ^ n, 0);
  // xorAll = a ^ b. Find any bit that differs between a and b:
  const diffBit = xorAll & (-xorAll); // lowest set bit
  // Partition into two groups: those with this bit set and those without
  let a = 0;
  for (const n of nums) if (n & diffBit) a ^= n;
  return [a, xorAll ^ a];
}`,
        tip: '🎯 Interview tip: XOR solves "find the unique/missing element" in O(n) time and O(1) space — much better than HashSet (O(n) space). If you see "every element appears twice except one", think XOR immediately.',
      },
      {
        id: 3,
        emoji: '🎭',
        title: 'Bitmask Tricks for Subsets',
        narrative: `A bitmask is an integer where each bit represents a boolean (included/excluded). For n items, there are 2ⁿ possible subsets, each represented by a number from 0 to 2ⁿ-1.

Enumerate all subsets of [a,b,c]:
- 000 = {}
- 001 = {c}
- 010 = {b}
- 011 = {b,c}
- 100 = {a}
- 101 = {a,c}
- 110 = {a,b}
- 111 = {a,b,c}

To check if element i is in subset mask: (mask >> i) & 1.
To add element i: mask | (1 << i).

This representation is used in **Bitmask DP**: track which items have been used as a bitmask state. For example, Traveling Salesman Problem with n≤20 uses dp[mask][last] — O(2ⁿ × n²) instead of O(n!).`,
        concept: 'Bitmask as state: dp[mask] represents "what\'s the answer when the set of items represented by mask has been used". Iterate all 2^n masks. For each mask, iterate all items to add next. Classic use: minimum cost to visit all nodes (TSP variant), partition into equal-sum subsets.',
        codeExample: `// Enumerate all subsets of an array
function allSubsets(nums: number[]): number[][] {
  const n = nums.length;
  const result: number[][] = [];

  for (let mask = 0; mask < (1 << n); mask++) {
    const subset: number[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) subset.push(nums[i]);
    }
    result.push(subset);
  }
  return result;
}

// Count number of set bits (popcount)
function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) { n >>>= 1; count += n & 1; } // but this is O(32)
  return count;
}

// Faster: Brian Kernighan
function hammingWeightFast(n: number): number {
  let count = 0;
  while (n !== 0) { n &= (n - 1); count++; } // removes lowest set bit
  return count; // only loops once per SET bit, not per total bit
}

// Reverse bits of 32-bit integer
function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>>= 1; // unsigned right shift
  }
  return result >>> 0; // convert to unsigned 32-bit
}`,
        tip: '🎯 Interview tip: n & (n-1) is O(set bits), not O(total bits). For sparse integers with few set bits, it\'s much faster than shifting through all 32 bits. Mention this in interviews — it shows deep understanding.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'What does the expression n & (n-1) do?',
        options: ['Checks if n is even', 'Removes the lowest set bit from n', 'Multiplies n by 2', 'Checks if n is a power of 2'],
        correctIndex: 1,
        explanation: 'n-1 flips all bits from the lowest set bit downward. AND-ing with n clears the lowest set bit. Example: 12 (1100) & 11 (1011) = 1000 = 8 (lowest set bit at position 2 removed). Used in Kernighan\'s bit count algorithm and power-of-2 check (n & n-1 == 0).',
      },
      {
        id: 2,
        question: 'XOR of all numbers from 1 to n, then XOR with all elements in an array of [1..n] with one missing gives:',
        options: ['0', 'The sum of all numbers', 'The missing number', 'The largest number'],
        correctIndex: 2,
        explanation: 'XOR is self-inverse: a^a=0. Every number 1..n appears twice in the combined XOR (once from the index, once from the array) — EXCEPT the missing number which appears only from the index sequence. These all cancel to 0, leaving just the missing number.',
      },
      {
        id: 3,
        question: 'How do you check if the kth bit (0-indexed from right) of number n is set?',
        options: ['n % (k+1) == 0', '(n >> k) & 1', 'n & k', 'n | (1 << k)'],
        correctIndex: 1,
        explanation: 'Shift n right by k positions brings bit k to position 0. Then AND with 1 extracts just that bit. If result is 1, the bit is set; if 0, it\'s not. Example: n=13 (1101), k=2: 13>>2=3 (0011), 3&1=1 ✓',
      },
      {
        id: 4,
        question: 'Using bitmask to represent subsets, how do you check if element i is in the subset represented by mask?',
        options: ['mask % i == 0', '(mask >> i) & 1', 'mask & i', 'mask | (1 << i)'],
        correctIndex: 1,
        explanation: 'Each element i maps to bit position i in the mask. Shift mask right by i to bring bit i to position 0, then AND with 1. If 1: element i is in the subset. If 0: not included. This is the core operation of bitmask DP.',
      },
      {
        id: 5,
        question: 'The "Single Number" problem (every element appears twice except one) can be solved in O(n) time and O(1) space using:',
        options: ['Sorting and scanning', 'A HashSet (insert and check, remove if seen)', 'XOR all elements — pairs cancel to 0, leaving the unique element', 'Prefix sum'],
        correctIndex: 2,
        explanation: 'XOR all elements: pairs cancel (a^a=0), single element remains (a^0=a). O(n) time, O(1) space. HashSet approach is O(n) time but O(n) space. Sorting is O(n log n). XOR is the optimal solution and a classic interview trick.',
      },
    ],
  },

  // ─── Advanced Graphs ───────────────────────────────────────────────────────
  {
    slug: 'advanced-graphs',
    title: 'Advanced Graphs',
    emoji: '🛰️',
    tagline: 'Dijkstra, Union-Find & Topo Sort',
    description: 'Graduate from basic BFS/DFS to weighted shortest paths (Dijkstra), connected components (Union-Find), and dependency ordering (topological sort).',
    color: '#0f766e',
    gradient: 'from-teal-500 to-emerald-600',
    textColor: 'text-teal-600',
    difficulty: 'Advanced',
    timeToComplete: '45 min',
    keyComplexities: [
      { operation: 'Dijkstra (binary heap)', complexity: 'O((V+E) log V)' },
      { operation: 'Union-Find (find)', complexity: 'O(α(n)) ≈ O(1)' },
      { operation: 'Union-Find (union)', complexity: 'O(α(n)) ≈ O(1)' },
      { operation: 'Topological Sort', complexity: 'O(V + E)' },
      { operation: 'Bellman-Ford', complexity: 'O(V × E)' },
    ],
    patterns: [
      { name: 'Dijkstra\'s Algorithm', description: 'Greedy shortest path using a min-heap priority queue on weighted graphs', useCase: 'Network delay time, cheapest flights, path with minimum effort', problems: [
        { title: 'Network Delay Time', difficulty: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/' },
        { title: 'Path With Minimum Effort', difficulty: 'Medium', url: 'https://leetcode.com/problems/path-with-minimum-effort/' },
        { title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
      ]},
      { name: 'Union-Find (DSU)', description: 'Track connected components with near-O(1) union and find via path compression + union by rank', useCase: 'Connected components, cycle detection, Kruskal\'s MST', problems: [
        { title: 'Redundant Connection', difficulty: 'Medium', url: 'https://leetcode.com/problems/redundant-connection/' },
        { title: 'Number of Provinces', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-provinces/' },
        { title: 'Accounts Merge', difficulty: 'Medium', url: 'https://leetcode.com/problems/accounts-merge/' },
      ]},
      { name: 'Topological Sort', description: 'Order nodes so all directed edges go from earlier to later (only on DAGs)', useCase: 'Course schedule, alien dictionary, build dependency order', problems: [
        { title: 'Course Schedule', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule/' },
        { title: 'Course Schedule II', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule-ii/' },
        { title: 'Alien Dictionary', difficulty: 'Hard', url: 'https://leetcode.com/problems/alien-dictionary/' },
      ]},
    ],
    story: [
      {
        id: 1,
        emoji: '🗺️',
        title: 'Dijkstra — The GPS Algorithm',
        narrative: `Google Maps needs the **shortest route** between two cities on a weighted road network. BFS finds shortest by number of edges, but here edges have **weights** (distances). BFS won't work.

Enter **Dijkstra's algorithm** (1956). The insight: greedily process nodes in order of their known shortest distance from the source.

Algorithm:
1. Start: dist[source]=0, dist[all others]=∞
2. Use a **min-heap** ordered by distance
3. Pop the closest unprocessed node
4. Relax all its neighbors: if dist[node] + edge_weight < dist[neighbor], update dist[neighbor]
5. Push updated neighbors into the heap
6. Repeat until heap is empty

The min-heap ensures you always process the globally closest node next — greedy correctness!`,
        concept: 'Dijkstra is greedy: once a node is popped from the heap, its shortest distance is FINAL (no shorter path can exist because all weights are non-negative). Time: O((V+E) log V) with a binary heap. DOES NOT work with negative weights — use Bellman-Ford for those.',
        codeExample: `function dijkstra(graph: Map<number, [number, number][]>, start: number, n: number): number[] {
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;

  // Min-heap: [distance, node]
  const heap: [number, number][] = [[0, start]];

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]); // use real min-heap in production
    const [d, node] = heap.shift()!;

    if (d > dist[node]) continue; // outdated entry, skip

    for (const [neighbor, weight] of (graph.get(node) ?? [])) {
      const newDist = dist[node] + weight;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        heap.push([newDist, neighbor]);
      }
    }
  }
  return dist; // dist[i] = shortest distance from start to i
}

// Network Delay Time: min time for signal to reach all nodes
function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph = new Map<number, [number, number][]>();
  for (const [u, v, w] of times) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u)!.push([v, w]);
  }
  const dist = dijkstra(graph, k, n + 1);
  const max = Math.max(...dist.slice(1)); // nodes 1..n
  return max === Infinity ? -1 : max;
}`,
        tip: '🎯 Interview tip: Dijkstra = BFS + weighted edges + min-heap. BFS uses a regular queue (FIFO). Dijkstra uses a min-heap (priority queue by distance). That\'s the only fundamental difference.',
      },
      {
        id: 2,
        emoji: '🔗',
        title: 'Union-Find — Connected Components',
        narrative: `You have a social network. People arrive and form friendships. At any point, answer: "Are Alice and Bob in the same friend group?"

The naive approach: rebuild the connected components from scratch after each friendship — O(n) per query. Terrible for a live network.

**Union-Find** (Disjoint Set Union) solves this in near-O(1):
- **find(x)**: return the "representative" (root) of x's component
- **union(x, y)**: merge the components of x and y

With two optimizations:
- **Path compression**: make every node point directly to the root (flatten the tree)
- **Union by rank**: always merge smaller tree under larger tree (keep trees flat)

Both optimizations together give amortized O(α(n)) ≈ O(1) — the inverse Ackermann function. Practically, it's faster than any real-world scenario can distinguish from O(1).`,
        concept: 'Union-Find: parent array where parent[i] = i means i is a root. find() walks to root (with path compression). union() connects two roots (by rank). After m operations: O(m × α(n)) ≈ O(m). Used for: connected components, cycle detection in undirected graphs, Kruskal\'s MST.',
        codeExample: `class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const px = this.find(x), py = this.find(y);
    if (px === py) return false; // already connected
    // Union by rank
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else { this.parent[py] = px; this.rank[px]++; }
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// Redundant Connection: find the edge creating a cycle
function findRedundantConnection(edges: number[][]): number[] {
  const uf = new UnionFind(edges.length + 1);
  for (const [u, v] of edges) {
    if (!uf.union(u, v)) return [u, v]; // already connected = redundant!
  }
  return [];
}`,
        tip: '🎯 Interview tip: Union-Find detects cycles in UNDIRECTED graphs. If union(u,v) returns false (they\'re already connected), the edge (u,v) creates a cycle. This is the basis of Kruskal\'s MST algorithm.',
      },
      {
        id: 3,
        emoji: '📋',
        title: 'Topological Sort — Dependency Order',
        narrative: `"Course Schedule": you have courses with prerequisites (course B requires course A first). Is it possible to take all courses? What order?

This is **topological sort**: order a directed acyclic graph (DAG) so all edges go from earlier to later nodes. If there's a cycle, topological sort is impossible.

**Kahn's Algorithm (BFS-based)**:
1. Count in-degrees of all nodes
2. Add all nodes with in-degree 0 to a queue (no prerequisites)
3. Process queue: take a node, add it to result, decrement neighbors' in-degrees
4. When a neighbor's in-degree hits 0, add it to queue
5. If result length < n: there's a cycle!

**DFS-based**: do DFS, add each node to the FRONT of result after visiting all its neighbors (post-order, reversed).`,
        concept: 'Kahn\'s algorithm: topological sort via BFS on in-degrees. Detects cycles: if output has fewer nodes than input, a cycle exists. DFS approach: nodes added to result in reverse finish order. Both are O(V+E). Used for: course prerequisites, build systems, package dependencies, compilation order.',
        codeExample: `// Course Schedule II — find order or detect cycle
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const inDegree = new Array(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);

  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }

  // Kahn's algorithm
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i); // no prerequisites
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const course = queue.shift()!;
    order.push(course);
    for (const next of adj[course]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  // If we couldn't process all courses, there's a cycle
  return order.length === numCourses ? order : [];
}`,
        tip: '🎯 Interview tip: Topological sort → immediately think "is this a DAG?" and "use Kahn\'s (BFS with in-degrees)". Kahn\'s is easier to implement than DFS-based and directly gives you cycle detection for free.',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'Why does Dijkstra\'s algorithm NOT work with negative edge weights?',
        options: ['It uses floating point arithmetic', 'Once a node is finalized, a negative-weight edge could later provide a shorter path, invalidating the greedy assumption', 'Negative weights don\'t exist in practice', 'The min-heap can\'t store negative values'],
        correctIndex: 1,
        explanation: 'Dijkstra\'s correctness relies on: once a node is popped from the min-heap, its distance is final. With negative edges, a later path via negative edges might be shorter. This violates the greedy assumption. Use Bellman-Ford (O(VE)) for negative weights, or SPFA.',
      },
      {
        id: 2,
        question: 'What do the two Union-Find optimizations (path compression + union by rank) achieve?',
        options: ['O(1) worst case per operation', 'Amortized O(α(n)) ≈ O(1) per operation — inverse Ackermann, effectively constant', 'O(log n) guaranteed per operation', 'O(√n) per operation'],
        correctIndex: 1,
        explanation: 'Path compression flattens the tree during find(), making future finds faster. Union by rank keeps trees short by always merging shorter under taller. Together: amortized O(α(n)) where α is the inverse Ackermann function — grows so slowly it\'s ≤5 for any practical n.',
      },
      {
        id: 3,
        question: 'In Kahn\'s topological sort algorithm, if the output has fewer nodes than the graph, it means:',
        options: ['The algorithm has a bug', 'There is a cycle in the graph — topological sort is impossible', 'Some nodes were disconnected', 'The input was not sorted'],
        correctIndex: 1,
        explanation: 'Kahn\'s processes nodes by removing those with in-degree 0. Nodes in a cycle never reach in-degree 0 (they depend on each other). So if output.length < n, the remaining unprocessed nodes form one or more cycles — proving the graph is not a DAG.',
      },
      {
        id: 4,
        question: 'The time complexity of Dijkstra\'s algorithm with a binary min-heap is:',
        options: ['O(V²)', 'O(E log V)', 'O((V + E) log V)', 'O(V log V)'],
        correctIndex: 2,
        explanation: 'Each vertex is extracted from the heap once: V extractions × O(log V) each = O(V log V). Each edge causes at most one heap insertion: E insertions × O(log V) each = O(E log V). Total: O((V+E) log V). With a Fibonacci heap: O(E + V log V) but rarely used in practice.',
      },
      {
        id: 5,
        question: 'Union-Find is preferred over BFS/DFS for connected components when:',
        options: ['The graph is directed', 'You need to process edges one at a time online (streaming) and query connectivity after each', 'The graph has negative weights', 'You need the actual path between nodes'],
        correctIndex: 1,
        explanation: 'BFS/DFS needs the entire graph built first. Union-Find handles streaming edges: add edge (u,v) → call union(u,v). Query if nodes are connected → call find() and compare roots. Each operation is near-O(1). Perfect for "as edges arrive, maintain connected components" problems.',
      },
    ],
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find(t => t.slug === slug);
}
