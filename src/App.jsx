import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { 
  Eye, EyeOff, LogOut, Settings, Users, Plus, Edit, Trash2, Play, Pause, Square, 
  Activity, TrendingUp, Clock, Mail, CheckCircle, XCircle, AlertCircle, 
  BarChart3, PieChart, Download, Filter, Search, Bell, Moon, Sun, 
  Zap, Globe, Shield, Target, Rocket, Database, Wifi, WifiOff
} from 'lucide-react';
import './App.css';

// Simulação de banco de dados
const USERS_DB = [
  { id: 1, email: 'angelton@gmail.com', password: 'mosemp78', name: 'Angelton Alencar', role: 'admin', active: true, createdAt: '2025-08-26', avatar: 'AA' }
];

const CAMPAIGNS_DB = [
  {
    id: 1,
    name: 'Campanha Manus VIP',
    userId: 1,
    targetUrl: 'https://manus.im/invitation/LNHP1P7J7UO921',
    status: 'running',
    totalRegistrations: 100,
    completedRegistrations: 45,
    successfulRegistrations: 42,
    failedRegistrations: 3,
    parallelWorkers: 3,
    intervalRange: [30, 60],
    captchaKey: '75c2e3c436c5b8deabe099f794b2b8de',
    createdAt: '2025-08-26 09:00:00',
    startedAt: '2025-08-26 09:15:00',
    estimatedCompletion: '2025-08-26 11:30:00',
    successRate: 93.3,
    avgTimePerRegistration: 45,
    currentWorkers: 3,
    emailsGenerated: 48,
    captchasSolved: 45,
    logs: []
  },
  {
    id: 2,
    name: 'Teste Beta Users',
    userId: 1,
    targetUrl: 'https://manus.im/invitation/BETA2024',
    status: 'paused',
    totalRegistrations: 50,
    completedRegistrations: 20,
    successfulRegistrations: 18,
    failedRegistrations: 2,
    parallelWorkers: 2,
    intervalRange: [45, 90],
    captchaKey: '75c2e3c436c5b8deabe099f794b2b8de',
    createdAt: '2025-08-25 14:00:00',
    startedAt: '2025-08-25 14:30:00',
    pausedAt: '2025-08-26 08:00:00',
    successRate: 90.0,
    avgTimePerRegistration: 52,
    currentWorkers: 0,
    emailsGenerated: 22,
    captchasSolved: 20,
    logs: []
  }
];

// Context para autenticação
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setDarkMode(savedDarkMode);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = USERS_DB.find(u => u.email === email && u.password === password && u.active);
    if (foundUser) {
      const userSession = { id: foundUser.id, email: foundUser.email, name: foundUser.name, role: foundUser.role, avatar: foundUser.avatar };
      setUser(userSession);
      localStorage.setItem('user', JSON.stringify(userSession));
      return { success: true };
    }
    return { success: false, message: 'Email ou senha inválidos' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const resetPassword = (email) => {
    const foundUser = USERS_DB.find(u => u.email === email && u.active);
    if (foundUser) {
      return { success: true, message: 'Email de recuperação enviado!' };
    }
    return { success: false, message: 'Email não encontrado' };
  };

  const changePassword = (currentPassword, newPassword) => {
    const foundUser = USERS_DB.find(u => u.id === user.id && u.password === currentPassword);
    if (foundUser) {
      foundUser.password = newPassword;
      return { success: true, message: 'Senha alterada com sucesso!' };
    }
    return { success: false, message: 'Senha atual incorreta' };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, resetPassword, changePassword, loading, darkMode, toggleDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Hook para simulação de WebSocket/Real-time
const useRealTimeUpdates = (campaignId) => {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!campaignId) return;

    // Simulação de conexão WebSocket
    setConnected(true);
    
    const interval = setInterval(() => {
      const campaign = CAMPAIGNS_DB.find(c => c.id === campaignId);
      if (campaign && campaign.status === 'running') {
        // Simular progresso
        if (campaign.completedRegistrations < campaign.totalRegistrations) {
          campaign.completedRegistrations += Math.floor(Math.random() * 2) + 1;
          campaign.successfulRegistrations += Math.floor(Math.random() * 2);
          campaign.failedRegistrations = campaign.completedRegistrations - campaign.successfulRegistrations;
          campaign.successRate = ((campaign.successfulRegistrations / campaign.completedRegistrations) * 100).toFixed(1);
          
          // Adicionar log
          const logTypes = ['SUCCESS', 'ERROR', 'INFO', 'WARNING'];
          const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
          const timestamp = new Date().toLocaleTimeString();
          const messages = {
            SUCCESS: `Registro concluído para temp_email_${campaign.completedRegistrations}@tempmail.com`,
            ERROR: `Falha no captcha para temp_email_${campaign.completedRegistrations + 1}@tempmail.com`,
            INFO: `Worker ${Math.floor(Math.random() * campaign.parallelWorkers) + 1} processando...`,
            WARNING: `Rate limit detectado, aguardando ${Math.floor(Math.random() * 30) + 10}s`
          };
          
          campaign.logs.unshift({
            id: Date.now(),
            timestamp,
            type: logType,
            message: messages[logType]
          });
          
          // Manter apenas os últimos 50 logs
          if (campaign.logs.length > 50) {
            campaign.logs = campaign.logs.slice(0, 50);
          }
        }
        
        setData({ ...campaign });
      }
    }, 2000 + Math.random() * 3000); // Intervalo variável para simular realismo

    return () => {
      clearInterval(interval);
      setConnected(false);
    };
  }, [campaignId]);

  return { data, connected };
};

