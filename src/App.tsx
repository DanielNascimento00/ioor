import { useEffect, useState } from "react";
import { APICreator } from "./components/APICreator";
import { ChallengeMode } from "./components/ChallengeMode";
import { ChatScreen } from "./components/ChatScreen";
import { FundamentalsScreen } from "./components/FundamentalsScreen";
import { GlossaryScreen } from "./components/GlossaryScreen";
import { LabScreen } from "./components/LabScreen";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { MissionScreen } from "./components/MissionScreen";
import { PerformanceHistory } from "./components/PerformanceHistory";
import { ProgressMap } from "./components/ProgressMap";
import { QuizScreen } from "./components/QuizScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { UserProgress } from "./components/UserProgress";
import { WelcomeScreen } from "./components/WelcomeScreen";

type Screen =
  | "welcome"
  | "map"
  | "mission"
  | "chat"
  | "quiz"
  | "progress"
  | "leaderboard"
  | "challenge"
  | "api-creator"
  | "glossary"
  | "lab"
  | "settings"
  | "history"
  | "fundamentals";

export interface UserState {
  currentStep: number;
  completedSteps: number[];
  completedQuizzes: number[]; // Track which quizzes have been completed
  quizScores: Record<
    number,
    { score: number; totalQuestions: number; attempts: number }
  >; // Detailed quiz performance
  score: number;
  level: number;
  achievements: string[];
  challengesCompleted: number;
  bestTimes: Record<number, number>;
  hintsUsed: number;
  apisCreated: number;
  totalPlayTime: number;
  lastActive: Date;
  fundamentalsRead: string[]; // Track which fundamental topics have been read
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  animationsEnabled: boolean;
  hintsEnabled: boolean;
  difficulty: "easy" | "medium" | "hard";
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [currentMission, setCurrentMission] = useState<number>(0);
  const [userState, setUserState] = useState<UserState>({
    currentStep: 0,
    completedSteps: [],
    completedQuizzes: [],
    quizScores: {},
    score: 0,
    level: 1,
    achievements: [],
    challengesCompleted: 0,
    bestTimes: {},
    hintsUsed: 0,
    apisCreated: 0,
    totalPlayTime: 0,
    lastActive: new Date(),
    fundamentalsRead: [],
  });

  const [settings, setSettings] = useState<AppSettings>({
    theme: "system",
    soundEnabled: true,
    animationsEnabled: true,
    hintsEnabled: true,
    difficulty: "medium",
  });

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [settings.theme]);

  // Save/load state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("webquest-user-state");
    const savedSettings = localStorage.getItem("webquest-settings");

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setUserState({
          ...parsed,
          lastActive: new Date(parsed.lastActive),
          // Ensure backward compatibility
          completedQuizzes: parsed.completedQuizzes || [],
          quizScores: parsed.quizScores || {},
          fundamentalsRead: parsed.fundamentalsRead || [],
        });
      } catch (e) {
        console.error("Failed to load user state:", e);
      }
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("webquest-user-state", JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    localStorage.setItem("webquest-settings", JSON.stringify(settings));
  }, [settings]);

  const navigateToScreen = (screen: Screen, missionIndex?: number) => {
    setCurrentScreen(screen);
    if (missionIndex !== undefined) {
      setCurrentMission(missionIndex);
    }
  };

  const updateUserProgress = (updates: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...updates, lastActive: new Date() }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Helper function to check if a mission can be unlocked
  const canUnlockMission = (missionIndex: number): boolean => {
    if (missionIndex === 0) return true;

    const previousMission = missionIndex - 1;
    const isPreviousMissionCompleted =
      userState.completedSteps.includes(previousMission);

    // For missions 2 and above, also require quiz completion of previous mission
    if (missionIndex >= 2) {
      const isPreviousQuizCompleted =
        userState.completedQuizzes.includes(previousMission);
      return isPreviousMissionCompleted && isPreviousQuizCompleted;
    }

    return isPreviousMissionCompleted;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen onNavigate={navigateToScreen} userState={userState} />
        );
      case "map":
        return (
          <ProgressMap
            userState={userState}
            onNavigate={navigateToScreen}
            canUnlockMission={canUnlockMission}
          />
        );
      case "mission":
        return (
          <MissionScreen
            missionIndex={currentMission}
            userState={userState}
            onNavigate={navigateToScreen}
            onUpdateProgress={updateUserProgress}
          />
        );
      case "chat":
        return <ChatScreen onNavigate={navigateToScreen} />;
      case "quiz":
        return (
          <QuizScreen
            missionIndex={currentMission}
            userState={userState}
            onNavigate={navigateToScreen}
            onUpdateProgress={updateUserProgress}
          />
        );
      case "progress":
        return (
          <UserProgress userState={userState} onNavigate={navigateToScreen} />
        );
      case "leaderboard":
        return (
          <LeaderboardScreen
            userState={userState}
            onNavigate={navigateToScreen}
          />
        );
      case "challenge":
        return (
          <ChallengeMode
            userState={userState}
            settings={settings}
            onNavigate={navigateToScreen}
            onUpdateProgress={updateUserProgress}
          />
        );
      case "api-creator":
        return (
          <APICreator
            userState={userState}
            onNavigate={navigateToScreen}
            onUpdateProgress={updateUserProgress}
          />
        );
      case "glossary":
        return <GlossaryScreen onNavigate={navigateToScreen} />;
      case "lab":
        return <LabScreen />;
      case "fundamentals":
        return (
          <FundamentalsScreen
            userState={userState}
            onNavigate={navigateToScreen}
            onUpdateProgress={updateUserProgress}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            settings={settings}
            userState={userState}
            onNavigate={navigateToScreen}
            onUpdateSettings={updateSettings}
          />
        );
      case "history":
        return <PerformanceHistory onNavigate={navigateToScreen} />;
      default:
        return (
          <WelcomeScreen onNavigate={navigateToScreen} userState={userState} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      {renderScreen()}
    </div>
  );
}
