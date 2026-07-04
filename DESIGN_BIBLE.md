# ARAMBH DESIGN BIBLE v1.0

**The Definitive Product Specification for a Premium RPG Coding Academy**

> This document is the single source of truth for Arambh. Every feature, component, animation, interaction, and screen must conform to this bible. No exceptions.

---

## SECTION 1 — PRODUCT PHILOSOPHY

### Core Philosophy

Arambh is not a learning management system. It is a living fantasy world where Python mastery is the reward for completing an adventure. The player should never feel like they are "taking a course." They should feel like they are exploring a kingdom, defeating bosses, collecting artifacts, and becoming a legend — and Python fluency is the natural consequence.

**One sentence**: *Learning is the adventure, not the homework.*

### Product Principles

1. **Adventure First, Curriculum Second.** Every screen is a location in the world. Every lesson is a quest. Every concept is a power. The curriculum is invisible — the world *is* the curriculum.
2. **Earned, Not Given.** Nothing in Arambh is handed freely. XP is earned through effort. Artifacts are won through mastery. Titles are claimed through consistency. The player must feel that every reward was *deserved*.
3. **One Click to Action.** From any screen, the player should be exactly one click away from their next meaningful action. The Dashboard's primary job is to answer: "What should I do right now?"
4. **Quiet When Working, Loud When Winning.** During lessons and coding, the UI retreats. Sidebars collapse. Distractions vanish. But when the player succeeds — XP bursts, the screen shakes, gold particles fly. Victory is never silent.
5. **Consistency Is Identity.** Every card, button, modal, and transition must feel like it belongs to the same world. A player should recognize an Arambh screen from a 100px thumbnail.
6. **Respect the Player's Time.** No artificial gates, no clickbait streaks, no manipulative dark patterns. Every retention mechanic must serve genuine learning. If a player finishes in 30 days, celebrate them — don't slow them down.

### Emotional Goals

| Moment | Desired Emotion |
|---|---|
| First visit | Awe, curiosity — "This isn't like other coding sites" |
| Registration | Anticipation — "I'm about to begin something" |
| Character creation | Identity — "This is MY character" |
| First lesson | Flow — "I get this, and it feels good" |
| First correct answer | Satisfaction — a burst of gold and sound |
| First wrong answer | Determination — "Let me try again" (never shame) |
| First level up | Pride — "I'm getting stronger" |
| First boss defeat | Triumph — an earned, cinematic moment |
| Daily return | Belonging — "My streak, my guild, my world" |
| Long absence return | Welcome back — "We missed you, here's where you left off" |

### Learning Philosophy

- **Visual memory over rote memorization.** Every Python concept maps to a tangible world element (variables = forest trees, loops = desert winds, functions = mountain paths).
- **Spaced repetition is built into the world.** The Memory Vault is not a study tool — it is an ancient library where knowledge fades unless revisited.
- **Failure is feedback, not punishment.** Wrong answers never cost XP. They provide hints and explanations. The boss doesn't kill you — it sends you back to train.
- **Active recall over passive reading.** Every lesson ends with a challenge. Every region ends with a boss. Knowledge is tested, not just presented.

### Game Philosophy

- **RPG Progression, Not Idle Clicker.** Levels mean something. Each level unlocks tangible rewards (titles, artifacts, stat boosts). There are no meaningless numbers.
- **World Coherence.** The 12 regions follow a deliberate pedagogical sequence disguised as a geographic journey. The world map is the syllabus.
- **Guild System = Accountability.** Guilds aren't social features for vanity — they create peer accountability. Guild members see each other's streaks and progress.

### Design Philosophy

