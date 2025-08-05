import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Plus, Play, Code, Trash2, Copy, CheckCircle } from 'lucide-react';
import { type UserState } from '../App';

interface APICreatorProps {
  userState: UserState;
  onNavigate: (screen: 'welcome' | 'map') => void;
  onUpdateProgress: (updates: Partial<UserState>) => void;
}

interface APIRoute {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  responseBody: string;
  statusCode: number;
  headers: Record<string, string>;
}

interface TestResult {
  route: APIRoute;
  success: boolean;
  response: unknown;
  time: number;
}

export function APICreator({ userState, onNavigate, onUpdateProgress }: APICreatorProps) {
  const [routes, setRoutes] = useState<APIRoute[]>([
    {
      id: '1',
      method: 'GET',
      path: '/users',
      description: 'Listar todos os usuários',
      responseBody: JSON.stringify([
        { id: 1, name: 'João Silva', email: 'joao@email.com' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com' }
      ], null, 2),
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  ]);

  const [newRoute, setNewRoute] = useState<Partial<APIRoute>>({
    method: 'GET',
    path: '',
    description: '',
    responseBody: '{\n  "message": "Hello World"\n}',
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' }
  });

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addRoute = () => {
    if (!newRoute.path || !newRoute.description) return;

    const route: APIRoute = {
      id: Date.now().toString(),
      method: newRoute.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      path: newRoute.path,
      description: newRoute.description,
      responseBody: newRoute.responseBody || '{}',
      statusCode: newRoute.statusCode || 200,
      headers: newRoute.headers || { 'Content-Type': 'application/json' }
    };

    setRoutes(prev => [...prev, route]);
    setNewRoute({
      method: 'GET',
      path: '',
      description: '',
      responseBody: '{\n  "message": "Hello World"\n}',
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    setIsCreating(false);

    // Update progress
    onUpdateProgress({
      apisCreated: userState.apisCreated + 1,
      score: userState.score + 25
    });
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(route => route.id !== id));
  };

  const testRoute = (route: APIRoute) => {
    const startTime = Date.now();
    
    // Simulate API call
    setTimeout(() => {
      const endTime = Date.now();
      const result: TestResult = {
        route,
        success: true,
        response: JSON.parse(route.responseBody),
        time: endTime - startTime
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    }, Math.random() * 1000 + 200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const generateCurlCommand = (route: APIRoute) => {
    const baseUrl = 'https://api.exemplo.com';
    let curl = `curl -X ${route.method} ${baseUrl}${route.path}`;
    
    Object.entries(route.headers).forEach(([key, value]) => {
      curl += ` -H "${key}: ${value}"`;
    });

    if (route.method === 'POST' || route.method === 'PUT') {
      curl += ` -d '${route.responseBody}'`;
    }

    return curl;
  };

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
            Voltar
          </Button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Code className="w-6 h-6 text-purple-500" />
              <h1 className="text-3xl">Criador de APIs</h1>
            </div>
            <p className="text-muted-foreground">
              Monte e teste suas próprias rotas de API
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">APIs Criadas</div>
            <div className="text-2xl">{userState.apisCreated}</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Routes Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create New Route */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Suas Rotas da API</h3>
                <Button 
                  onClick={() => setIsCreating(!isCreating)}
                  className="bg-gradient-to-r from-purple-500 to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Rota
                </Button>
              </div>

              {isCreating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t pt-4 mb-6 space-y-4"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <Select 
                      value={newRoute.method} 
                      onValueChange={(value) => setNewRoute(prev => ({ ...prev, method: value as 'GET' | 'POST' | 'PUT' | 'DELETE' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="/exemplo" 
                      value={newRoute.path}
                      onChange={(e) => setNewRoute(prev => ({ ...prev, path: e.target.value }))}
                    />
                    <Input 
                      placeholder="Status Code" 
                      type="number"
                      value={newRoute.statusCode}
                      onChange={(e) => setNewRoute(prev => ({ ...prev, statusCode: parseInt(e.target.value) }))}
                    />
                  </div>
                  <Input 
                    placeholder="Descrição da rota"
                    value={newRoute.description}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Textarea 
                    placeholder="Response body (JSON)"
                    value={newRoute.responseBody}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, responseBody: e.target.value }))}
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <Button onClick={addRoute} className="bg-green-500 hover:bg-green-600">
                      Criar Rota
                    </Button>
                    <Button onClick={() => setIsCreating(false)} variant="outline">
                      Cancelar
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Routes List */}
              <div className="space-y-4">
                {routes.map((route) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getMethodColor(route.method)}>
                          {route.method}
                        </Badge>
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                          {route.path}
                        </code>
                        <Badge variant="outline">
                          {route.statusCode}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => testRoute(route)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Testar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generateCurlCommand(route), route.id)}
                        >
                          {copiedId === route.id ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteRoute(route.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{route.description}</p>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                        Ver resposta
                      </summary>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 overflow-x-auto">
                        {route.responseBody}
                      </pre>
                    </details>
                  </motion.div>
                ))}

                {routes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma rota criada ainda.</p>
                    <p className="text-sm">Clique em "Nova Rota" para começar!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Test Results Panel */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-6">
              <h3 className="mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de Rotas</span>
                  <span>{routes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Testes Realizados</span>
                  <span>{testResults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                  <span>
                    {testResults.length > 0 
                      ? Math.round((testResults.filter(r => r.success).length / testResults.length) * 100)
                      : 0
                    }%
                  </span>
                </div>
              </div>
            </Card>

            {/* Test Results */}
            <Card className="p-6">
              <h3 className="mb-4">Resultados dos Testes</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20' 
                        : 'bg-red-50 border-red-200 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getMethodColor(result.route.method)} text-sm`}>
                          {result.route.method}
                        </Badge>
                        <code className="text-xs">{result.route.path}</code>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {result.time}ms
                      </Badge>
                    </div>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                        Ver resposta
                      </summary>
                      <pre className="bg-white dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </details>
                  </motion.div>
                ))}

                {testResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum teste realizado ainda.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* API Documentation Template */}
            <Card className="p-6">
              <h3 className="mb-4">Templates Úteis</h3>
              <Tabs defaultValue="users">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="users">Usuários</TabsTrigger>
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setNewRoute({
                      method: 'GET',
                      path: '/users',
                      description: 'Listar usuários',
                      responseBody: JSON.stringify([{id: 1, name: 'João', email: 'joao@email.com'}], null, 2),
                      statusCode: 200,
                      headers: { 'Content-Type': 'application/json' }
                    })}
                  >
                    GET /users
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setNewRoute({
                      method: 'POST',
                      path: '/users',
                      description: 'Criar usuário',
                      responseBody: JSON.stringify({id: 1, name: 'Novo Usuário', email: 'novo@email.com'}, null, 2),
                      statusCode: 201,
                      headers: { 'Content-Type': 'application/json' }
                    })}
                  >
                    POST /users
                  </Button>
                </TabsContent>
                <TabsContent value="posts" className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setNewRoute({
                      method: 'GET',
                      path: '/posts',
                      description: 'Listar posts',
                      responseBody: JSON.stringify([{id: 1, title: 'Meu Post', content: 'Conteúdo do post'}], null, 2),
                      statusCode: 200,
                      headers: { 'Content-Type': 'application/json' }
                    })}
                  >
                    GET /posts
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}