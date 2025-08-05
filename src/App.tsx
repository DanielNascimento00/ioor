import { useEffect, useState } from "react";
import { AchievementsScreen } from "./components/AchievementsScreen";
import { APICreator } from "./components/APICreator";
import { ChallengeMode } from "./components/ChallengeMode";
import { ChatScreen } from "./components/ChatScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { FundamentalsScreen } from "./components/FundamentalsScreen";
import { GlossaryScreen } from "./components/GlossaryScreen";
import { LabScreen } from "./components/LabScreen";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { MissionScreen } from "./components/MissionScreen";
import { NotificationSystem, useNotifications } from "./components/NotificationSystem";
import { PerformanceHistory } from "./components/PerformanceHistory";
import { ProgressMap } from "./components/ProgressMap";
import { QuizScreen } from "./components/QuizScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { TutorialScreen } from "./components/TutorialScreen";
import { UserProgress } from "./components/UserProgress";
import { WelcomeScreen } from "./components/WelcomeScreen";

type Screen =
  | "welcome"
  | "tutorial"
  | "dashboard"
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
  | "fundamentals"
  | "achievements";

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
  
  // Notification system
  const {
    notifications,
    dismissNotification,
    clearAllNotifications,
    notifyAchievement,
    notifyLevelUp
  } = useNotifications();
  
  const [userState, setUserState] = useState<UserState>({
    currentStep: 3,
    completedSteps: [0, 1, 2],
    completedQuizzes: [1, 2],
    quizScores: {
      1: { score: 4, totalQuestions: 5, attempts: 1 },
      2: { score: 5, totalQuestions: 5, attempts: 1 }
    },
    score: 500,
    level: 2,
    achievements: ['first-steps', 'web-explorer', 'http-master'],
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
    setUserState(prev => {
      const newState = { ...prev, ...updates, lastActive: new Date() };
      
      // Check for level up
      if (updates.score !== undefined) {
        const newLevel = Math.floor(newState.score / 200) + 1;
        if (newLevel > prev.level) {
          newState.level = newLevel;
          notifyLevelUp(newLevel);
        }
      }
      
      // Check for new achievements
      if (updates.achievements && updates.achievements.length > prev.achievements.length) {
        const newAchievements = updates.achievements.filter(a => !prev.achievements.includes(a));
        newAchievements.forEach(achievementId => {
          // You can customize this based on your achievement data
          notifyAchievement(
            'Nova Conquista!',
            `Você desbloqueou: ${achievementId}`,
            { xp: 50 }
          );
        });
      }
      
      return newState;
    });
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
      case "tutorial":
        return (
          <TutorialScreen 
            userState={userState} 
            onNavigate={navigateToScreen}
            onUpdateProgress={updateUserProgress}
          />
        );
      case "dashboard":
        return (
          <DashboardScreen userState={userState} onNavigate={navigateToScreen} />
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
        return (
          <LabScreen
            userState={userState}
            onNavigate={navigateToScreen}
            onUpdateProgress={updateUserProgress}
          />
        );
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
      case "achievements":
        return (
          <AchievementsScreen
            userState={userState}
            onNavigate={navigateToScreen}
          />
        );
      default:
        return (
          <WelcomeScreen onNavigate={navigateToScreen} userState={userState} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      {renderScreen()}
      <NotificationSystem
        notifications={notifications}
        onDismiss={dismissNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
}
