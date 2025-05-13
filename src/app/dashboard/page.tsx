
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderKanban, ListChecks, Users, BarChart, LineChart, PieChart as LucidePieChartIcon, UserCircle2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";


const barChartData = [
  { month: "Ene", tasks: 12, completed: 8 },
  { month: "Feb", tasks: 19, completed: 12 },
  { month: "Mar", tasks: 23, completed: 15 },
  { month: "Abr", tasks: 17, completed: 10 },
  { month: "May", tasks: 28, completed: 22 },
  { month: "Jun", tasks: 30, completed: 25 },
];

const lineChartData = [
  { date: "2024-01", value: 65 },
  { date: "2024-02", value: 59 },
  { date: "2024-03", value: 80 },
  { date: "2024-04", value: 81 },
  { date: "2024-05", value: 56 },
  { date: "2024-06", value: 70 },
];

const pieChartData = [
  { name: 'Proyectos de Clientes', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Proyectos Internos', value: 300, fill: 'hsl(var(--chart-2))'  },
  { name: 'En Espera', value: 150, fill: 'hsl(var(--chart-3))'  },
];
const chartConfig = {
  tasks: { label: "Tareas Totales", color: "hsl(var(--chart-1))" },
  completed: { label: "Tareas Completadas", color: "hsl(var(--chart-2))" },
  value: { label: "Progreso", color: "hsl(var(--primary))" },
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <FolderKanban className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-accent/20 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
              <ListChecks className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">157</div>
              <p className="text-xs text-muted-foreground">+18 esta semana</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-destructive/20 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobaciones Pendientes</CardTitle>
              <Users className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Acción requerida</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-lg col-span-1">
            <CardHeader>
              <CardTitle>Progreso de Tareas (Últimos 6 Meses)</CardTitle>
              <CardDescription>Tareas totales vs. completadas.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <RechartsBarChart data={barChartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="shadow-lg col-span-1">
            <CardHeader>
              <CardTitle>Rendimiento General del Proyecto</CardTitle>
              <CardDescription>Tendencia de rendimiento mensual.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ChartContainer config={chartConfig} className="h-full w-full">
                <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }} accessibilityLayer>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent indicator="line" />} />
                  <Legend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={false} />
                </RechartsLineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-lg lg:col-span-1">
             <CardHeader>
              <CardTitle>Distribución de Tipos de Proyecto</CardTitle>
              <CardDescription>Desglose de proyectos por categoría.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ChartContainer config={chartConfig} className="h-full w-full aspect-square">
                <RechartsPieChart accessibilityLayer>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                     {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas actualizaciones en tus proyectos.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { user: "Alice", action: "actualizó la tarea 'Desarrollar Página de Inicio'", project: "Rediseño Web", time: "hace 2 horas", avatarSeed: "alice" },
                  { user: "Bob", action: "comentó en 'Clasificación de Errores'", project: "App Móvil v2", time: "hace 5 horas", avatarSeed: "bob" },
                  { user: "Carol", action: "subió 'Manual de Usuario v1.2.pdf'", project: "Portal Cliente", time: "hace 1 día", avatarSeed: "carol" },
                  { user: "David", action: "marcó 'Presentación Inversores' como completada", project: "Ronda de Financiación", time: "hace 2 días", avatarSeed: "david" },
                ].map(activity => (
                  <li key={activity.action} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <UserCircle2 className="h-full w-full text-muted-foreground" />
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        <span className="font-semibold text-primary">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        En <span className="font-medium">{activity.project}</span> - {activity.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

