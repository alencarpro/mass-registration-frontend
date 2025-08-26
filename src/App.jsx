import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import './App.css';

// Placeholder components for routes
const Campaigns = () => (
  <Card className="w-[600px]">
    <CardHeader>
      <CardTitle>Nova Campanha de Registro</CardTitle>
      <CardDescription>Configure os parâmetros para sua campanha de registro em massa.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="campaignName">Nome da Campanha</Label>
        <Input id="campaignName" placeholder="Minha Primeira Campanha" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetUrl">URL Alvo</Label>
        <Input id="targetUrl" defaultValue="https://manus.im" disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="registrationCount">Número de Registros</Label>
        <Input id="registrationCount" type="number" defaultValue={10} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parallelWorkers">Workers Paralelos</Label>
        <Slider id="parallelWorkers" defaultValue={[2]} max={10} step={1} />
        <span className="text-sm text-gray-500">2 Workers</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="interval">Intervalo (segundos)</Label>
        <Slider id="interval" defaultValue={[30, 60]} min={10} max={120} step={5} />
        <span className="text-sm text-gray-500">30 - 60 segundos</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="captchaKey">Chave API 2Captcha</Label>
        <Input id="captchaKey" type="password" defaultValue="SUA_CHAVE_API_AQUI" />
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={() => toast.success("Campanha iniciada!")}>Iniciar Campanha</Button>
    </CardFooter>
  </Card>
);

const Monitoring = () => (
  <Card className="w-[600px]">
    <CardHeader>
      <CardTitle>Monitoramento da Campanha</CardTitle>
      <CardDescription>Acompanhe o progresso das suas campanhas em tempo real.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Status da Campanha:</Label>
        <Progress value={50} className="w-[60%]" />
        <span className="text-sm text-gray-500">50% Concluído</span>
      </div>
      <div className="space-y-2">
        <Label>Registros Concluídos:</Label>
        <p className="text-lg font-bold">50 / 100</p>
      </div>
      <div className="space-y-2">
        <Label>Falhas:</Label>
        <p className="text-lg font-bold text-red-500">5</p>
      </div>
      <div className="space-y-2">
        <Label>Logs Recentes:</Label>
        <div className="h-32 overflow-y-auto border p-2 text-sm bg-gray-50">
          <p>[2025-08-26 10:00:01] INFO: Iniciando worker 1...</p>
          <p>[2025-08-26 10:00:05] SUCCESS: Registro concluído para email@exemplo.com</p>
          <p>[2025-08-26 10:00:10] ERROR: Falha no captcha para email2@exemplo.com</p>
          <p>[2025-08-26 10:00:15] INFO: Gerando novo email temporário...</p>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-end space-x-2">
      <Button variant="outline">Pausar</Button>
      <Button variant="destructive">Parar</Button>
    </CardFooter>
  </Card>
);

const Reports = () => (
  <Card className="w-[600px]">
    <CardHeader>
      <CardTitle>Relatórios da Campanha</CardTitle>
      <CardDescription>Visualize os resultados detalhados das suas campanhas.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Campanhas Anteriores:</Label>
        <ul className="list-disc pl-5 text-sm">
          <li>Campanha Teste 1 (100 registros, 90 sucesso) - <a href="#" className="text-blue-500">Ver Detalhes</a></li>
          <li>Campanha Teste 2 (50 registros, 30 sucesso) - <a href="#" className="text-blue-500">Ver Detalhes</a></li>
        </ul>
      </div>
      <div className="space-y-2">
        <Label>Resumo da Última Campanha:</Label>
        <p className="text-lg">**Campanha: Minha Primeira Campanha**</p>
        <p>Total de Registros: 100</p>
        <p>Sucesso: 90 (90%)</p>
        <p>Falhas: 10 (10%)</p>
        <p>Duração: 1h 30min</p>
      </div>
      <div className="space-y-2">
        <Label>Download de Relatórios:</Label>
        <div className="flex space-x-2">
          <Button variant="outline">Download CSV</Button>
          <Button variant="outline">Download JSON</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Sistema de Registro em Massa</h1>
        <Tabs defaultValue="campaigns" className="w-[600px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
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
        </Tabs>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;


