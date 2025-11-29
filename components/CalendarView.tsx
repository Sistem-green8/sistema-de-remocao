
import React, { useState, useEffect } from 'react';
import { Remocao } from '../types';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface CalendarViewProps {
  remocoes: Remocao[];
  highlightedEventId?: number | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({ remocoes, highlightedEventId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Effect to jump to event month if highlighted
  useEffect(() => {
    if (highlightedEventId) {
      const event = remocoes.find(r => r.id === highlightedEventId);
      if (event) {
        const [year, month, day] = event.dataRemocao.split('-').map(Number);
        // month in JS Date is 0-indexed (0=Jan), our string is 1-indexed
        setCurrentDate(new Date(year, month - 1, day));
      }
    }
  }, [highlightedEventId, remocoes]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return remocoes.filter(r => r.dataRemocao === dateStr);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[calc(100vh-140px)] flex flex-col animate-in fade-in">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-2 text-center text-sm font-semibold text-slate-500 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr h-full min-h-[600px]">
          {blanks.map(i => <div key={`blank-${i}`} className="bg-slate-50 border-r border-b border-slate-100" />)}
          
          {days.map(day => {
            const events = getEventsForDay(day);
            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
            
            return (
              <div key={day} className={`border-r border-b border-slate-100 p-2 min-h-[100px] hover:bg-slate-50 transition-colors ${isToday ? 'bg-indigo-50/30' : ''}`}>
                <div className={`text-sm font-medium mb-2 ${isToday ? 'bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {events.map(ev => {
                    const isHighlighted = highlightedEventId === ev.id;
                    return (
                      <div 
                        key={ev.id} 
                        className={`text-xs p-1.5 rounded border truncate cursor-pointer transition-all
                          ${isHighlighted 
                            ? 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-400 shadow-md transform scale-105 z-10' 
                            : 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200'
                          }`}
                        title={`${ev.horaOrigem} - ${ev.paciente}`}
                      >
                        <div className="font-bold flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {ev.horaOrigem}
                        </div>
                        <div className="truncate">{ev.paciente}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
