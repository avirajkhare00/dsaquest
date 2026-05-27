# 🧠 DSAQuest

> **Master Data Structures & Algorithms through stories, interactive visualizers, and quizzes — interview-ready, one topic at a time.**

Live at → [dsaquest.vercel.app](https://dsaquest.vercel.app) *(deploy via Vercel — see below)*

---

## ✨ What is DSAQuest?

DSAQuest is an interactive DSA learning platform built for **interview prep**. Instead of dry definitions, every topic is taught through:

- 📖 **Story-driven chapters** — each concept lands in a memorable narrative (the Library of Alexandria for Arrays, a GPS for Dijkstra, etc.)
- 🎮 **Interactive visualizers** — step through algorithms live: sort bars animate, graph nodes light up, tries branch before your eyes
- 🧠 **Quiz per topic** — 5 interview-style questions with instant feedback and explanations
- 📊 **Progress tracking** — chapters read and quiz scores saved to localStorage; completion badges on every card
- 🔗 **LeetCode links** — 3 curated problems per pattern, with difficulty labels, clickable straight to LeetCode
- 🌙 **Dark mode** — system preference auto-detected, manual toggle in the navbar
- 🔍 **Search & filter** — search by topic name, description, or pattern; filter by difficulty

---

## 📚 Topics (13 total)

| # | Topic | Difficulty | Key Patterns |
|---|-------|------------|--------------|
| 1 | 📦 Arrays & Strings | Beginner | Two Pointers, Sliding Window |
| 2 | 🔗 Linked Lists | Beginner | Tortoise & Hare, Reversal |
| 3 | 🔄 Sorting Algorithms | Beginner | Bubble, Merge, Quick Sort |
| 4 | 🌳 Trees & BST | Intermediate | DFS, BFS, Traversals |
| 5 | 🏨 Hash Tables | Beginner | Frequency Counter, Two-Sum |
| 6 | 🗺️ Graphs | Intermediate | BFS, DFS |
| 7 | 🤖 Dynamic Programming | Intermediate | Memoization, Tabulation, 2D DP |
| 8 | 🏥 Heaps & Priority Queues | Intermediate | Top-K, Merge K Sorted |
| 9 | 🌿 Tries | Intermediate | Prefix Matching, Word Search |
| 10 | 🔮 Backtracking | Advanced | Subsets, Permutations, N-Queens |
| 11 | 💚 Greedy Algorithms | Intermediate | Interval Scheduling, Jump Game |
| 12 | ⚡ Bit Manipulation | Intermediate | XOR Magic, Bitmask Subsets |
| 13 | 🕸️ Advanced Graphs | Advanced | Dijkstra, Union-Find, Topo Sort |

---

## 🎮 Visualizer Highlights

| Topic | Modes |
|-------|-------|
| Arrays | Access O(1), Linear search, Two-pointer, Sliding window |
| Linked Lists | Traverse, Fast/slow pointers (cycle detect), Reverse |
| Sorting | Bubble · Merge · Quick (animated bars, play/pause, speed) |
| Trees | Inorder · Preorder · Postorder · BFS · Search · Insert |
| Hash Tables | Insert (hash fn), Lookup, Frequency map, Two-sum |
| Graphs | BFS (queue) · DFS (stack) on 7-node undirected graph |
| Dynamic Programming | Fibonacci table · Climbing Stairs · Coin Change |
| Heaps | Bubble-up (insert) · Sink-down (extract-min) · Top-K |
| Tries | Search · Autocomplete (prefix + DFS collect) · Insert |
| Backtracking | Subsets · Permutations · Combination Sum (step-by-step) |
| Greedy | Interval timeline · Jump Game reachability · Stock chart |
| Bit Manipulation | AND/OR/XOR/NOT/shifts · XOR single-number · Bitmask subsets slider |
| Advanced Graphs | Dijkstra distances · Union-Find parent array · Kahn's topo sort |

---

## 🛠️ Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Fonts | Geist Sans / Geist Mono |
| State | React `useState` / `useCallback` |
| Persistence | `localStorage` via custom `useProgress` hook |
| Deploy | Vercel (`vercel.json` included) |

---

## 🚀 Getting Started

```bash
git clone https://github.com/avirajkhare00/dsaquest.git
cd dsaquest
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub (already done)
2. Go to [vercel.com/new](https://vercel.com/new) → import `avirajkhare00/dsaquest`
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy** — done in ~60 seconds

---

## 📁 Project Structure

```
dsaquest/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── topics/
│   │   ├── page.tsx              # All topics listing (server component)
│   │   └── [slug]/page.tsx       # Individual topic (learn/visualize/quiz tabs)
│   ├── layout.tsx                # Root layout (ThemeProvider + Navbar + footer)
│   └── globals.css               # Tailwind 4, CSS variables, dark mode, animations
├── components/
│   ├── Navbar.tsx                # Sticky nav + dark mode toggle
│   ├── ThemeProvider.tsx         # Dark/light context + localStorage
│   ├── TopicCard.tsx             # Card with progress badge
│   ├── TopicsGrid.tsx            # Client: search + difficulty filter + progress summary
│   ├── StoryReader.tsx           # Chapter reader with progress callback
│   ├── QuizComponent.tsx         # Quiz with scoring + completion callback
│   └── visualizers/
│       ├── ArrayViz.tsx
│       ├── LinkedListViz.tsx
│       ├── SortingViz.tsx
│       ├── TreeViz.tsx
│       ├── HashTableViz.tsx
│       ├── GraphViz.tsx
│       ├── DPViz.tsx
│       ├── HeapViz.tsx
│       ├── TrieViz.tsx
│       ├── BacktrackingViz.tsx
│       ├── GreedyViz.tsx
│       ├── BitViz.tsx
│       └── AdvancedGraphViz.tsx
├── data/
│   └── topics.ts                 # All 13 topics: story, quiz, patterns, LeetCode links
├── hooks/
│   └── useProgress.ts            # localStorage progress hook
└── vercel.json                   # Vercel deployment config
```

---

## 🤝 Contributing

Pull requests welcome! To add a new topic:

1. Add a `Topic` entry to `data/topics.ts` (story, quiz, patterns, LeetCode links)
2. Create `components/visualizers/YourTopicViz.tsx`
3. Add a `case 'your-slug': return <YourTopicViz />;` in `app/topics/[slug]/page.tsx`

---

*Built with ❤️ for interview warriors. Go get that offer! 💪*
