import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { X, Trophy, Star, Zap, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'achievement' | 'level-up' | 'mission-complete' | 'quiz-complete' | 'info' | 'warning';
  title: string;
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
  duration?: number; // in milliseconds, 0 for persistent
  data?: any; // additional data for the notification
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'achievement': return Trophy;
    case 'level-up': return Star;
    case 'mission-complete': return CheckCircle;
    case 'quiz-complete': return Zap;
    case 'info': return Info;
    case 'warning': return AlertTriangle;
    default: return Info;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'achievement': return 'from-yellow-500 to-orange-500';
    case 'level-up': return 'from-purple-500 to-pink-500';
    case 'mission-complete': return 'from-green-500 to-emerald-500';
    case 'quiz-complete': return 'from-blue-500 to-cyan-500';
    case 'info': return 'from-gray-500 to-slate-500';
    case 'warning': return 'from-red-500 to-rose-500';
    default: return 'from-gray-500 to-slate-500';
  }
};

const getNotificationBg = (type: Notification['type']) => {
  switch (type) {
    case 'achievement': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
    case 'level-up': return 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800';
    case 'mission-complete': return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
    case 'quiz-complete': return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
    case 'info': return 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
    case 'warning': return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
    default: return 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
  }
};

function NotificationItem({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const IconComponent = notification.icon || getNotificationIcon(notification.type);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(notification.id), 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 300, 
        scale: isVisible ? 1 : 0.8 
      }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-sm"
    >
      <Card className={`p-4 border-l-4 ${getNotificationBg(notification.type)} shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getNotificationColor(notification.type)} flex items-center justify-center text-white flex-shrink-0`}>
            <IconComponent className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            
            {notification.data && notification.type === 'achievement' && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  +{notification.data.xp} XP
                </Badge>
                {notification.data.title && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Título: {notification.data.title}
                  </Badge>
                )}
              </div>
            )}
            
            {notification.data && notification.type === 'level-up' && (
              <div className="mt-2">
                <Badge className={`bg-gradient-to-r ${getNotificationColor(notification.type)} text-white text-xs`}>
                  Nível {notification.data.newLevel}
                </Badge>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="w-6 h-6 p-0 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function NotificationSystem({ notifications, onDismiss, onClearAll }: NotificationSystemProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-h-screen overflow-y-auto">
      {notifications.length > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-end mb-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            Limpar Todas ({notifications.length})
          </Button>
        </motion.div>
      )}
      
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000 // default 5 seconds
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper functions for common notification types
  const notifyAchievement = (title: string, message: string, data?: { xp: number; title?: string }) => {
    return addNotification({
      type: 'achievement',
      title,
      message,
      data,
      duration: 8000 // achievements stay longer
    });
  };

  const notifyLevelUp = (newLevel: number) => {
    return addNotification({
      type: 'level-up',
      title: 'Parabéns!',
      message: `Você subiu para o nível ${newLevel}!`,
      data: { newLevel },
      duration: 6000
    });
  };

  const notifyMissionComplete = (missionTitle: string, xp: number) => {
    return addNotification({
      type: 'mission-complete',
      title: 'Missão Concluída!',
      message: `${missionTitle} - +${xp} XP`,
      duration: 4000
    });
  };

  const notifyQuizComplete = (score: number, totalQuestions: number, xp: number) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    return addNotification({
      type: 'quiz-complete',
      title: 'Quiz Concluído!',
      message: `${score}/${totalQuestions} corretas (${percentage}%) - +${xp} XP`,
      duration: 4000
    });
  };

  const notifyInfo = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  };

  const notifyWarning = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: duration ?? 8000 // warnings stay longer by default
    });
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    notifyAchievement,
    notifyLevelUp,
    notifyMissionComplete,
    notifyQuizComplete,
    notifyInfo,
    notifyWarning
  };
}