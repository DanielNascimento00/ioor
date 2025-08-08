import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Settings, Moon, Sun, Volume2, VolumeX, Zap, ZapOff, HelpCircle, Trash2, Download, Upload } from 'lucide-react';
import type { UserState, AppSettings } from '../App';

interface SettingsScreenProps {
  settings: AppSettings;
  userState: UserState;
  onNavigate: (screen: 'welcome') => void;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
}

export function SettingsScreen({ settings, userState, onNavigate, onUpdateSettings }: SettingsScreenProps) {
  const exportData = () => {
    const data = {
      userState,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'webquest-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.settings) {
              onUpdateSettings(data.settings);
            }
            alert('Dados importados com sucesso!');
          } catch {
            alert('Erro ao importar dados. Verifique se o arquivo está correto.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const resetProgress = () => {
    if (confirm('Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('webquest-user-state');
      localStorage.removeItem('webquest-settings');
      alert('Progresso resetado! Recarregue a página para ver as mudanças.');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
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
            Voltar
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Settings className="w-6 h-6 text-gray-500" />
              <h1 className="text-3xl">Configurações</h1>
            </div>
            <p className="text-muted-foreground">
              Personalize sua experiência no IOOR
            </p>
          </div>

          <div className="w-24"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="mb-6">Aparência</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <div>
                      <div className="font-medium">Tema</div>
                      <div className="text-sm text-muted-foreground">
                        Escolha entre claro, escuro ou automático
                      </div>
                    </div>
                  </div>
                  <Select value={settings.theme} onValueChange={(value) => onUpdateSettings({ theme: value as 'light' | 'dark' | 'system' })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.animationsEnabled ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
                    <div>
                      <div className="font-medium">Animações</div>
                      <div className="text-sm text-muted-foreground">
                        Habilitar animações e transições
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => onUpdateSettings({ animationsEnabled: checked })}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Audio Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="mb-6">Áudio</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    <div>
                      <div className="font-medium">Efeitos Sonoros</div>
                      <div className="text-sm text-muted-foreground">
                        Sons de feedback e notificações
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => onUpdateSettings({ soundEnabled: checked })}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Learning Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="mb-6">Aprendizado</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Dicas Contextuais</div>
                      <div className="text-sm text-muted-foreground">
                        Mostrar dicas durante as missões
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.hintsEnabled}
                    onCheckedChange={(checked) => onUpdateSettings({ hintsEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dificuldade</div>
                    <div className="text-sm text-muted-foreground">
                      Nível de complexidade dos desafios
                    </div>
                  </div>
                  <Select value={settings.difficulty} onValueChange={(value) => onUpdateSettings({ difficulty: value as 'easy' | 'medium' | 'hard' })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="mb-6">Dados</h3>
              
              <div className="space-y-4">
                <Button onClick={exportData} variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Progresso
                </Button>
                
                <Button onClick={importData} variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Progresso
                </Button>

                <div className="border-t pt-4">
                  <Button 
                    onClick={resetProgress} 
                    variant="destructive" 
                    className="w-full justify-start"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Resetar Progresso
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h3 className="mb-6">Estatísticas do Usuário</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{userState.completedSteps.length}/7</div>
                <div className="text-sm text-muted-foreground">Missões Completas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{userState.score}</div>
                <div className="text-sm text-muted-foreground">XP Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{userState.achievements.length}</div>
                <div className="text-sm text-muted-foreground">Conquistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{userState.challengesCompleted}</div>
                <div className="text-sm text-muted-foreground">Desafios</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="p-6 text-center">
            <h3 className="mb-4">IOOR</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Versão 1.0.0 - Uma plataforma educativa gamificada para aprender desenvolvimento web
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Desenvolvido com React</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Motion Animations</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}