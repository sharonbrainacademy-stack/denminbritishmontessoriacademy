import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  AlertCircle,
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { CalendarEvent } from '../../types';

interface SchoolCalendarProps {
  compact?: boolean;
}

export const SchoolCalendar: React.FC<SchoolCalendarProps> = ({ compact = false }) => {
  const { calendarEvents, schoolInfo } = useSchool();
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  // Filter events
  const filteredEvents = calendarEvents.filter((ev) => {
    if (filterType !== 'all' && ev.type !== filterType) return false;
    if (selectedTerm !== 'all' && ev.term !== selectedTerm) return false;
    return true;
  });

  const getBadgeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'test':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'holiday':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'resumption':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pta':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (compact) {
    // Show only next 4-5 upcoming events for homepage widget
    const upcoming = calendarEvents.slice(0, 4);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <CalendarIcon className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Key Academic Calendar</h3>
              <p className="text-xs text-emerald-100">{schoolInfo.academicSession} Session</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-700/60 text-emerald-100 border border-emerald-500/30">
            {schoolInfo.currentTerm}
          </span>
        </div>

        <div className="divide-y divide-slate-100 p-2">
          {upcoming.map((ev) => (
            <div key={ev.id} className="p-3.5 hover:bg-slate-50 transition rounded-xl flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor(ev.type)}`}>
                    {ev.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">{ev.title}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{ev.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {new Date(ev.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {ev.endDate && ev.endDate !== ev.startDate && ` - ${new Date(ev.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {ev.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full page view
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Official School Calendar
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Schedule & Events
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Stay updated with term resumption dates, Continuous Assessment test windows, CBT examinations,
            open days, and public holidays at Sharon Brain Academy.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter By:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="all">All Event Types</option>
            <option value="resumption">Resumption / Term Dates</option>
            <option value="test">Continuous Assessment (Tests)</option>
            <option value="exam">Terminal CBT Examinations</option>
            <option value="holiday">Mid-term & Public Holidays</option>
            <option value="pta">PTA Meetings & Open Days</option>
          </select>

          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="all">All Terms</option>
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getBadgeColor(ev.type)}`}>
                  {ev.type}
                </span>
                <span className="text-xs font-semibold text-slate-500">{ev.term}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-base mb-2">{ev.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{ev.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-emerald-700">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {new Date(ev.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {ev.endDate && ev.endDate !== ev.startDate && ` to ${new Date(ev.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </span>
              </div>
              {ev.location && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{ev.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
