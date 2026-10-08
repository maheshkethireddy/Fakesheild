declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }

  export type LucideIcon = React.FC<LucideProps>;

  export const ShieldCheck: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const ShieldX: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertOctagon: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const XCircle: LucideIcon;
  export const Info: LucideIcon;
  export const Search: LucideIcon;
  export const Globe: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Trash2: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const History: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const User: LucideIcon;
  export const LogOut: LucideIcon;
  export const LogIn: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Lock: LucideIcon;
  export const Mail: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Cpu: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Binary: LucideIcon;
  export const Layers: LucideIcon;
  export const Server: LucideIcon;
  export const Terminal: LucideIcon;
  export const FileWarning: LucideIcon;
  export const FileCheck2: LucideIcon;
  export const Activity: LucideIcon;
  export const BarChart3: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Clock: LucideIcon;
  export const Calendar: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Loader2: LucideIcon;
  export const Zap: LucideIcon;
}
