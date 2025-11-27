"use client";

import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Bell, Moon, Award, Clock, Plus, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Types
interface Activity {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  date: string;
}

interface SleepLog {
  date: string;
  hours: number;
  quality: number;
}

interface AppUsage {
  name: string;
  minutes: number;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
}

export default function UnstuckApp() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [points, setPoints] = useState(0);
  const [newActivity, setNewActivity] = useState("");
  const [newActivityTime, setNewActivityTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load data from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem("unstuck_activities");
    const savedSleepLogs = localStorage.getItem("unstuck_sleep");
    const savedAppUsage = localStorage.getItem("unstuck_apps");
    const savedGoals = localStorage.getItem("unstuck_goals");
    const savedPoints = localStorage.getItem("unstuck_points");

    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedSleepLogs) setSleepLogs(JSON.parse(savedSleepLogs));
    if (savedAppUsage) setAppUsage(JSON.parse(savedAppUsage));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedPoints) setPoints(parseInt(savedPoints));

    // Initialize demo data if empty
    if (!savedActivities) {
      const demoActivities: Activity[] = [
        { id: "1", title: "Meditação matinal", time: "07:00", completed: false, date: new Date().toISOString().split('T')[0] },
        { id: "2", title: "Exercício físico", time: "08:00", completed: false, date: new Date().toISOString().split('T')[0] },
        { id: "3", title: "Leitura", time: "20:00", completed: false, date: new Date().toISOString().split('T')[0] },
      ];
      setActivities(demoActivities);
    }

    if (!savedSleepLogs) {
      const demoSleep: SleepLog[] = [
        { date: "2024-01-15", hours: 7.5, quality: 8 },
        { date: "2024-01-16", hours: 6.5, quality: 6 },
        { date: "2024-01-17", hours: 8, quality: 9 },
        { date: "2024-01-18", hours: 7, quality: 7 },
        { date: "2024-01-19", hours: 8.5, quality: 9 },
      ];
      setSleepLogs(demoSleep);
    }

    if (!savedGoals) {
      const demoGoals: Goal[] = [
        { id: "1", title: "Meditar 30 dias seguidos", progress: 12, target: 30 },
        { id: "2", title: "Ler 5 livros", progress: 2, target: 5 },
        { id: "3", title: "Exercitar 20 vezes", progress: 8, target: 20 },
      ];
      setGoals(demoGoals);
    }

    if (!savedAppUsage) {
      const demoApps: AppUsage[] = [
        { name: "Instagram", minutes: 45 },
        { name: "YouTube", minutes: 120 },
        { name: "WhatsApp", minutes: 60 },
        { name: "Twitter", minutes: 30 },
      ];
      setAppUsage(demoApps);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("unstuck_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("unstuck_sleep", JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  useEffect(() => {
    localStorage.setItem("unstuck_apps", JSON.stringify(appUsage));
  }, [appUsage]);

  useEffect(() => {
    localStorage.setItem("unstuck_goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("unstuck_points", points.toString());
  }, [points]);

  // Add new activity
  const addActivity = () => {
    if (newActivity.trim() && newActivityTime) {
      const activity: Activity = {
        id: Date.now().toString(),
        title: newActivity,
        time: newActivityTime,
        completed: false,
        date: selectedDate,
      };
      setActivities([...activities, activity]);
      setNewActivity("");
      setNewActivityTime("");
    }
  };

  // Toggle activity completion
  const toggleActivity = (id: string) => {
    setActivities(activities.map(act => {
      if (act.id === id) {
        const newCompleted = !act.completed;
        if (newCompleted) {
          setPoints(points + 10);
          // Show notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Parabéns! 🎉", {
              body: `Você completou: ${act.title}. +10 pontos!`,
            });
          }
        } else {
          setPoints(Math.max(0, points - 10));
        }
        return { ...act, completed: newCompleted };
      }
      return act;
    }));
  };

  // Delete activity
  const deleteActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
  };

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Filter activities by selected date
  const todayActivities = activities.filter(act => act.date === selectedDate);
  const completedToday = todayActivities.filter(act => act.completed).length;
  const totalToday = todayActivities.length;
  const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-2">
            Unstuck
          </h1>
          <p className="text-slate-600 text-lg">
            Organize sua rotina e alcance seus objetivos
          </p>
        </header>

        {/* Points Badge */}
        <div className="flex justify-center mb-6">
          <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 shadow-lg">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Seus Pontos</p>
                <p className="text-2xl font-bold">{points}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="routine" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="routine" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Rotina</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Sono</span>
            </TabsTrigger>
            <TabsTrigger value="apps" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Metas</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alertas</span>
            </TabsTrigger>
          </TabsList>

          {/* Routine Tab */}
          <TabsContent value="routine" className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-600" />
                Calendário de Atividades
              </h2>
              
              {/* Date Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Selecione a data:
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              {/* Add Activity */}
              <div className="mb-6 p-4 bg-cyan-50 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-3">Adicionar Atividade</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Nome da atividade"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="time"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="w-full sm:w-32"
                  />
                  <Button
                    onClick={addActivity}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Progresso do Dia
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {completedToday}/{totalToday} atividades
                  </span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>

              {/* Activities List */}
              <div className="space-y-3">
                {todayActivities.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">
                    Nenhuma atividade programada para esta data.
                  </p>
                ) : (
                  todayActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        activity.completed
                          ? "bg-green-50 border-green-300"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Button
                            size="sm"
                            variant={activity.completed ? "default" : "outline"}
                            onClick={() => toggleActivity(activity.id)}
                            className={activity.completed ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {activity.completed ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <p className={`font-medium ${activity.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                              {activity.title}
                            </p>
                            <p className="text-sm text-slate-500">{activity.time}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteActivity(activity.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-600" />
                Gráfico de Evolução
              </h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepLogs}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      name="Horas de Sono"
                    />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Qualidade (0-10)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Média de Sono</p>
                  <p className="text-3xl font-bold text-cyan-600">
                    {sleepLogs.length > 0
                      ? (sleepLogs.reduce((acc, log) => acc + log.hours, 0) / sleepLogs.length).toFixed(1)
                      : "0"}h
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Qualidade Média</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {sleepLogs.length > 0
                      ? (sleepLogs.reduce((acc, log) => acc + log.quality, 0) / sleepLogs.length).toFixed(1)
                      : "0"}/10
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Sleep Tab */}
          <TabsContent value="sleep" className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Moon className="w-6 h-6 text-cyan-600" />
                Rastreamento do Sono
              </h2>

              <div className="space-y-4">
                {sleepLogs.slice(-7).reverse().map((log, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-800">{log.date}</span>
                      <Badge className="bg-cyan-500">{log.hours}h de sono</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Qualidade do sono</span>
                        <span className="font-semibold">{log.quality}/10</span>
                      </div>
                      <Progress value={log.quality * 10} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-slate-700">
                  💡 <strong>Dica:</strong> Adultos precisam de 7-9 horas de sono por noite para melhor desempenho.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Apps Tab */}
          <TabsContent value="apps" className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-cyan-600" />
                Tempo de Uso de Apps
              </h2>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="minutes" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {appUsage.map((app, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800">{app.name}</span>
                      <Badge className="bg-blue-500">
                        {Math.floor(app.minutes / 60)}h {app.minutes % 60}min
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <p className="text-sm text-slate-700">
                  ⚠️ <strong>Atenção:</strong> O tempo total de tela hoje foi de{" "}
                  {Math.floor(appUsage.reduce((acc, app) => acc + app.minutes, 0) / 60)}h{" "}
                  {appUsage.reduce((acc, app) => acc + app.minutes, 0) % 60}min
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-cyan-600" />
                Metas e Objetivos
              </h2>

              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-slate-800">{goal.title}</h3>
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500">
                        {goal.progress}/{goal.target}
                      </Badge>
                    </div>
                    <Progress value={(goal.progress / goal.target) * 100} className="h-3 mb-2" />
                    <p className="text-sm text-slate-600">
                      {Math.round((goal.progress / goal.target) * 100)}% completo
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-slate-800">Continue assim!</p>
                    <p className="text-sm text-slate-600">
                      Você está fazendo um ótimo progresso em suas metas.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-cyan-600" />
                Notificações
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-slate-800">Notificações Ativadas</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Você receberá lembretes para suas atividades programadas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-50 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-3">Próximas Atividades</h3>
                  <div className="space-y-2">
                    {todayActivities
                      .filter(act => !act.completed)
                      .slice(0, 3)
                      .map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-2 bg-white rounded">
                          <Clock className="w-4 h-4 text-cyan-600" />
                          <span className="text-sm text-slate-700">
                            {activity.time} - {activity.title}
                          </span>
                        </div>
                      ))}
                    {todayActivities.filter(act => !act.completed).length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-2">
                        Todas as atividades foram concluídas! 🎉
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-slate-700">
                    ✅ As notificações ajudam você a manter o foco e não perder nenhuma atividade importante.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
