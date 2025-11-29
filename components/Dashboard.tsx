import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Calendar, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Remocao, DashboardStats } from '../types';

interface DashboardProps {
  remocoes: Remocao[];
}

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ remocoes }) => {
  // Calculate Stats
  const agora = new Date();
  const hojeStr = agora.toISOString().split('T')[0];
  
  const stats: DashboardStats = {
    hoje: 0,
    pendentesSemana: 0,
    faturadasMes: 0,
    totalMes: 0
  };

  const statusCount: Record<string, number> = {};
  const dataCount: Record<string, number> = {};

  remocoes.forEach(r => {
    // KPI Counters
    if (r.dataRemocao === hojeStr) stats.hoje++;
    if (r.status === 'Faturada') stats.faturadasMes++; // Simplified logic for demo
    stats.totalMes++; // Simplified

    // Chart Data Preparation
    statusCount[r.status] = (statusCount[r.status] || 0) + 1;
    
    const dateKey = r.dataRemocao.split('-').slice(1).join('/'); // MM/DD
    dataCount[dateKey] = (dataCount[dateKey] || 0) + 1;
  });

  const pieData = Object.keys(statusCount).map(key => ({ name: key, value: statusCount[key] }));
  const lineData = Object.keys(dataCount).map(key => ({ name: key, remocoes: dataCount[key] })).slice(-7); // Last 7 entries

  const KPICard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-full ${bgClass}`}>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Remoções Hoje" value={stats.hoje} icon={Calendar} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        <KPICard title="Pendentes (Semana)" value={stats.pendentesSemana} icon={Clock} colorClass="text-amber-600" bgClass="bg-amber-50" />
        <KPICard title="Faturadas (Mês)" value={stats.faturadasMes} icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <KPICard title="Total (Mês)" value={stats.totalMes} icon={TrendingUp} colorClass="text-cyan-600" bgClass="bg-cyan-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Evolução Diária</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="remocoes" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Status Atual</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;