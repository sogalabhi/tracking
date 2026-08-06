# Study Tracker OA Pro - User Guide & Revision Master Playbook

## 1. Introduction and Philosophy

Study Tracker OA Pro is engineered to streamline interview preparation for Data Structures & Algorithms (DSA), SQL, Machine Learning (ML), Core Computer Science, and System Design. 

The core philosophy combines structured curriculum progression with scientific spaced repetition (SM-2 decay memory model) and live timer banking. This ensures that concepts learned early in preparation remain active in long-term memory leading up to online assessments (OAs) and technical interviews.

---

## 2. Spaced Repetition Engine and Revision Rules

The Spaced Repetition Engine governs when and how problem items reappear for review. Instead of relying on random review or static re-solving, review intervals expand dynamically based on recall confidence.

### The 4 Revision Queue Triggers

An item is automatically included in your Revision Queue if any of the following four conditions are met:

1. Manual Bookmark Flag (`revisionFlag: true`):
   Checking the "Rev" box on any problem row forces the item directly into the Revision Queue regardless of scheduled dates or completion status.

2. Scheduled Revision Date Reached (`nextDue <= today`):
   When a completed problem reaches or passes its calculated `nextDue` date, it enters the queue.

3. Solved Item Without a Scheduled Date (`done: true` and `nextDue: null`):
   Any item marked done without a spaced repetition interval is queued for initial review.

4. Low Confidence Score (`confidence <= 2`):
   Items rated 1 or 2 stars remain flagged for high-frequency review.

### Confidence Rating Matrix

Every problem item features a 5-star confidence rating scale. Rating a problem updates its review interval as follows:

- 1 Star (Need Practice / Unsolved):
  Interval: 1 Day
  Appears for re-evaluation tomorrow. Use this when a problem required looking at the editorial, had syntax bugs, or took longer than acceptable time limits.

- 2 Stars (Fair / Solved with Hints):
  Interval: 2 Days
  Use this when the overall logic was correct but implementation required minor hints or debugging assistance.

- 3 Stars (Good / Solved Independently):
  Interval: 4 Days
  Use this when solved completely independently within standard time limits (20-30 minutes).

- 4 Stars (Strong / Optimal Solution):
  Interval: 7 Days (1 Week)
  Use this when the optimal time and space complexities were achieved effortlessly and edge cases were handled cleanly.

- 5 Stars (Mastered / Flawless Recall):
  Interval: 21 Days (3 Weeks)
  Use this for foundational patterns or problems you can explain and code instantly without hesitation.

### Queue Priority and Decay Urgency

Items in the Revision Queue are sorted by decay urgency:
1. Manual revision flags are prioritized at the top of the queue.
2. Scheduled items are ordered by `nextDue` date ascending (oldest overdue items appear first).

---

## 3. Daily Preparation Workflow

To maximize retention and study efficiency, follow this 4-step daily workflow:

### Step 1: Inspect Today Dashboard and Revision Queue
Start your day on the Today View. Review your daily study target progress, study streak count, and the number of items due for revision in the Revision Queue.

### Step 2: Clear Due Revisions First
Open the Revision View. Re-solve or mentally trace the optimal approach for items due today before starting new concepts. Rate your confidence after reviewing each item to update its next revision interval.

### Step 3: Use the Live Yeolpumta Study Timer
When starting a study block, click the Timer button on a specific topic accordion or item row. The top navigation bar widget tracks active study time. Pause (`Space`), resume, or bank session time (`Square`) when finished.

### Step 4: Progress Through New Curriculum Problems
Navigate to the Tracker View. Open topic accordions and access problem links (LeetCode, TakeUForward articles, video solutions). Take concise approach notes in the inline notes editor, record key takeaways, and update completion status.

---

## 4. Curriculum Breakdown

The platform comes pre-loaded with curated curriculums:

### Data Structures & Algorithms (Striver A2Z Sheet - 473 Problems)
- Learn the Basics & Math: 41 problems covering I/O, control flow, functions, basic math, and pattern logic.
- Sorting Techniques: 8 problems covering Selection, Bubble, Insertion, Merge, Quick, and Recursive variants.
- Arrays (Easy, Medium, Hard): 37 problems covering Two Sum, Kadane's, Sort Colors, Next Permutation, Pascal's Triangle, 3Sum, 4Sum, and Subarray Sum K.
- Binary Search (1D, Answer Space, 2D): 34 problems covering Search in Rotated Arrays, Koko Bananas, Book Allocation, Gas Stations, and Matrix Search.
- Strings: 17 problems covering Anagrams, Atoi, Reverse Words, and Palindromes.
- Linked List: 32 problems covering Singly/Doubly LL, Cycle Detection, Reversal, Flattening, and LRU/LFU Cache.
- Recursion & Backtracking: 18 problems covering Subsets, Permutations, Combination Sum, N-Queens, and Sudoku Solver.
- Bit Manipulation: 17 problems covering Set/Clear Bit, Single Number, and Subsets.
- Stack & Queue: 27 problems covering Infix/Postfix Conversions, Monotonic Stack, Trapping Rainwater, and Histograms.
- Sliding Window & Two Pointer: 8 problems covering Variable and Fixed Window patterns.
- Heaps & Priority Queue: 19 problems covering Top K Frequent, Kth Largest, and Median in Data Stream.
- Greedy Algorithms: 52 problems covering N Meetings, Jump Game, Job Sequencing, and Minimum Platforms.
- Binary Trees & BST: 41 problems covering Traversals, Views, Path Sums, and BST Validation.
- Graphs: 51 problems covering BFS/DFS, Topological Sort, Shortest Paths (Dijkstra, Bellman-Ford), and Disjoint Set.
- Dynamic Programming: 50 problems covering 1D DP, Grid DP, Knapsack, LCS, LIS, MCM, and Partition DP.
- Tries: 8 problems covering Prefix Tree implementation and Maximum XOR patterns.

### SQL 50 Curated Collection
Includes 50 essential SQL problems covering Select, Joins, Aggregation, Group By, Window Functions, and String/Regex manipulations.

### Machine Learning & Data Manipulation
Covers Supervised Fundamentals, Ensemble Methods, Feature Engineering, Deep Learning Core, and Pandas Dataframe operations.

### Computer Science Core Fundamentals
Includes curated review items for Operating Systems (Processes, Threads, Memory Management), DBMS (Indexing, Transactions, Normalization), and Computer Networks (TCP/IP, HTTP, DNS).

---

## 5. Tracker View Controls

- Default Accordion State: Topic accordions are collapsed by default upon opening the Tracker View to maintain a clean layout.
- Expand All / Collapse All: Toggle all topic accordions simultaneously using the control button next to the search input.
- Global Search Bar: Press `/` to focus the search bar. Search matches problem titles, category keywords, and user notes.
- Quick Filter Pills:
  - All Items: Display all items in the selected subject.
  - Not Started / Incomplete: Filter for unsolved items.
  - Flagged Revision: Filter items with active revision bookmarks.
  - Confidence <= 2: Filter items requiring practice.
  - Never Revised: Filter completed items that have not been revised yet.

---

## 6. Time Management and Goal Tracking

### Daily Target Hours
Configure your daily minimum and maximum study target hours in the Data & Settings View. The progress bar in the top navigation bar updates live as timer sessions are banked.

### D-Day Exam Countdown
Set an upcoming exam or assessment date in Data & Settings. The D-Day widget in the top header calculates remaining days to keep preparation on schedule.

### Study Streak Calculation
Study streaks track consecutive days with banked study sessions. Missing a calendar day resets the streak.

---

## 7. Data Backup and Restore Operations

All application data (items, topics, subtopics, study sessions, and settings) is stored locally in your browser's LocalStorage (`study_tracker_items_v1`, `study_tracker_sessions_v1`).

### Exporting Backup (JSON)
1. Open the Data tab from the top navigation.
2. Click Export Data (JSON).
3. Save the generated `.json` backup file to a safe location.

### Importing Backup (JSON)
1. Open the Data tab.
2. Click Import Data (JSON) and select your previously exported backup file.
3. The application will validate the schema and restore all items, notes, timer history, and progress.

---

## 8. Complete Keyboard Shortcuts Reference

- `/` : Focus global search input in Tracker View
- `Space` : Toggle active study timer (Pause / Resume)
- `?` : Open Keyboard Shortcuts reference modal
- `1` : Navigate to Today View
- `2` : Navigate to Tracker View
- `3` : Navigate to Planner View
- `4` : Navigate to Revision View
- `5` : Navigate to Calendar View
- `6` : Navigate to Insights View
- `7` : Navigate to Data & Settings View
- `Esc` : Close open modals or clear search focus
