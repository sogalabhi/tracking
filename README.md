# Study Tracker OA Pro

Study Tracker OA Pro is a specialized study management and spaced repetition platform designed for software engineering interview preparation, covering Data Structures & Algorithms (DSA), SQL, Machine Learning, Computer Science Core Fundamentals, and System Design.

For a detailed breakdown of spaced repetition rules, curriculum strategy, and usage guidelines, see the [User Guide and Master Playbook](USER_GUIDE.md).

## Tech Stack

- Frontend: React 18, Vite
- Styling: Tailwind CSS, Vanilla CSS
- Icons: Lucide React
- Persistence: LocalStorage with JSON Import/Export capabilities

## Key Features

### 1. Complete Striver A2Z DSA Sheet Dataset
- Includes all 473 curated problems from Striver's A2Z DSA Sheet.
- Organized into 18 structured subtopics: Arrays, Binary Search, Linked List, Recursion & Backtracking, Bit Manipulation, Stack & Queue, Sliding Window & Two Pointer, Heaps, Greedy Algorithms, Binary Trees & BST, Graphs, Dynamic Programming, and Tries.
- 100% direct practice URLs referencing official LeetCode problem pages, TakeUForward article editorials, and video solutions.

### 2. Spaced Repetition Engine
- Calculates review dates automatically based on confidence levels (1 to 5 stars):
  - Confidence 1 (Need Practice): 1 Day interval
  - Confidence 2 (Fair): 2 Days interval
  - Confidence 3 (Good): 4 Days interval
  - Confidence 4 (Strong): 7 Days (1 Week) interval
  - Confidence 5 (Mastered): 21 Days (3 Weeks) interval
- Overdue queue sorting prioritizing items by decay urgency.
- Manual revision flags for bookmarking critical problems.

### 3. Integrated Study Timer
- Yeolpumta-style stopwatch timer for subjects, topics, or specific problem items.
- Live top-bar timer widget supporting pause, resume, and session banking.
- Automatic session logging mapped to daily study analytics.

### 4. Interactive Views and Dashboard

#### Today View
- Daily target progress bar tracking hours against daily goals.
- Consecutive study streak calculator.
- Quick action cards for upcoming revision items.

#### Tracker View
- Subject selector covering DSA, SQL, ML, Pandas, CS Core, and Projects.
- Topic accordions collapsed by default for clean navigation.
- Global search bar for searching problem titles, keywords, and user notes.
- Quick filter pills for All Items, Incomplete, Flagged Revision, Low Confidence, and Never Revised.
- Expand All and Collapse All toggle controls.
- Problem rows with attempt counters, confidence rating, revision bookmarking, direct problem links, and inline notes editor.

#### Revision View
- Dedicated queue displaying all items due for revision today under spaced repetition algorithms.
- Sorted by oldest overdue date first.

#### Planner View
- Daily and weekly target management.
- Goal tracking and countdown timers for target dates (D-Day).

#### Calendar View
- Visual monthly study log and heatmap.
- Historical study session inspection.

#### Insights & Analytics View
- Visual charts breaking down study time by subject and category.
- Daily hour distributions and streak analytics.

#### Data & Settings View
- Full JSON export and import for data backup and restoration.
- Configuration for daily study hour targets (min/max) and D-Day target exam dates.
- Option to reset workspace or re-seed data.

### 5. Keyboard Shortcuts
- Search focus: Press `/`
- Timer toggle: Press `Space`
- Navigation: Number keys `1` through `7` for view switching
- Shortcuts help modal: Press `?`

### 6. Theme Customization
- Dynamic dark mode and pastel light mode toggling.

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

### Production Build

```bash
npm run build
```