// Componente de Login com design moderno
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, resetPassword, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = login(email, password);
    if (result.success) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const result = resetPassword(resetEmail);
    if (result.success) {
      toast.success(result.message);
      setShowForgotPassword(false);
      setResetEmail('');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema de Registro em Massa
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-11 border-slate-200 dark:border-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="h-11 pr-10 border-slate-200 dark:border-slate-700"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Esqueceu sua senha?
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Digite seu email para receber as instruções de recuperação
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Enviar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente de estatísticas em tempo real
const RealTimeStats = ({ campaigns }) => {
  const totalCampaigns = campaigns.length;
  const runningCampaigns = campaigns.filter(c => c.status === 'running').length;
  const totalRegistrations = campaigns.reduce((sum, c) => sum + c.completedRegistrations, 0);
  const totalSuccess = campaigns.reduce((sum, c) => sum + c.successfulRegistrations, 0);
  const avgSuccessRate = totalRegistrations > 0 ? ((totalSuccess / totalRegistrations) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total de Campanhas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalCampaigns}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Campanhas Ativas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{runningCampaigns}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total de Registros</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalRegistrations}</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgSuccessRate}%</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente de Campanhas com design moderno
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS_DB);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    targetUrl: 'https://manus.im/invitation/',
    totalRegistrations: 50,
    parallelWorkers: [2],
    intervalRange: [30, 60],
    captchaKey: '75c2e3c436c5b8deabe099f794b2b8de'
  });
  const { user } = useAuth();

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) {
      toast.error('Nome da campanha é obrigatório');
      return;
    }
    if (!newCampaign.targetUrl.trim()) {
      toast.error('URL alvo é obrigatória');
      return;
    }

    const campaign = {
      id: campaigns.length + 1,
      ...newCampaign,
      userId: user.id,
      status: 'created',
      completedRegistrations: 0,
      successfulRegistrations: 0,
      failedRegistrations: 0,
      parallelWorkers: newCampaign.parallelWorkers[0],
      createdAt: new Date().toLocaleString(),
      successRate: 0,
      avgTimePerRegistration: 0,
      currentWorkers: 0,
      emailsGenerated: 0,
      captchasSolved: 0,
      logs: []
    };

    setCampaigns([...campaigns, campaign]);
    CAMPAIGNS_DB.push(campaign);
    setNewCampaign({
      name: '',
      targetUrl: 'https://manus.im/invitation/',
      totalRegistrations: 50,
      parallelWorkers: [2],
      intervalRange: [30, 60],
      captchaKey: '75c2e3c436c5b8deabe099f794b2b8de'
    });
    setShowCreateCampaign(false);
    toast.success(`Campanha "${campaign.name}" criada com sucesso!`);
  };

  const handleCampaignAction = (campaignId, action) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === campaignId) {
        const updatedCampaign = { ...c };
        switch (action) {
          case 'start':
            updatedCampaign.status = 'running';
            updatedCampaign.startedAt = new Date().toLocaleString();
            updatedCampaign.currentWorkers = updatedCampaign.parallelWorkers;
            toast.success(`Campanha "${c.name}" iniciada!`);
            break;
          case 'pause':
            updatedCampaign.status = 'paused';
            updatedCampaign.pausedAt = new Date().toLocaleString();
            updatedCampaign.currentWorkers = 0;
            toast.info(`Campanha "${c.name}" pausada!`);
            break;
          case 'stop':
            updatedCampaign.status = 'stopped';
            updatedCampaign.stoppedAt = new Date().toLocaleString();
            updatedCampaign.currentWorkers = 0;
            toast.warning(`Campanha "${c.name}" parada!`);
            break;
        }
        // Atualizar também no CAMPAIGNS_DB
        const dbCampaign = CAMPAIGNS_DB.find(db => db.id === campaignId);
        if (dbCampaign) Object.assign(dbCampaign, updatedCampaign);
        return updatedCampaign;
      }
      return c;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'stopped': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="h-3 w-3" />;
      case 'paused': return <Pause className="h-3 w-3" />;
      case 'stopped': return <Square className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <RealTimeStats campaigns={campaigns} />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold">Gerenciar Campanhas</CardTitle>
              <CardDescription>
                Crie e gerencie suas campanhas de registro em massa
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowCreateCampaign(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge className={`${getStatusColor(campaign.status)} flex items-center space-x-1`}>
                        {getStatusIcon(campaign.status)}
                        <span className="capitalize">{campaign.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'created' || campaign.status === 'paused' ? (
                        <Button
                          size="sm"
                          onClick={() => handleCampaignAction(campaign.id, 'start')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Iniciar
                        </Button>
                      ) : null}
                      {campaign.status === 'running' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCampaignAction(campaign.id, 'pause')}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pausar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCampaignAction(campaign.id, 'stop')}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Parar
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.completedRegistrations}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Concluídos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{campaign.successfulRegistrations}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Sucessos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{campaign.failedRegistrations}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Falhas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{campaign.successRate}%</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Taxa de Sucesso</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{campaign.completedRegistrations}/{campaign.totalRegistrations}</span>
                    </div>
                    <Progress 
                      value={(campaign.completedRegistrations / campaign.totalRegistrations) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">URL Alvo:</p>
                      <p className="font-medium truncate">{campaign.targetUrl}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Workers Ativos:</p>
                      <p className="font-medium">{campaign.currentWorkers}/{campaign.parallelWorkers}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Emails Gerados:</p>
                      <p className="font-medium">{campaign.emailsGenerated}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Criada em:</p>
                      <p className="font-medium">{campaign.createdAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Campanha de Registro</DialogTitle>
            <DialogDescription>
              Configure os parâmetros para sua nova campanha de registro em massa
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCampaign}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nome da Campanha</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Minha Nova Campanha"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalRegistrations">Número de Registros</Label>
                  <Input
                    id="totalRegistrations"
                    type="number"
                    value={newCampaign.totalRegistrations}
                    onChange={(e) => setNewCampaign({ ...newCampaign, totalRegistrations: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="1000"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetUrl">URL Alvo</Label>
                <Input
                  id="targetUrl"
                  value={newCampaign.targetUrl}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetUrl: e.target.value })}
                  placeholder="https://manus.im/invitation/CODIGO_CONVITE"
                  required
                />
                <p className="text-xs text-slate-500">
                  Suporte a URLs de convite do Manus.im e outras URLs de registro
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parallelWorkers">Workers Paralelos</Label>
                  <Slider
                    id="parallelWorkers"
                    value={newCampaign.parallelWorkers}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, parallelWorkers: value })}
                    max={10}
                    min={1}
                    step={1}
                  />
                  <span className="text-sm text-slate-500">{newCampaign.parallelWorkers[0]} Workers</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intervalRange">Intervalo (segundos)</Label>
                  <Slider
                    id="intervalRange"
                    value={newCampaign.intervalRange}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, intervalRange: value })}
                    min={10}
                    max={120}
                    step={5}
                  />
                  <span className="text-sm text-slate-500">{newCampaign.intervalRange[0]} - {newCampaign.intervalRange[1]} segundos</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="captchaKey">Chave API 2Captcha</Label>
                <Input
                  id="captchaKey"
                  type="password"
                  value={newCampaign.captchaKey}
                  onChange={(e) => setNewCampaign({ ...newCampaign, captchaKey: e.target.value })}
                  placeholder="Sua chave API do 2Captcha"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowCreateCampaign(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Criar Campanha
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente de Monitoramento em Tempo Real
const Monitoring = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(CAMPAIGNS_DB[0]?.id || null);
  const [campaigns] = useState(CAMPAIGNS_DB);
  const { data: campaignData, connected } = useRealTimeUpdates(selectedCampaign);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [campaignData?.logs]);

  const campaign = campaignData || campaigns.find(c => c.id === selectedCampaign);

  if (!campaign) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Nenhuma campanha selecionada</p>
        </CardContent>
      </Card>
    );
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ERROR': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'WARNING': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Monitoramento em Tempo Real</span>
                {connected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso das suas campanhas em tempo real
              </CardDescription>
            </div>
            <Select value={selectedCampaign?.toString()} onValueChange={(value) => setSelectedCampaign(parseInt(value))}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione uma campanha" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Estatísticas principais */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{campaign.completedRegistrations}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Concluídos</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{campaign.successfulRegistrations}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sucessos</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{campaign.failedRegistrations}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Falhas</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{campaign.successRate}%</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Taxa</p>
                  </div>
                </Card>
              </div>
              
              <Card className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da Campanha</span>
                    <span>{campaign.completedRegistrations}/{campaign.totalRegistrations}</span>
                  </div>
                  <Progress 
                    value={(campaign.completedRegistrations / campaign.totalRegistrations) * 100} 
                    className="h-3"
                  />
                </div>
              </Card>
            </div>
            
            {/* Informações da campanha */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Informações da Campanha</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Nome:</p>
                  <p className="font-medium">{campaign.name}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Status:</p>
                  <Badge className={`${getStatusColor(campaign.status)} mt-1`}>
                    {campaign.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Workers Ativos:</p>
                  <p className="font-medium">{campaign.currentWorkers}/{campaign.parallelWorkers}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Emails Gerados:</p>
                  <p className="font-medium">{campaign.emailsGenerated}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Captchas Resolvidos:</p>
                  <p className="font-medium">{campaign.captchasSolved}</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Logs em tempo real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Logs em Tempo Real</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 font-mono text-sm">
            {campaign.logs && campaign.logs.length > 0 ? (
              campaign.logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2 mb-2">
                  {getLogIcon(log.type)}
                  <span className="text-slate-500 dark:text-slate-400 min-w-[80px]">[{log.timestamp}]</span>
                  <span className={`font-medium ${
                    log.type === 'SUCCESS' ? 'text-green-600' :
                    log.type === 'ERROR' ? 'text-red-600' :
                    log.type === 'WARNING' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {log.type}:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{log.message}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                Nenhum log disponível. Inicie uma campanha para ver os logs em tempo real.
              </p>
            )}
            <div ref={logsEndRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function para status de campanha
const getStatusColor = (status) => {
  switch (status) {
    case 'running': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'stopped': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

// Componente de Relatórios
const Reports = () => {
  const [campaigns] = useState(CAMPAIGNS_DB);
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const filteredCampaigns = selectedCampaign === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.id.toString() === selectedCampaign);

  const totalStats = {
    totalCampaigns: filteredCampaigns.length,
    totalRegistrations: filteredCampaigns.reduce((sum, c) => sum + c.completedRegistrations, 0),
    totalSuccess: filteredCampaigns.reduce((sum, c) => sum + c.successfulRegistrations, 0),
    totalFailed: filteredCampaigns.reduce((sum, c) => sum + c.failedRegistrations, 0),
    avgSuccessRate: 0
  };
  
  totalStats.avgSuccessRate = totalStats.totalRegistrations > 0 
    ? ((totalStats.totalSuccess / totalStats.totalRegistrations) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Relatórios e Analytics</span>
              </CardTitle>
              <CardDescription>
                Visualize os resultados detalhados das suas campanhas
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Campanhas</SelectItem>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estatísticas gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalStats.totalCampaigns}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total de Campanhas</p>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{totalStats.totalSuccess}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Registros Bem-sucedidos</p>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{totalStats.totalFailed}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Registros Falharam</p>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-purple-500">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{totalStats.avgSuccessRate}%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Taxa de Sucesso Média</p>
              </div>
            </Card>
          </div>

          {/* Lista detalhada de campanhas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Campanhas Detalhadas</h3>
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Criada em: {campaign.createdAt}
                      </p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Total</p>
                      <p className="text-lg font-semibold">{campaign.totalRegistrations}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Concluídos</p>
                      <p className="text-lg font-semibold text-blue-600">{campaign.completedRegistrations}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Sucessos</p>
                      <p className="text-lg font-semibold text-green-600">{campaign.successfulRegistrations}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Falhas</p>
                      <p className="text-lg font-semibold text-red-600">{campaign.failedRegistrations}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Taxa</p>
                      <p className="text-lg font-semibold text-purple-600">{campaign.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Emails</p>
                      <p className="text-lg font-semibold">{campaign.emailsGenerated}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{campaign.completedRegistrations}/{campaign.totalRegistrations}</span>
                    </div>
                    <Progress 
                      value={(campaign.completedRegistrations / campaign.totalRegistrations) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        URL: {campaign.targetUrl}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          CSV
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

  // Componente de Configurações (Definição única)
  const SettingsComponent = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user, changePassword, darkMode, toggleDarkMode } = useAuth();

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      toast.success(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações da Conta</span>
          </CardTitle>
          <CardDescription>Gerencie suas configurações pessoais e de segurança</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações da conta */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações da Conta</h3>
            <Card className="p-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.avatar || user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
                  <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
          
          <Separator />
          
          {/* Preferências */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferências</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo Escuro</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Alterne entre tema claro e escuro
                </p>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </div>
          
          <Separator />
          
          {/* Alterar senha */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Segurança</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Sua senha atual"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha (mín. 6 caracteres)"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Shield className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente de Gerenciamento de Usuários
const UserManagement = () => {
  const [users, setUsers] = useState(USERS_DB);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (users.find(u => u.email === newUser.email)) {
      toast.error('Email já cadastrado');
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      avatar: newUser.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
    };

    setUsers([...users, user]);
    USERS_DB.push(user);
    setNewUser({ name: '', email: '', password: '', role: 'user' });
    setShowAddUser(false);
    toast.success('Usuário adicionado com sucesso!');
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, active: !u.active } : u
    ));
    const dbUser = USERS_DB.find(u => u.id === userId);
    if (dbUser) dbUser.active = !dbUser.active;
    toast.success('Status do usuário atualizado!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gerenciamento de Usuários</span>
              </CardTitle>
              <CardDescription>Gerencie os usuários do sistema</CardDescription>
            </div>
            <Button 
              onClick={() => setShowAddUser(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </Badge>
                      <Badge variant={user.active ? 'default' : 'destructive'}>
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.active ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Criado em: {user.createdAt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Adicione um novo usuário ao sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Nome Completo</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome do usuário"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPassword">Senha</Label>
                <Input
                  id="userPassword"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Senha (mín. 6 caracteres)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">Função</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente principal do Dashboard
const Dashboard = () => {
  const { user, logout, darkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Sistema de Registro em Massa
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.avatar || user?.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.name}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="campaigns" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Campanhas</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Monitoramento</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Relatórios</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </TabsTrigger>
              {user?.role === 'admin' && (
                <TabsTrigger value="users" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Usuários</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="campaigns">
              <Campaigns />
            </TabsContent>
            <TabsContent value="monitoring">
              <Monitoring />
            </TabsContent>
            <TabsContent value="reports">
              <Reports />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsComponent />
            </TabsContent>
            {user?.role === 'admin' && (
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  );
};

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
};

// Componente principal da aplicação
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App font-sans">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

