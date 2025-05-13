
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, FolderKanban, Users, MessageSquare, ListChecks, CalendarClock, FileText, LogIn, UserPlus, UserCircle } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  authRequired?: boolean;
  tooltip?: string;
}

export const NAV_LINKS_MAIN: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true, tooltip: "Dashboard" },
  { href: '/projects', label: 'Proyectos', icon: FolderKanban, authRequired: true, tooltip: "Gestionar Proyectos" },
  { href: '/tasks', label: 'Mis Tareas', icon: ListChecks, authRequired: true, tooltip: "Tus Tareas" },
  { href: '/communication', label: 'Chat', icon: MessageSquare, authRequired: true, tooltip: "Chat de Equipo" },
  { href: '/documents', label: 'Documentos', icon: FileText, authRequired: true, tooltip: "Archivos de Proyecto" },
  { href: '/timeline', label: 'Decisiones', icon: CalendarClock, authRequired: true, tooltip: "Cronograma del Proyecto" },
];

export const NAV_LINKS_USER: NavItem[] = [
  { href: '/profile', label: 'Perfil', icon: UserCircle, authRequired: true, tooltip: "Tu Perfil" },
];

export const NAV_LINKS_AUTH: NavItem[] = [
  { href: '/login', label: 'Iniciar Sesión', icon: LogIn, authRequired: false, tooltip: "Acceder" },
  { href: '/register', label: 'Registrarse', icon: UserPlus, authRequired: false, tooltip: "Crear Cuenta" },
];

export const PROFILE_TYPES = [
  { id: 'client', label: 'Cliente' },
  { id: 'investor', label: 'Inversor' },
  { id: 'developer', label: 'Miembro del Equipo de Desarrollo' },
];

export const PROJECT_METHODOLOGIES = [
  { id: 'agile', label: 'Ágil' },
  { id: 'waterfall', label: 'Cascada' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'scrum', label: 'Scrum' },
];

