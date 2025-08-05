export const generateMockHistory = () => {
  const sessions = [];
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    sessions.push({
      date: date.toISOString().split('T')[0],
      missionsCompleted: Math.floor(Math.random() * 3),
      xpEarned: Math.floor(Math.random() * 200) + 50,
      timeSpent: Math.floor(Math.random() * 60) + 15, // minutes
      accuracy: Math.floor(Math.random() * 40) + 60 // 60-100%
    });
  }
  
  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const generateWeeklyStats = () => {
  return {
    totalXP: Math.floor(Math.random() * 500) + 300,
    totalMissions: Math.floor(Math.random() * 10) + 5,
    averageAccuracy: Math.floor(Math.random() * 20) + 75,
    totalTime: Math.floor(Math.random() * 300) + 120
  };
};

export const generateLearningPath = () => {
  return [
    { topic: 'HTTP Basics', progress: 100, completed: true },
    { topic: 'DNS Resolution', progress: 85, completed: false },
    { topic: 'TCP Connections', progress: 60, completed: false },
    { topic: 'Security Protocols', progress: 30, completed: false },
    { topic: 'Performance Optimization', progress: 10, completed: false }
  ];
};