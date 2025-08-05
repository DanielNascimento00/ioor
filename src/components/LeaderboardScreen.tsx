import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Trophy, Medal, Crown, Clock, Target, Zap } from 'lucide-react';
import type { UserState } from '../App';

interface LeaderboardScreenProps {
  userState: UserState;
  onNavigate: (screen: 'welcome' | 'map') => void;
}

// Mock leaderboard data - in real app this would come from backend
const generateMockLeaderboard = (userState: UserState) => {
  const users = [
    { name: 'DevMaster', score: userState.score + 150, level: userState.level + 1, achievements: 12, bestTime: 45 },
    { name: 'CodeNinja', score: userState.score + 75, level: userState.level, achievements: 8, bestTime: 52 },
    { name: 'Você', score: userState.score, level: userState.level, achievements: userState.achievements.length, bestTime: Math.min(...Object.values(userState.bestTimes)) || 0 },
    { name: 'WebExplorer', score: userState.score - 25, level: Math.max(1, userState.level - 1), achievements: 6, bestTime: 58 },
    { name: 'HTTPHero', score: userState.score - 100, level: Math.max(1, userState.level - 1), achievements: 5, bestTime: 62 },
    { name: 'APIAce', score: userState.score - 200, level: Math.max(1, userState.level - 2), achievements: 4, bestTime: 67 },
    { name: 'NetNavigator', score: userState.score - 350, level: Math.max(1, userState.level - 2), achievements: 3, bestTime: 71 },
    { name: 'ProtocolPro', score: userState.score - 500, level: Math.max(1, userState.level - 3), achievements: 2, bestTime: 78 }
  ].sort((a, b) => b.score - a.score);

  return users.map((user, index) => ({
    ...user,
    rank: index + 1
  }));
};

export function LeaderboardScreen({ userState, onNavigate }: LeaderboardScreenProps) {
  const leaderboard = generateMockLeaderboard(userState);
  const userRank = leaderboard.find(u => u.name === 'Você')?.rank || 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-yellow-600';
      case 2: return 'from-gray-400 to-gray-500';
      case 3: return 'from-amber-600 to-amber-700';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const weeklyData = [
    { name: 'DevMaster', score: 850, challenges: 12 },
    { name: 'CodeNinja', score: 720, challenges: 8 },
    { name: 'Você', score: userState.score, challenges: userState.challengesCompleted },
    { name: 'WebExplorer', score: 650, challenges: 5 },
    { name: 'HTTPHero', score: 580, challenges: 4 }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('welcome')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h1 className="text-3xl">Ranking Global</h1>
            </div>
            <p className="text-muted-foreground">
              Veja como você se compara com outros desenvolvedores
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Sua Posição</div>
            <div className="text-2xl">#{userRank}</div>
          </div>
        </motion.div>

        {/* User Stats Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`p-6 bg-gradient-to-r ${getRankColor(userRank)} text-white`}>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">{getRankIcon(userRank)}</div>
                <div className="text-sm opacity-90">Posição Global</div>
              </div>
              <div>
                <div className="text-3xl mb-2">{userState.score}</div>
                <div className="text-sm opacity-90">XP Total</div>
              </div>
              <div>
                <div className="text-3xl mb-2">{userState.level}</div>
                <div className="text-sm opacity-90">Nível</div>
              </div>
              <div>
                <div className="text-3xl mb-2">{userState.achievements.length}</div>
                <div className="text-sm opacity-90">Conquistas</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Leaderboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="global">
                <Trophy className="w-4 h-4 mr-2" />
                Global
              </TabsTrigger>
              <TabsTrigger value="weekly">
                <Target className="w-4 h-4 mr-2" />
                Semanal
              </TabsTrigger>
              <TabsTrigger value="speed">
                <Zap className="w-4 h-4 mr-2" />
                Velocidade
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">Ranking por Experiência</h3>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        user.name === 'Você' 
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' 
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <div>
                          <div className={`font-medium ${user.name === 'Você' ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Nível {user.level} • {user.achievements} conquistas
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{user.score} XP</div>
                        <div className="text-sm text-muted-foreground">
                          {user.bestTime > 0 ? `${user.bestTime}s melhor tempo` : 'Sem tempos'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">Ranking Semanal</h3>
                <div className="space-y-3">
                  {weeklyData.map((user, index) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        user.name === 'Você' 
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' 
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white">
                          #{index + 1}
                        </div>
                        <div>
                          <div className={`font-medium ${user.name === 'Você' ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.challenges} desafios completos
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{user.score} XP</div>
                        <Badge variant="outline" className="text-xs">
                          Esta semana
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="speed" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">Melhores Tempos</h3>
                <div className="space-y-3">
                  {leaderboard.filter(u => u.bestTime > 0).sort((a, b) => a.bestTime - b.bestTime).map((user, index) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        user.name === 'Você' 
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' 
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className={`font-medium ${user.name === 'Você' ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Nível {user.level}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-orange-600">{user.bestTime}s</div>
                        <div className="text-sm text-muted-foreground">
                          Melhor tempo
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-8"
        >
          <Button
            onClick={() => onNavigate('map')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Melhorar Posição
          </Button>
        </motion.div>
      </div>
    </div>
  );
}