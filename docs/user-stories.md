# Simon Game — User Stories

## US-1: Play Simon Game

**As a** player, **I can** play the classic Simon memory game in my browser **so that** I can test and improve my memory skills.

**Complexity:** L | **Phase:** 1 — Foundation

### Acceptance Criteria

1. The board displays 4 colored buttons (green, red, yellow, blue) that light up and play a tone when activated
2. Each round, the game adds one random color to the sequence and plays it back; the player must repeat the full sequence in order
3. The current score (number of rounds completed) is displayed during gameplay
4. If the player repeats the sequence correctly, the next round starts automatically after a brief delay
5. If the player clicks the wrong color, the game ends and shows a "Game Over" screen with the final score

**Dependencies:** None (this is the foundation)

---

## US-2: Register an Account

**As a** visitor, **I can** create an account with a username, email, and password **so that** my game progress is saved across sessions.

**Complexity:** M | **Phase:** 2 — Database + Authentication

### Acceptance Criteria

1. The registration form validates that username and email are unique, email is valid, and password is at least 8 characters (validated with Zod)
2. The password is hashed with bcrypt (cost 12) before storage — plaintext is never persisted
3. On successful registration, the user is redirected to the login page
4. On validation failure, specific error messages are shown inline (e.g., "Email already in use")

**Dependencies:** None

---

## US-3: Log In and Log Out

**As a** registered user, **I can** log in with my credentials and log out **so that** I can securely access my personal game data.

**Complexity:** M | **Phase:** 2 — Database + Authentication

### Acceptance Criteria

1. The login form accepts email and password, validated with Zod before submission
2. On successful authentication, a JWT session is created (7-day expiry) and the user is redirected to `/play`
3. Invalid credentials show a generic error message ("Invalid email or password") without revealing which field is wrong
4. A "Log out" option is visible in the navbar when authenticated, and clicking it ends the session and redirects to the landing page

**Dependencies:** US-2 (users must exist to log in)

---

## US-4: Protected Game Page

**As a** product owner, **I want** the `/play` page to require authentication **so that** only registered users can play and have their scores tracked.

**Complexity:** S | **Phase:** 2 — Database + Authentication

### Acceptance Criteria

1. Unauthenticated visitors accessing `/play` are redirected to `/login`
2. After logging in, the user is redirected back to `/play`
3. The navbar shows the logged-in user's name on protected pages

**Dependencies:** US-1, US-3

---

## US-5: Save Game Session

**As an** authenticated player, **I can** have my completed game automatically saved **so that** I can track my performance over time.

**Complexity:** M | **Phase:** 3 — Game Persistence

### Acceptance Criteria

1. When a game ends, a `POST /api/games` request saves the session (score, sequence, duration, timestamps) to MongoDB
2. The user's `highestScore` and `gamesPlayed` fields are updated if the new score is a personal best
3. The API rejects requests from unauthenticated users with a 401 response
4. The player sees confirmation that their score was saved on the Game Over screen

**Dependencies:** US-1, US-3

---

## US-6: View Game History

**As an** authenticated player, **I can** view a list of my past games **so that** I can see how my performance has changed over time.

**Complexity:** S | **Phase:** 4 — History + Leaderboard

### Acceptance Criteria

1. The `/history` page displays a table of past games with columns: date, score, and duration
2. Games are sorted by most recent first
3. Unauthenticated users are redirected to `/login`

**Dependencies:** US-5 (games must be saved before they can be viewed)

---

## US-7: View Leaderboard

**As a** visitor or player, **I can** view a public leaderboard of top scores **so that** I can see how I rank against other players.

**Complexity:** S | **Phase:** 4 — History + Leaderboard

### Acceptance Criteria

1. The `/leaderboard` page is publicly accessible (no auth required)
2. It displays the top 10 players ranked by `highestScore`, showing rank, username, and score
3. The page is server-rendered for fast initial load

**Dependencies:** US-5 (scores must be persisted)

---

## US-8: Responsive Layout and Loading States

**As a** player, **I can** use the game on both desktop and mobile devices **so that** I can play anywhere.

**Complexity:** S | **Phase:** 5 — Polish

### Acceptance Criteria

1. The game board, forms, and tables adapt to screen widths from 320px to 1440px using Tailwind breakpoints
2. A loading spinner is shown while async data (history, leaderboard) is being fetched
3. The navbar collapses into a mobile-friendly layout on small screens

**Dependencies:** US-1 through US-7 (polish layer on top of all features)

---

## Dependency Map

```
US-1 (Play Game)          US-2 (Register)
  │                          │
  │                          ▼
  │                       US-3 (Login/Logout)
  │                          │
  ├──────────┬───────────────┤
  ▼          ▼               ▼
US-4 (Protected Page)     US-5 (Save Game)
                             │
                     ┌───────┴───────┐
                     ▼               ▼
                  US-6 (History)  US-7 (Leaderboard)
                     │               │
                     └───────┬───────┘
                             ▼
                     US-8 (Polish)
```

## Summary

| Story | ADO ID | Description              | Size | Points | Phase |
|-------|--------|--------------------------|------|--------|-------|
| US-1  | #4242  | Play Simon Game          | L    | 8      | 1     |
| US-2  | #4243  | Register Account         | M    | 5      | 2     |
| US-3  | #4244  | Login / Logout           | M    | 5      | 2     |
| US-4  | #4245  | Protected Game Page      | S    | 3      | 2     |
| US-5  | #4246  | Save Game Session        | M    | 5      | 3     |
| US-6  | #4247  | View Game History        | S    | 3      | 4     |
| US-7  | #4248  | View Leaderboard         | S    | 3      | 4     |
| US-8  | #4249  | Responsive + Loading     | S    | 3      | 5     |

**Total Story Points:** 35
