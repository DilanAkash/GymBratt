# GymBratt Implementation Plan

## Overview
**Goal**: Build a dual-mode gym management system (Standalone Personal App + Gym-Connected SaaS) with a single codebase.
**Timeline**: 10-14 Weeks (Solo Developer)
**Stack**: React Native (Expo), Next.js (Admin/Trainer), Firebase (Auth, Firestore, Functions).

---

## Phase 1: Standalone Mode Foundation (Weeks 1-3)
**Focus**: Personal workout tracking, program builder, basic progress features.

- [x] **Project Setup**: Firebase Init, Repo Setup.
- [x] **Authentication**: Login/Signup, Profile Creation (Standalone).
- [x] **Firestore Schema**: Define Users, Programs, sub-collections.
- [x] **Security Rules**: Basic RLS for user ownership.
- [x] **Program Builder (Client)**:
    - [x] Create Program (Meta data)
    - [x] Edit Structure (Weeks/Days)
    - [x] Edit Day (Exercises, Sets, Presets)
    - [x] **Integration**: Connect to Firestore (`programService.ts`)
- [x] **Workout Logger**:
    - [x] `ActiveWorkoutScreen`: Load from Program Day.
    - [x] Log sets (Reps/Weight/RPE).
    - [x] Rest Timer.
    - [x] Save to `workoutLogs` collection.
- [ ] **History & Progress**:
    - [ ] View Past Workouts.
    - [ ] Weight/Body Fat logs.
    - [ ] Nutrition Logs (Basic).

## Phase 2: Gym Connection & Dual Mode (Weeks 4-5) 
**Focus**: QR Code scanning, feature gating, 'Gym Mode' activation.

- [ ] **QR Code Scanner**: Scan Gym QR to get `gymId`.
- [ ] **Gym Connection Logic**: Validate `gymId`, update User profile.
- [ ] **Context Switching**: `useGym()` hook or Context to toggle UI.
- [ ] **Coach Programs**: Fetch `gyms/{gymId}/coachPrograms`.

## Phase 3: Gym-Only Features (Weeks 6-7)
- [ ] **Attendance**: QR Check-in.
- [ ] **Membership Card**: Digital ID view.
- [ ] **Support/Requests**: Ticket system.

## Phase 4: Trainer Dashboard (Weeks 8-9)
- [ ] **Web App Init**: Next.js project.
- [ ] **Trainer Auth**: Role-based login.
- [ ] **Member Management**: View assigned members.
- [ ] **Program Creator (Web)**: Assign programs to members.

## Phase 5: Admin Dashboard (Weeks 10-12)
- [ ] **Multi-Gym Management**: Create Gyms, generate QRs.
- [ ] **Staff Management**: Add Trainers.
- [ ] **Analytics**: Attendance, Active users.

## Phase 6: Polish & Launch (Weeks 13-14)
- [ ] Testing (Unit & Integration).
- [ ] Deployment (App Stores, Vercel).
