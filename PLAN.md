# 📝 Gym-App Action Plan & Roadmap

This file outlines the step-by-step strategy to transition the Gym-App from its current mock-heavy state into a fully connected, refactored, and production-ready application.

---

## 🛠️ Phase 1: Architectural Refactoring & Technical Debt
*Goal: Clean up data models, improve performance, and adopt better state structures before building out new features.*

- [ ] **Decouple Types from Mocks:** 
  - Create a new `types/index.ts` (or `types/workout.ts`) folder and file.
  - Relocate all standard interfaces (`Program`, `ProgramDay`, `WorkoutLog`, etc.) away from `mockPrograms.ts` to avoid polluting the production bundle with heavy mock datasets.
- [ ] **Optimize Render Cycle Computations:**
  - Locate functions like `computeStreakDays` inside UI components (e.g., `index.tsx`).
  - Move this logic into `AttendanceContext` and cache the result using `useMemo` so it's calculated once on data fetch, not every time the screen re-renders.
- [ ] **Centralize Goal & Settings Management:**
  - Right now, macro goals and membership dates are scattered hardcoded variables.
  - Extend the existing `UserContext` (or create a new `SettingsContext`) to store globally accessible defaults (e.g., Target Macros, Target Weight, Measurements).
- [ ] **Adopt caching for Data Fetching:**
  - *(Optional but heavily recommended)* Integrate **React Query** (`@tanstack/react-query`) to handle Firebase calls instead of putting `const [loading, setLoading] = useState(true)` and `useEffect` in every component. 

---

## 🏗️ Phase 2: Wiring Up The Screens
*Goal: Systematically rip out `.tsx` file mock data strings and connect the UI natively to the Database logic already built in `lib/services/`.*

### 1. Profile Tab (`profile.tsx`)
- [ ] Replace the hardcoded `const stats = { streakDays: 7... }` dummy object.
- [ ] Calculate `streakDays` and `checkIns` directly from `AttendanceContext` logic.
- [ ] Fetch the user's authentic `programsCompleted` from history.

### 2. Nutrition Tab (`nutrition.tsx`)
- [ ] **Dynamic Macro Limits:** Fetch `PLANNED` limits directly from the user's stored Firebase goal configurations.
- [ ] **Timeline Navigation Layer:** Wire up the left and right date arrows to adjust a local `selectedDate` state, natively triggering `getDailyNutrition(selectedDate)`.
- [ ] **Update Mechanism:** Unblock the `handleMealPress()` function to open an editor modal or screen, wired to your `updateMeal` service.
- [ ] **Followed Logic:** Update the "Mark Day as Followed" button to actually post a boolean completion flag to the backend collection for history records.

### 3. Progress Tab (`progress.tsx`)
- [ ] **Measurements Storage:** Replace the hardcoded `measurements` static grid with a fetching structure from the Firebase user schema. 
- [ ] **Photo Upload System:** Wire the scrolling photo gallery UI to the file system using Expo Image Picker, pushing assets directly to your `uploadProgressPhoto()` Firebase handler.

### 4. Home Dashboard (`index.tsx`)
- [ ] **Smart Active Program:** Instead of picking `activeProgram = programs[0]`, allow the `User` object to pinpoint their precise active plan UUID.
- [ ] **Live News Feed:** Port `newsItems` out from local UI state into `gymService.ts`, fetching updates tied strictly to the user's registered Gym ID.
- [ ] **Membership Integrity:** Feed `membership.expiresAt` properly out of user state rather than freezing it to `"2025-12-31"`.

---

## 🚀 Phase 3: Final UX Polish
*Goal: Make the app feel premium and stable.*

- [ ] **Loading Skeletons:** Implement React Native skeleton placeholders while React-Query/Firebase initially loads context stores, removing raw blank screens or basic spinners.
- [ ] **Error Boundaries:** Wrap context providers in global fault handlers to catch network drops smoothly.
- [ ] **Offline Resilience Settings:** Double check that Firebase's offline persistence layer is formally initialized, ensuring smooth Gym check-ins when users hit connectivity dead-zones.
