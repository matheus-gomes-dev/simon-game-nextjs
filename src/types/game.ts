export type SimonColor = "green" | "red" | "yellow" | "blue";

export type GameStatus = "idle" | "showing" | "playing" | "gameover";

export interface SimonGameState {
  status: GameStatus;
  sequence: SimonColor[];
  playerIndex: number;
  score: number;
  activeColor: SimonColor | null;
  showIndex: number;
}

export interface GameHistoryItem {
  id: string;
  score: number;
  duration: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  highestScore: number;
}

export type SimonGameAction =
  | { type: "START_GAME" }
  | { type: "EXTEND_SEQUENCE"; color: SimonColor }
  | { type: "SHOW_STEP" }
  | { type: "CLEAR_ACTIVE" }
  | { type: "SHOW_COMPLETE" }
  | { type: "PLAYER_TAP"; color: SimonColor };
