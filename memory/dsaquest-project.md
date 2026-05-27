---
name: dsaquest-project
description: DSAQuest — interactive DSA learning platform built in this project
metadata:
  type: project
---

Interactive DSA learning platform built with Next.js 16 (App Router), React 19, Tailwind 4, TypeScript.

**Style**: Playful & colorful (indigo/pink/amber/emerald), interview-prep focus.

**Routes:**
- `/` — Landing page hero + topic cards + learning path
- `/topics` — All topics grid
- `/topics/[slug]` — Topic page with 3 tabs: Learn / Visualize / Quiz

**Topics implemented:** Arrays, Linked Lists, Sorting, Trees & BST (4 topics, 3 story chapters each, 5 quiz questions each)

**Key files:**
- `data/topics.ts` — All topic data (stories, complexities, patterns, quiz questions)
- `components/Navbar.tsx` — Sticky top nav
- `components/TopicCard.tsx` — Topic card for grids
- `components/StoryReader.tsx` — Tabbed story chapters with code examples and interview tips
- `components/QuizComponent.tsx` — Interactive quiz with scoring and review
- `components/visualizers/ArrayViz.tsx` — Array: access, search, two-pointer, sliding window
- `components/visualizers/LinkedListViz.tsx` — LL: traverse, fast/slow pointers, reverse
- `components/visualizers/SortingViz.tsx` — Bubble/Merge/Quick sort with animated bars
- `components/visualizers/TreeViz.tsx` — BST: in/pre/post-order, BFS, search, insert (SVG)

**To add more topics:** add a `Topic` object to `data/topics.ts` and a case in the `getVisualizer()` switch in `app/topics/[slug]/page.tsx`.

**Why**: user (Aviraj) wants to build an interactive DSA learning platform with stories, interview-ready patterns, and visualizations. Target: interview prep audience.