- **Dark fantasy aesthetic.** Near-black backgrounds (#050505), warm gold accents (#FFE8DB), brass metallics (#D4B76E). No pure white surfaces. No bright primary colors.
- **Typography tells the story.** Playfair Display for headings (medieval authority), DM Sans for body (modern readability), JetBrains Mono for code (technical precision).
- **Restraint over decoration.** One glow effect per card, not three. One animation per interaction, not five. The signature element is the gold-on-black contrast — everything else stays quiet.

---

## SECTION 2 — PLAYER JOURNEY

### Phase 1: Discovery (First Visit → Registration)

**Login/Register Screen**
- The player sees a dark scene with a brass desk lamp. The lamp is already on (no waiting for animations).
- The form appears immediately to the right. No obstacles between the player and action.
- Emotional state: *Intrigue.* "This feels different from every other coding platform."

**Registration Flow**
- Three fields only: username, email, password. No phone, no address, no CAPTCHA unless abuse detected.
- "CREATE CHARACTER" button — not "Sign Up." The language is always in-world.
- On submit: instant redirect to onboarding. No email verification gate for beta.

### Phase 2: Identity (Character Creation)

**Welcome Screen (Step 1)**
- A cinematic card with the Arambh emblem pulsing gently.
- Headline: "Master Python Through Visual Adventures"
- Single CTA: "Begin Your Quest →"
- Emotional state: *Anticipation building.*

**Archetype Selection (Step 2)**
- Three classes: Python Mage, Automation Rogue, Data Warrior.
- Each class card shows: icon, name, one-sentence description, visual accent color.
- Selection triggers a golden border glow and subtle scale-up.
- CTA changes from disabled gray to gold when a class is selected.
- On confirm: redirect to first lesson (variables-forest/v1). No extra steps.
- Emotional state: *Ownership.* "This is my character, my path."

### Phase 3: First Victory (First Lesson → First Level Up)

**First Lesson: "What is a Variable?"**
- The lesson page shows a step-by-step visual walkthrough with code.
- Monaco editor appears for interactive exercises.
- On correct code execution: +50 XP toast flies from the code editor to the XP bar in the navbar.
- On lesson completion: a victory overlay with:
  - XP gained (animated counter: 0 → 50)
  - "Variables Forest: 1/4 lessons complete"
  - CTA: "Continue to next lesson" or "Return to map"

**First Level Up**
- When cumulative XP crosses the threshold, a full-screen modal appears:
  - Dark overlay with golden particles
  - "LEVEL 2" in large Playfair Display
  - The level badge animates from old → new
  - Unlocked rewards listed below
  - A single "Continue" button
- This is the most important emotional moment in early retention. It must feel *earned and epic.*

### Phase 4: Mastery (Region Completion → Boss Battles)

**Region Boss Battle**
- Available only after all 4 lessons in a region are complete.
- A series of challenge questions testing all concepts from the region.
- On victory: Artifact reveal animation (the region's unique artifact materializes).
- On defeat: "You need more training. Review these concepts:" with direct links to relevant lessons.

### Phase 5: Daily Return (Streaks → Guild → Daily Quests)

**The Daily Loop**
1. Player opens Arambh → Dashboard loads
2. Dashboard shows: streak counter, daily quests (3 per day), login reward calendar
3. Player claims daily reward (one click)
4. Player sees "Continue Learning" card pointing to their active lesson
5. Player completes one quest → toast notification → XP gained
6. Session time: 15-30 minutes target

**The Weekly Loop**
- Guild progress resets weekly. Members see a shared progress bar.
- Weekly boss challenges rotate across regions.
- Leaderboard resets weekly to keep competition fresh.

### Phase 6: Long-term Progression

**The 12-Region Journey**
```
Variables Forest → Data Types Valley → Loops Desert → Functions Mountain →
Collections Kingdom → OOP Citadel → Exception Abyss → File System Ruins →
Modules Harbor → Algorithm Arena → Iterator Isles → Boss Gate Saga
```
- Estimated total: 48 lessons + 12 boss battles
- Target completion: 8-16 weeks at 3-5 sessions/week
- Post-completion: Infinite Tower (endless challenges), Guild leadership, mentoring new players

---

## SECTION 3 — INFORMATION ARCHITECTURE

### Navigation Hierarchy

**Rule: One navigation system per viewport, never two simultaneously.**

#### Desktop (≥1024px): Left Sidebar + Status Bar

The sidebar is the primary navigation. The top bar is a status strip (not navigation).

**Top Status Bar (56px, fixed)**
- Left: PYQUEST brand mark (links to dashboard)
- Center: (empty — no nav links here)
- Right: Streak indicator | Level circle + XP | Tour button | Logout

**Left Sidebar (240px, sticky)**
```
┌─────────────────────┐
│ ⚡ PyQuest           │  ← Brand + logo
├─────────────────────┤
│ 📊 Dashboard        │  ← Primary nav group
│ 🗺️ World Map        │
│ ⚔️ Training         │
│ 📚 Library          │
│ 🧠 Memory Vault     │
│ 🏆 Artifacts        │
│ 📋 Leaderboard      │
├─────────────────────┤
│ 🏰 Guild Hall       │  ← Social nav group
│ 🔮 Oracle Hub       │
│ 🗼 Infinite Tower   │
├─────────────────────┤
│ ⚙️ Settings         │  ← Bottom utilities
│ 🚪 Logout           │
└─────────────────────┘
```

#### Tablet (768px–1023px): Collapsible Sidebar + Top Bar
- Sidebar collapsed to icon-only rail (56px) by default
- Expands on hover or hamburger tap
- Top bar shows brand + player stats

#### Mobile (<768px): Top Bar + Bottom Tab Bar
- Top bar: brand (left), streak + XP + logout (right)
- Bottom tab bar (5 items max): Home, Map, Train, Library, Vault
- All other navigation accessible via a "More" drawer or from within pages

### Navigation Rules

1. **Active state**: Gold text + gold left-edge indicator (sidebar) or gold underline (top bar).
2. **Spring-animated indicator**: The active indicator uses `layoutId` for smooth sliding between items.
3. **No duplicate routes**: "World Map" and "Learning Map" are unified under "World Map" (single entry point).
4. **Lesson immersion mode**: During active lessons, the sidebar auto-collapses to maximize coding space. A small expand button remains.
5. **Breadcrumbs in content pages**: Lesson pages show: `World Map → Variables Forest → Lesson 1: What is a Variable?`

---

## SECTION 4 — DESIGN SYSTEM

### Color Tokens

#### Primary Palette
| Token | Hex | Usage |
|---|---|---|
| `near-black` | `#050505` | App background, deepest surfaces |
| `surface-1` | `#0A0A0A` | Sidebar background, card backgrounds |
| `surface-2` | `#111111` | Elevated cards, hover states |
| `surface-3` | `#1A1A1A` | Input backgrounds, secondary surfaces |
| `warm-white` | `#F4F4F5` | Primary text, headings |
| `mid-gray` | `#94A3B8` | Secondary text, labels, captions |
| `gold` | `#FFE8DB` | Primary accent, CTAs, active states, XP |
| `gold-muted` | `#D4B76E` | Brass accents, borders, secondary gold |
| `royal-blue` | `#5682B1` | Information, links, secondary accent |

#### Semantic Colors
| Token | Hex | Usage |
|---|---|---|
| `success` | `#34D399` | Completed states, correct answers |
| `warning` | `#FBBF24` | Streaks, XP badges, attention |
| `danger` | `#EF4444` | Errors, destructive actions, wrong answers |

#### Region Accent Colors
Each region has a unique accent used for its map node, lesson headers, and artifact glow:
| Region | Accent |
|---|---|
| Variables Forest | `#34D399` |
| Data Types Valley | `#60A5FA` |
| Loops Desert | `#FBBF24` |
| Functions Mountain | `#A78BFA` |
| Collections Kingdom | `#F87171` |
| OOP Citadel | `#C084FC` |
| Exception Abyss | `#FB923C` |
| File System Ruins | `#2DD4BF` |
| Modules Harbor | `#818CF8` |
| Algorithm Arena | `#F472B6` |
| Iterator Isles | `#10B981` |
| Boss Gate Saga | `#C8A45E` |

### Typography Scale

| Role | Family | Weight | Size | Tracking | Usage |
|---|---|---|---|---|---|
| Display XL | Playfair Display | 900 | 48px / 3rem | -0.02em | Hero headings, level-up modals |
| Display L | Playfair Display | 700 | 36px / 2.25rem | -0.01em | Page titles, section headers |
| Display M | Playfair Display | 700 | 24px / 1.5rem | 0 | Card titles, dialog headers |
| Heading | DM Sans | 700 | 18px / 1.125rem | 0 | Widget titles, subsection heads |
| Body L | DM Sans | 400 | 16px / 1rem | 0 | Lesson text, descriptions |
| Body M | DM Sans | 500 | 14px / 0.875rem | 0 | Card body text, form labels |
| Body S | DM Sans | 600 | 12px / 0.75rem | 0 | Captions, timestamps |
| Caption | DM Sans | 700 | 11px / 0.6875rem | 0.05em | Badges, meta labels |
| Micro | DM Sans | 800 | 9px / 0.5625rem | 0.1em | XP counters, tiny labels |
| Code | JetBrains Mono | 400 | 14px / 0.875rem | 0 | Code blocks, editor |
| Code SM | JetBrains Mono | 700 | 11px / 0.6875rem | 0.12em | Inline code, nav brand |

### Spacing Scale

Base unit: 4px. All spacing uses multiples of 4.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight gaps (icon-to-text) |
| `space-2` | 8px | Inner padding, small gaps |
| `space-3` | 12px | Card inner padding (compact) |
| `space-4` | 16px | Standard card padding, section gaps |
| `space-5` | 20px | Card padding (comfortable) |
| `space-6` | 24px | Section spacing, grid gaps |
| `space-8` | 32px | Major section dividers |
| `space-10` | 40px | Page top padding |
| `space-12` | 48px | Hero sections |
| `space-16` | 64px | Maximum vertical rhythm |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Small badges, tiny chips |
| `radius-md` | 8px | Buttons, inputs, small cards |
| `radius-lg` | 12px | Standard cards, modals |
| `radius-xl` | 16px | Hero cards, feature cards |
| `radius-2xl` | 20px | Onboarding cards, dialogs |
| `radius-full` | 9999px | Avatars, circular badges, pills |

### Elevation & Shadows

| Level | Shadow | Usage |
|---|---|---|
| `elevation-0` | none | Flat elements, inline |
| `elevation-1` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift (badges, chips) |
| `elevation-2` | `0 4px 12px rgba(0,0,0,0.4)` | Cards at rest |
| `elevation-3` | `0 8px 32px rgba(0,0,0,0.5)` | Cards on hover, dropdowns |
| `elevation-4` | `0 16px 48px rgba(0,0,0,0.6)` | Modals, dialogs |
| `glow-gold` | `0 0 20px rgba(255,232,219,0.3)` | Active buttons, CTAs |
| `glow-gold-intense` | `0 0 40px rgba(255,232,219,0.5)` | Level-up, achievement unlock |

### Border Standard

- Default card border: `1px solid rgba(244,244,245, 0.1)` (warm-white at 10%)
- Hover card border: `1px solid rgba(212,183,110, 0.3)` (gold at 30%)
- Active/selected border: `1px solid rgba(212,183,110, 0.6)` (gold at 60%)
- Error border: `1px solid rgba(239,68,68, 0.5)` (danger at 50%)

---

## SECTION 5 — COMPONENT STANDARDS

### Card

**Purpose**: The universal container for all dashboard widgets, quest items, and content blocks.

| Property | Value |
|---|---|
| Background | `bg-black/60 backdrop-blur-md` |
| Border | `1px solid warm-white/10` |
| Radius | `radius-lg` (12px) |
| Padding | `space-4` (16px) minimum, `space-5` (20px) standard |

**States**:
- Rest: Default border, no shadow
- Hover: Border transitions to `gold/30`, shadow `elevation-2`, translate Y -2px (spring)
- Focus-visible: `ring-2 ring-gold ring-offset-2 ring-offset-near-black`
- Loading: Skeleton pulse animation (gold/5 shimmer)

**Rules**:
- Maximum one glow orb per card (top-right corner, `gold/5`, blur 100px)
- Cards never nest inside cards
- Card titles use Heading weight (DM Sans 700, 18px)

### Button

**Purpose**: All interactive triggers. Four variants, three sizes.

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `gold` | `near-black` | none | `gold-muted`, `glow-gold` shadow |
| Secondary | `surface-2` | `warm-white` | `warm-white/10` | `surface-3`, border `warm-white/20` |
| Ghost | transparent | `mid-gray` | none | `surface-2`, text `warm-white` |
| Danger | `danger/10` | `danger` | `danger/30` | `danger/20` |

| Size | Padding | Font Size | Min Height |
|---|---|---|---|
| Small | 12px 16px | 14px / 600 | 32px |
| Medium | 12px 20px | 14px / 700 | 40px |
| Large | 16px 32px | 16px / 700 | 48px |

**States**:
- Hover: `scale(1.02)`, `translateY(-1px)` via spring
- Active/Pressed: `scale(0.98)` via spring
- Disabled: `opacity-50`, `cursor-not-allowed`, no motion
- Loading: Spinner icon replaces left icon, text unchanged
- Focus-visible: `ring-2 ring-gold`

### Badge

**Purpose**: Status indicators, XP rewards, rank display.

- Always `font-weight: 800`, `border-radius: full`
- Icon + text pattern: icon at 14px, 6px gap, text at 11-12px
- Size SM: `px-2 py-0.5 text-xs`
- Size MD: `px-3 py-1 text-sm`

### ProgressBar / XP Bar

**Purpose**: Visual progression feedback.

| Property | Value |
|---|---|
| Track | `bg-[#0D0D12]`, border `1px solid #181820`, `radius-full` |
| Fill | Gradient `from-amber-500 to-yellow-400` (XP) or `from-gold to-gold-muted` |
| Height | `h-1.5` (compact), `h-2` (standard), `h-3` (hero) |
| Animation | Width animates with `duration: 1s, ease: easeOut` |
| Glow | Subtle white/20 overlay clipped diagonally for glass effect |

### Modal / Dialog

| Property | Value |
|---|---|
| Overlay | `bg-near-black/80 backdrop-blur-sm` |
| Container | `bg-surface-1`, border `warm-white/10`, `radius-2xl` |
| Max width | 480px (standard), 640px (large), 320px (compact) |
| Entry | `scale: 0.95→1, opacity: 0→1, y: 20→0` (spring: stiffness 300, damping 25) |
| Exit | `scale: 1→0.95, opacity: 1→0, y: 0→20` (duration 200ms) |
| Close button | Top-right, 32×32px touch target, `X` icon |

**Rules**:
- Modals lock body scroll
- Escape key closes modal
- Click on overlay closes modal
- Focus trap inside modal when open

---

## SECTION 6 — MOTION SYSTEM

### Timing Presets

| Name | Config | Usage |
|---|---|---|
| `spring-snappy` | stiffness: 400, damping: 30 | Button hover, card hover, tab switching |
| `spring-smooth` | stiffness: 200, damping: 25 | Page transitions, modal entry |
| `spring-bouncy` | stiffness: 300, damping: 15 | Level-up, achievement unlock, celebration |
| `ease-out-expo` | cubic-bezier(0.16, 1, 0.3, 1) | Sidebar collapse, dropdown open |
| `duration-fast` | 150ms | Hover states, focus rings |
| `duration-normal` | 300ms | Content transitions |
| `duration-slow` | 500ms | Page enter/exit |

### Page Transitions

- Container: `staggerChildren: 0.08`
- Each item: `opacity: 0→1, y: 16→0` with `spring-smooth`
- Never stagger more than 8 items (cap at 640ms total)

### Interaction-Specific Animations

| Interaction | Animation |
|---|---|
| Button hover | `scale: 1.02, y: -1px` (spring-snappy) |
| Button press | `scale: 0.98` (spring-snappy) |
| Card hover | `y: -2px`, border glow transition (300ms) |
| Nav active indicator | `layoutId` spring slide (stiffness: 380, damping: 30) |
| XP gain toast | Float up 40px, fade out over 1.5s |
| Level up | Full-screen overlay, gold particles (canvas), badge scale 0→1.2→1 |
| Quest complete | Checkmark scale with bounce, green pulse ring |
| Sidebar collapse | Width 240→56px (ease-out-expo, 220ms) |
| Modal enter | Scale 0.95→1, y 20→0 (spring-smooth) |

### When NOT to Animate

- Never animate during active coding (Monaco editor focused)
- Never animate static text content
- Never add entrance animations to elements already in viewport on load
- Never animate more than 3 properties simultaneously on one element
- Always respect `prefers-reduced-motion: reduce`

---

## SECTION 7 — GAMIFICATION BIBLE

### XP Economy

| Action | XP Reward |
|---|---|
| Complete a lesson | 50 XP |
| Complete a challenge question (easy) | 30 XP |
| Complete a challenge question (medium) | 50 XP |
| Complete a challenge question (hard) | 80 XP |
| Defeat a region boss | 200 XP |
| Defeat the final boss | 500 XP |
| Daily login reward (Day 1-6) | 25-150 XP (scaling) |
| Daily login reward (Day 7) | 250 XP + Artifact Chest |
| Complete a daily quest | 50-100 XP |
| Streak combo bonus (per correct in row) | +10 XP per streak level |
| Memory Vault review session | 25 XP per card reviewed |

### Level Progression

Formula: `XP_needed = 100 * level * 1.2`

| Level | Total XP Required | Unlocks |
|---|---|---|
| 1 | 0 | Starting class |
| 2 | 120 | First title ("Initiate") |
| 3 | 264 | Memory Vault access |
| 5 | 660 | Guild creation ability |
| 10 | 2,160 | Custom avatar frame |
| 15 | 4,860 | Mentor access |
| 20 | 8,760 | Infinite Tower entry |
| 30 | 20,160 | "Master" title |
| 50+ | 50,000+ | "Legend" title |

### Artifact System

- 12 artifacts total (one per region)
- Rarity tiers: Common (2), Rare (4), Epic (5), Legendary (1)
- Each artifact provides a stat boost (XP multiplier for its region)
- Artifacts are displayed in the Inventory as collectible cards
- Artifact reveal: a cinematic card-flip animation with glow matching the region's accent color

### Streak System

- Streaks increment on any daily login where the player completes at least one action (lesson, quiz, or vault review)
- Missing more than 48 hours resets the streak
- Streak milestones: 7 days (badge), 30 days (title), 100 days (legendary frame)
- The streak flame icon in the navbar scales up at milestones

### Achievement Categories

1. **Progression**: "First Steps" (complete first lesson), "Region Master" (complete a region), "Legend" (complete all regions)
2. **Mastery**: "Perfect Score" (boss battle with no wrong answers), "Speed Demon" (complete lesson under 5 min)
3. **Social**: "Guild Founder" (create a guild), "Mentor" (help 10 guild members)
4. **Collection**: "Artifact Hunter" (collect 6 artifacts), "Complete Collection" (all 12)
5. **Consistency**: "Weekly Warrior" (7-day streak), "Iron Will" (30-day streak)

### Daily Rewards Calendar

A 7-day cycle that resets after Day 7:
- Days 1-6: Scaling XP (25, 50, 75, 100, 125, 150)
- Day 7: 250 XP + Artifact Chest (random consumable)
- Claiming requires one click. No multi-step flows.

---

## SECTION 8 — LEARNING EXPERIENCE

### Lesson Flow

Every lesson follows a 4-phase structure:

1. **Hook** (30 seconds): A visual metaphor connecting the Python concept to the world. "In the Variables Forest, every tree holds a value. When you write `x = 5`, you plant a tree named `x` and place the number 5 in its branches."
2. **Teach** (2-3 minutes): Step-by-step code walkthrough with syntax highlighting. Each step reveals one line at a time with an explanation panel.
3. **Practice** (3-5 minutes): Interactive coding in Monaco editor. The player writes code, runs it, and sees output. Hints available after 2 failed attempts.
4. **Victory** (15 seconds): XP reward animation, progress update, CTA to continue.

### Error Feedback

- Wrong answers never say "Wrong!" or "Incorrect!"
- Instead: "Not quite. Here's why:" followed by a specific explanation
- The wrong option dims. The correct option highlights in gold with a brief explanation
- No XP penalty for wrong answers. Ever.
- After 2 wrong attempts, a hint button appears. After 3, the explanation auto-reveals.

### Hint System Hierarchy

1. **Nudge**: A one-sentence clue ("Think about what `range(1, 5)` actually produces")
2. **Guide**: A more detailed explanation with a partial code example
3. **Reveal**: The full explanation with the correct answer shown

### Memory Vault (Spaced Repetition)

- Uses SM-2 algorithm for scheduling reviews
- Cards represent concepts from completed lessons
- Each card shows: concept name, code snippet, and a recall prompt
- Player self-rates: "Forgot" → "Hard" → "Good" → "Easy"
- Rating affects the next review interval
- The Vault UI shows: cards due today, streak, total cards mastered
- Cards due today always appear on the Dashboard as a gentle reminder

### Victory Screens

Every victory moment follows the same structure:
1. Dark overlay fades in (200ms)
2. "Quest Complete" or "Boss Defeated" in Display XL
3. XP counter ticks up (60fps counter animation, 1.5s)
4. Reward items slide in from bottom (staggered, 100ms apart)
5. Two CTAs: "Continue" (primary) and "Review" (ghost)
6. No auto-dismiss. The player controls when to move on.
# ARAMBH DESIGN BIBLE v1.0 — Part 2

**Sections 9–15: World, Accessibility, Performance, Pages, Interactions, Retention, Quality**

---

## SECTION 9 — WORLD BUILDING

### The Python Kingdom

The world of Arambh is a contiguous landmass divided into 12 regions. Each region represents a Python domain. The regions are arranged as a journey from north (beginner) to south (advanced), following a winding path that a player traverses over weeks of play.

### Regions

| # | Region | Biome | Python Topic | Accent | Artifact | Boss |
|---|---|---|---|---|---|---|
| 1 | Variables Forest | Dense, ancient woodland | Variables & Assignment | `#34D399` | Forest Ring 💍 | The Memory Keeper |
| 2 | Data Types Valley | Crystalline canyon | Strings, Numbers, Booleans | `#60A5FA` | Crystal Lens 🔮 | The Type Guardian |
| 3 | Loops Desert | Endless golden dunes | For & While Loops | `#FBBF24` | Dune Scroll 📜 | The Sand Scribe |
| 4 | Functions Mountain | Snow-capped peak | Functions & Scope | `#A78BFA` | Summit Crown 👑 | The Architect |
| 5 | Collections Kingdom | Walled city-state | Lists, Dicts, Sets | `#F87171` | Royal Scepter 🏆 | The Data King |
| 6 | OOP Citadel | Dark stone fortress | Classes & Objects | `#C084FC` | Class Sigil ⚜️ | The Citadel Lord |
| 7 | Exception Abyss | Deep underground caverns | Try, Except, Finally | `#FB923C` | Abyssal Shield 🛡️ | The Error Beast |
| 8 | File System Ruins | Ancient stone archives | Read, Write, Manage | `#2DD4BF` | Stone Tablet 📋 | The Ruin Keeper |
| 9 | Modules Harbor | Bustling port town | Import & Packages | `#818CF8` | Harbor Compass 🧭 | The Harbor Master |
| 10 | Algorithm Arena | Grand colosseum | Sort, Search, Optimize | `#F472B6` | Arena Trophy 🏅 | The Arena Champion |
| 11 | Iterator Isles | Floating islands | Iterators & Generators | `#10B981` | Infinite Compass 🧭 | The Stream Sentinel |
| 12 | Boss Gate Saga | Obsidian fortress | Final Challenges | `#C8A45E` | Legend's Crown ⚡ | The Ultimate Boss |

### NPC Types

| NPC | Role | Where |
|---|---|---|
| **The Oracle** | AI Mentor — answers contextual Python questions | Oracle Hub, available via side panel in lessons |
| **Region Bosses** | Gatekeepers — must be defeated to progress | End of each region |
| **Guild Master** | Manages guild creation and leaderboard | Guild Hall |
| **The Archivist** | Manages the Memory Vault | Vault page |
| **The Cartographer** | Provides map navigation hints | World Map tooltips |

### Lore Rules

1. Every piece of lore must teach or reinforce a Python concept. No decorative lore.
2. Region descriptions use metaphor to explain what the Python topic *does* (not how it works syntactically — that's for lessons).
3. Artifact descriptions connect the magical property to the programming concept ("A scroll that repeats infinitely unless you know the break condition" = loop control).
4. Boss names reflect the domain they guard: "The Memory Keeper" guards Variables (variable = memory allocation).

### Magic System

In Arambh's world, "magic" is code. The magic system maps 1:1 to Python concepts:

| Magic | Python |
|---|---|
| Naming spells | Variable assignment |
| Elemental types | Data types (str, int, float, bool) |
| Repetition chants | Loops |
| Incantation scrolls | Functions |
| Grimoire chapters | Modules/imports |
| Enchanted containers | Lists, dicts, sets |
| Warding shields | Try/except |
| Ancient archives | File I/O |
| Class blueprints | OOP |
| Optimization runes | Algorithms |

### Environmental Effects

| Region State | Visual |
|---|---|
| Locked | Grayscale, fog overlay, lock icon |
| Current | Full color, gentle pulse ring, glowing path |
| Completed | Full color, golden checkmark badge, accent glow |
| Boss available | Region accent color pulses, boss icon visible |

### Music & Sound Direction (Future)

- **Ambient**: Each region has a unique ambient soundscape (forest: birds + wind, desert: wind + distant chimes, citadel: stone echoes + chanting)
- **UI sounds**: Mechanical click (buttons), crystal chime (correct), wooden thud (wrong), brass fanfare (level up), chest opening (artifact reveal)
- **Volume**: Always optional, off by default, toggle in settings
- **Implementation**: Web Audio API, lazy-loaded audio sprites, <50KB per region

---

## SECTION 10 — ACCESSIBILITY

### Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` | Move focus to next interactive element |
| `Shift+Tab` | Move focus to previous element |
| `Enter` / `Space` | Activate focused button/link |
| `Escape` | Close modal/dialog/dropdown |
| `Arrow keys` | Navigate within radio groups, tabs, menus |
| `/` | Focus search (when implemented) |

### Focus Indicators

- All interactive elements: `focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-near-black`
- Never remove outlines. Style them, never hide them.
- Focus ring uses gold (not browser default blue) to match the theme.

### Screen Reader Standards

- All images: meaningful `alt` text or `aria-hidden="true"` for decorative
- All icon buttons: `aria-label` describing the action ("Sign out", not "LogOut icon")
- Progress bars: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Live regions: XP gain toasts use `aria-live="polite"`
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title

### Color Contrast

- All text on `near-black` background must meet WCAG AA (4.5:1 minimum for body text)
- `warm-white` (#F4F4F5) on `near-black` (#050505) = 18.4:1 ✅
- `mid-gray` (#94A3B8) on `near-black` (#050505) = 7.2:1 ✅
- `gold` (#FFE8DB) on `near-black` (#050505) = 15.3:1 ✅
- Never rely on color alone to convey meaning. Always pair with icons or text labels.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- This is already implemented in `index.css`. Maintain it.
- Framer Motion: wrap all `animate` props with `useReducedMotion()` check.

### Touch Targets

- Minimum touch target: 44×44px on mobile, 32×32px on desktop
- Sidebar nav items: 44px height minimum
- Bottom tab bar items: 56px height, full flex width
- Icon-only buttons: minimum 36×36px with padding

### Responsive Typography

- Base font size: 16px (never smaller for body text)
- Mobile headings: scale down by one level (Display L → Display M)
- Line height: 1.5 for body, 1.2 for display, 1.4 for code
- Maximum line width: 65ch for readable prose

---

## SECTION 11 — PERFORMANCE STANDARDS

### Animation Budget

- Maximum 3 simultaneous CSS/JS animations on screen
- Particles: maximum 30 DOM particles (Atmosphere component). Use canvas for more.
- All animations must use `transform` and `opacity` only (GPU-composited properties)
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`
- Framer Motion `layout` animations: use only on small elements, never on full-page containers

### Bundle Size Goals

| Metric | Target |
|---|---|
| Initial JS bundle | < 200KB gzipped |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Total bundle (all chunks) | < 500KB gzipped |

### React Architecture Rules

1. **Zustand selectors**: Always use atomic selectors. `useProgressionStore(s => s.stats)` not `useProgressionStore()`.
2. **Component splitting**: Every page-level component is a lazy-loaded route. Use `React.lazy()` with `Suspense`.
3. **Memo boundaries**: Memoize components that receive complex objects as props. Use `React.memo` on Card, Badge, ProgressBar.
4. **Avoid prop drilling**: Use context for theme-level data, Zustand for app state, local state for UI-only state.

### Lazy Loading Strategy

| Resource | Strategy |
|---|---|
| Route components | `React.lazy` + `Suspense` with skeleton fallback |
| Images | `loading="lazy"` attribute |
| Monaco editor | Dynamic import on lesson page mount only |
| Sound effects | Lazy-loaded on first user interaction |
| Analytics | Non-blocking, fires after paint |
| Atmosphere particles | Render after 2s delay or on idle |

### Asset Optimization

- SVG icons: Inline via Lucide (tree-shaken). No icon sprite sheets.
- Avatars: DiceBear API (external, cached). No local avatar storage.
- Fonts: Google Fonts with `display=swap`. Three families maximum (already enforced).
- No images larger than 100KB. Generate via AI if needed, compress to WebP.

---

## SECTION 12 — PAGE STANDARDS

Every page must answer four questions within 2 seconds of loading:

1. **Where am I?** (Page title + breadcrumb)
2. **What can I do?** (Visible actions)
3. **What should I do next?** (Primary CTA highlighted)
4. **What reward is waiting?** (XP or progress visible)

### Dashboard

**Purpose**: The player's home base. Shows current state and directs to next action.

**Layout** (12-column grid):
```
┌──────────────────────────────────────────┐
│ [Character Card — 8 cols] [Progression — 4 cols] │
├──────────────────────────────────────────┤
│ [Continue Learning — 12 cols]                     │
├──────────────────────────────────────────┤
│ [Daily Quests — 6 cols] [Daily Rewards — 6 cols]  │
├──────────────────────────────────────────┤
│ [Artifacts — 6 cols] [Recent Activity — 6 cols]   │
└──────────────────────────────────────────┘
```

**Rules**:
- "Continue Learning" is the most prominent CTA on the page
- Character Card shows: avatar, username, rank, class, level, XP bar, streak, next reward
- No more than 6 widgets. More information belongs on dedicated pages.
- Stagger animation: 80ms between widgets, maximum 480ms total

### Library

**Purpose**: Reference encyclopedia. Browse all Python topics by region.

**Rules**:
- Search bar at top (filter by keyword)
- Topics organized by region tabs
- Each topic card: title, difficulty badge, estimated read time, completion state
- Completed topics show gold checkmark
- Cards use standard Card component with region accent as subtle top-border highlight

### World Map

**Purpose**: Visual progression overview. The player's journey through all 12 regions.

**Rules**:
- Regions displayed as nodes on a winding path
- Locked regions: grayscale + fog + lock icon
- Current region: full color + pulse ring + "Continue" label
- Completed regions: full color + golden checkmark
- Clicking a region navigates to its detail view (RegionMap)
- The path between nodes glows gold up to the current region

### Lesson Page

**Purpose**: Active learning. Code + explanation + challenge.

**Rules**:
- Sidebar auto-collapses. Maximum screen real estate for content.
- Left panel: lesson content (steps, explanations, code blocks)
- Right panel: Monaco editor (when practice phase begins)
- Top: breadcrumb (World Map → Region → Lesson title)
- Bottom: step navigation (Previous / Next) + progress indicator
- On completion: victory overlay (not a page redirect)

### Guild Hall

**Purpose**: Social features. Guild membership, chat, shared progress.

**Rules**:
- Guild overview: name, emblem, member count, weekly progress bar
- Member list: sorted by XP contributed this week
- Guild chat: simple message list (no real-time WebSocket needed for MVP)
- "Create Guild" CTA for players without a guild

### Leaderboard

**Purpose**: Competition and motivation.

**Rules**:
- Tabs: Daily, Weekly, All-Time
- Top 3 displayed with special styling (gold, silver, bronze accents)
- Current player always visible, even if not in top 10 (pinned at bottom with rank)
- XP and level displayed per entry
- No personal information beyond username and avatar

---

## SECTION 13 — MICRO INTERACTION CATALOGUE

Every interaction has exactly one animation. No stacking.

| Interaction | Trigger | Animation | Duration | Sound Opportunity |
|---|---|---|---|---|
| Button hover | Mouse enter | `scale(1.02), y(-1px)` | spring-snappy | None |
| Button press | Mouse down | `scale(0.98)` | spring-snappy | Mechanical click |
| Card hover | Mouse enter | `y(-2px)`, border glow gold/30 | 300ms ease | None |
| Nav item click | Click | Active indicator slides (layoutId) | spring (380/30) | Soft tick |
| XP gain | Event | "+50 XP" floats up 40px, fades | 1.5s ease-out | Crystal chime |
| Level up | Event | Full overlay, particles, badge scale 0→1.2→1 | 2s | Brass fanfare |
| Achievement unlock | Event | Toast slides in from right, gold border pulse | 3s (auto-dismiss) | Chime + sparkle |
| Quest complete | Event | Checkmark scales with bounce, row highlights green | 800ms | Success chime |
| Artifact reveal | Event | Card flips 180°, glow emanates in region accent | 2s | Chest opening |
| Boss defeat | Event | Screen shake (subtle 2px), victory overlay | 2.5s | Epic fanfare |
| Daily reward claim | Click | Reward day card pulses gold, check appears | 600ms | Coin sound |
| Streak increment | Event | Flame icon scales 1→1.3→1, number ticks up | 800ms | Fire whoosh |
| Toast notification | Event | Slides in from top-right, auto-dismisses | 4s total | None (visual only) |
| Sidebar collapse | Toggle | Width 240→56px | 220ms expo | None |
| Modal open | Event | Overlay fade + content spring-up | 300ms | None |
| Modal close | Event/ESC | Content spring-down + overlay fade | 200ms | None |
| Progress bar fill | Data change | Width animates to new value | 1s ease-out | None |
| Scroll to section | Click | Smooth scroll | 500ms | None |
| Error shake | Validation fail | Input field shakes horizontally 3 times (±4px) | 400ms | Soft thud |
| Empty state | Page load | Icon fades in with y(10→0), text follows 100ms later | 400ms total | None |

---

## SECTION 14 — RETENTION SYSTEM

### The Four Loops

#### Daily Loop (15-30 min target session)
1. Open app → see streak counter, daily quests, login rewards
2. Claim daily reward (one click)
3. Review Memory Vault cards (if any due)
4. Continue active lesson or training challenge
5. Complete 1-2 daily quests naturally through play
6. Session ends with a gentle "See you tomorrow" if all quests done

#### Weekly Loop
1. Guild progress bar resets Monday
2. Leaderboard resets Monday
3. New weekly challenge unlocks (rotating across regions)
4. Guild members see each other's weekly contributions
5. Sunday: "Weekly Summary" notification (XP earned, lessons completed, rank change)

#### Monthly Loop
1. Monthly achievement milestones ("Complete 20 lessons this month")
2. New seasonal content rotation (different Infinite Tower challenges)
3. Guild-vs-guild monthly competition (future feature)
4. Progress report: "You've mastered 3 regions this month"

#### Collection Loop (Ongoing)
1. 12 artifacts to collect (one per region)
2. Achievement badges to earn (30+ categories)
3. Titles to unlock (15+ titles tied to milestones)
4. Memory Vault cards to master (SRS mastery = card fully retained)
5. Leaderboard position to maintain

### Re-engagement for Lapsed Players

| Absence | Action |
|---|---|
| 2 days | No action (normal rest) |
| 3-7 days | Dashboard shows "Welcome back! Your streak was X days." |
| 7-14 days | Simplified daily quests (easier to re-engage) |
| 14-30 days | "Catch-up" mode: review of last completed concepts before new material |
| 30+ days | Full "Welcome Back" flow: recap of progress, one-click resume |

**Rules**:
- Never shame a player for absence ("You missed 14 days!" ❌)
- Always frame return positively ("Welcome back! Let's pick up where you left off." ✅)
- Streak loss is shown once, then hidden. Don't remind repeatedly.

---

## SECTION 15 — QUALITY STANDARDS

### Measurable Criteria

Every component and page must meet ALL of the following before shipping:

#### Visual Quality
- [ ] Uses only Design Bible color tokens (no raw hex outside the palette)
- [ ] Typography follows the defined scale (no arbitrary font sizes)
- [ ] Spacing uses the 4px grid (no odd-pixel values)
- [ ] Border radius matches the defined tokens
- [ ] Maximum one glow effect per card
- [ ] Dark surfaces only — no light/white backgrounds in app chrome

#### UX Quality
- [ ] Page answers all 4 questions within 2 seconds (where, what, next, reward)
- [ ] Primary CTA is visually dominant (gold, largest button, prominent position)
- [ ] No dead-end states (every screen has a clear "next step")
- [ ] Error states include actionable recovery guidance
- [ ] Empty states include an invitation to act (never blank)
- [ ] Loading states show skeleton/shimmer (never a blank white space)

#### Accessibility
- [ ] All interactive elements reachable via keyboard Tab
- [ ] All buttons/links have visible focus ring (gold ring)
- [ ] All icon-only buttons have `aria-label`
- [ ] Color contrast meets WCAG AA (4.5:1 body, 3:1 large text)
- [ ] `prefers-reduced-motion` respected (no exceptions)
- [ ] Modals trap focus and close on Escape

#### Performance
- [ ] No animation uses non-composited properties (no width/height/top/left)
- [ ] Page renders meaningful content within 1.5s
- [ ] No layout shift after initial paint (CLS < 0.1)
- [ ] Zustand selectors are atomic (no full-store subscriptions)
- [ ] Heavy components (Monaco, charts) are lazy-loaded

#### Responsiveness
- [ ] Desktop (≥1024px): full sidebar layout
- [ ] Tablet (768–1023px): collapsed sidebar rail
- [ ] Mobile (<768px): bottom tab bar, no sidebar
- [ ] Touch targets: minimum 44×44px on mobile
- [ ] No horizontal scroll on any viewport
- [ ] Text readable without zooming on mobile (min 16px body)

#### Gamification
- [ ] Every player action produces visible feedback (XP, progress, state change)
- [ ] Rewards are immediate — never delayed to a different screen
- [ ] Progress is always visible (XP bar, level, quest completion %)
- [ ] The "next step" is always one click away
- [ ] No manipulative patterns (no energy systems, no paywalls, no artificial waiting)

#### Consistency
- [ ] Card component used for ALL container elements (no custom divs with card-like styling)
- [ ] Button component used for ALL interactive triggers (no raw `<button>` or `<a>` styled as buttons)
- [ ] Badge component used for ALL status indicators
- [ ] ProgressBar used for ALL linear progress visualization
- [ ] Modal used for ALL overlay dialogs
- [ ] Toast used for ALL transient notifications

### Component Acceptance Checklist

Before any PR merging a new or modified component:

```
□ Matches Design Bible tokens (colors, spacing, typography, radius)
□ All states implemented (rest, hover, focus, active, disabled, loading, error, success)
□ Keyboard navigable (Tab, Enter/Space, Escape where applicable)
□ Screen reader tested (VoiceOver or NVDA)
□ Responsive at 3 breakpoints (mobile, tablet, desktop)
□ Animations use spring presets from Motion System section
□ No raw hex colors (must use Tailwind token or CSS variable)
□ Performance: no unnecessary re-renders (React DevTools Profiler check)
□ Reviewed against 3 reference products (Duolingo, Linear, Riot Client)
```

---

## APPENDIX — TERMINOLOGY GLOSSARY

| Term | Meaning in Arambh |
|---|---|
| Player | The user. Never "user" or "student" in UI copy. |
| Quest | A daily task or challenge. |
| Region | A section of the world map representing a Python topic area. |
| Lesson | A single learning unit within a region (4 per region). |
| Boss | A gatekeeping challenge at the end of each region. |
| Artifact | A collectible item earned by completing a region. |
| XP | Experience points. The primary progression currency. |
| Level | The player's overall progression tier (calculated from total XP). |
| Rank | A title bracket (Novice, Apprentice, Adept, Master, Legend). |
| Class | The player's chosen archetype (Python Mage, Automation Rogue, Data Warrior). |
| Guild | A player-created group for social accountability. |
| Streak | Consecutive days with at least one meaningful action. |
| Memory Vault | The spaced-repetition review system. |
| Oracle | The AI mentor. |
| Infinite Tower | Endless challenge mode for post-completion players. |
| Training Ground | The challenge/quiz area for a specific region. |

---

*END OF ARAMBH DESIGN BIBLE v1.0*

*This document should be versioned and updated as the product evolves. All changes must be reviewed against the principles in Section 1. If a new feature contradicts a principle, the principle wins unless the team explicitly decides to update the principle with documented reasoning.*
