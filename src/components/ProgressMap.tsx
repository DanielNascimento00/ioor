import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowDown, CheckCircle, Lock, Play, BookOpen, AlertCircle, Trophy, FlaskConical } from 'lucide-react';
import type { UserState } from '../App';
import { MISSIONS } from './utils/constants';

interface ProgressMapProps {
  userState: UserState;
  canUnlockMission: (missionIndex: number) => boolean;
  onNavigate: (screen: 'mission' | 'quiz' | 'welcome' | 'progress' | 'lab' | 'achievements', missionIndex?: number) => void;
}

export function ProgressMap({ userState, canUnlockMission, onNavigate }: ProgressMapProps) {
  const isStepCompleted = (stepIndex: number) => {
    return userState.completedSteps.includes(stepIndex);
  };

  const isQuizCompleted = (stepIndex: number) => {
    return userState.completedQuizzes.includes(stepIndex);
  };

  const hasQuiz = (stepIndex: number) => {
    // All missions from step 2 onwards have quizzes
    return stepIndex >= 2;
  };



  const getStepStatus = (stepIndex: number) => {
    if (!canUnlockMission(stepIndex)) {
      return 'locked';
    }
    
    if (isStepCompleted(stepIndex)) {
      if (hasQuiz(stepIndex) && !isQuizCompleted(stepIndex)) {
        return 'needs-quiz';
      }
      return 'completed';
    }
    
    return 'available';
  };

  const getQuizScore = (stepIndex: number) => {
    const score = userState.quizScores[stepIndex];
    return score ? Math.round((score.score / score.totalQuestions) * 100) : 0;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('welcome')}
            className="mb-6"
          >
            ← Voltar ao Início
          </Button>
          
          <h1 className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mapa da Jornada Web
          </h1>
          <p className="text-muted-foreground mb-6">
            Acompanhe o fluxo completo de uma requisição HTTP
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="secondary">
              Nível {userState.level}
            </Badge>
            <Badge variant="outline">
              {userState.completedSteps.length}/{MISSIONS.length} Missões
            </Badge>
            <Badge variant="outline">
              {userState.completedQuizzes.length}/{MISSIONS.filter((_, i) => hasQuiz(i)).length} Quizzes
            </Badge>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              {userState.score} XP
            </Badge>
          </div>
          
          {/* Quick Access Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => onNavigate('lab')}
              className="flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              Laboratório
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('achievements')}
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Conquistas
            </Button>
          </div>
        </motion.div>

        {/* Mission Map */}
        <div className="space-y-8">
          {MISSIONS.map((mission, index) => {
            const status = getStepStatus(mission.id);
            const quizScore = getQuizScore(mission.id);
            
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className={`p-6 ${
                  status === 'completed' 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20' 
                    : status === 'needs-quiz'
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'
                    : status === 'available'
                    ? 'hover:shadow-lg transition-shadow cursor-pointer'
                    : 'opacity-60'
                }`}>
                  <div className="flex items-center gap-6">
                    {/* Character Avatar */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${mission.color} flex items-center justify-center text-2xl relative`}>
                      {mission.character}
                      {status === 'completed' && (
                        <div className="absolute -top-2 -right-2">
                          <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                        </div>
                      )}
                      {status === 'needs-quiz' && (
                        <div className="absolute -top-2 -right-2">
                          <AlertCircle className="w-6 h-6 text-yellow-500 bg-white rounded-full" />
                        </div>
                      )}
                      {status === 'locked' && (
                        <div className="absolute -top-2 -right-2">
                          <Lock className="w-6 h-6 text-gray-500 bg-white rounded-full p-1" />
                        </div>
                      )}
                    </div>

                    {/* Mission Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{mission.title}</h3>
                        {hasQuiz(mission.id) && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Quiz
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {mission.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {status === 'available' && (
                          <Button
                            onClick={() => onNavigate('mission', mission.id)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Iniciar Missão
                          </Button>
                        )}

                        {status === 'needs-quiz' && (
                          <>
                            <Button
                              onClick={() => onNavigate('quiz', mission.id)}
                              className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Fazer Quiz
                            </Button>
                            <Badge variant="secondary" className="text-yellow-600">
                              Quiz Pendente!
                            </Badge>
                          </>
                        )}

                        {status === 'completed' && (
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              variant="outline"
                              onClick={() => onNavigate('mission', mission.id)}
                            >
                              Revisar Missão
                            </Button>
                            
                            {hasQuiz(mission.id) && (
                              <Button
                                variant="outline"
                                onClick={() => onNavigate('quiz', mission.id)}
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                {isQuizCompleted(mission.id) ? 'Refazer Quiz' : 'Fazer Quiz'}
                              </Button>
                            )}
                            
                            <Badge variant="secondary" className="text-green-600">
                              ✓ Completa
                            </Badge>
                            
                            {isQuizCompleted(mission.id) && (
                              <Badge variant="outline" className="text-blue-600">
                                Quiz: {quizScore}%
                              </Badge>
                            )}
                          </div>
                        )}

                        {status === 'locked' && (
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-gray-500">
                              Bloqueada
                            </Badge>
                            {mission.id >= 2 && (
                              <Badge variant="outline" className="text-xs">
                                Requer quiz anterior
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Progress Requirements */}
                      {status === 'locked' && mission.id >= 2 && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm">
                          <p className="text-muted-foreground">
                            Para desbloquear: Complete a missão anterior {!userState.completedQuizzes.includes(mission.id - 1) ? 'e faça o quiz' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Arrow to next step */}
                {index < MISSIONS.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <ArrowDown className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            onClick={() => onNavigate('progress')}
            className="mr-4"
          >
            Ver Conquistas
          </Button>
        </motion.div>
      </div>
    </div>
  );
}