import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarDays,
  ListFilter,
  CheckCircle2,
  CalendarCheck2,
  BookmarkCheck,
  Share2,
  Info,
  PartyPopper,
  GraduationCap,
  BellRing,
} from 'lucide-react';
import { CalendarEvent, CalendarEventCategory } from '../../types';
import { initialCalendarEvents } from '../../data/initialCalendarEvents';
import { useSchool } from '../../context/SchoolContext';

interface SchoolCalendarProps {
  customEvents?: CalendarEvent[];
  title?: string;
  subtitle?: string;
  showSpotlight?: boolean;
}

const CATEGORY_META: Record<
  CalendarEventCategory,
  { label: string; badgeClass: string; borderClass: string; dotClass: string; icon: any }
> = {
  term_date: {
    label: 'Term Dates & Resumptions',
    badgeClass: 'bg-emerald-100 text-[#0B3D27] border-emerald-300',
    borderClass: 'border-l-emerald-600',
    dotClass: 'bg-emerald-600',
    icon: CalendarCheck2,
  },
  exam: {
    label: 'Examinations & CBT',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    borderClass: 'border-l-amber-500',
    dotClass: 'bg-amber-500',
    icon: BookmarkCheck,
  },
  holiday: {
    label: 'Public Holidays',
    badgeClass: 'bg-red-100 text-red-900 border-red-300',
    borderClass: 'border-l-red-500',
    dotClass: 'bg-red-500',
    icon: BellRing,
  },
  activity: {
    label: 'School Activities & Festivals',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    borderClass: 'border-l-purple-600',
    dotClass: 'bg-purple-600',
    icon: PartyPopper,
  },
  meeting: {
    label: 'PTA & Consultations',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    borderClass: 'border-l-blue-600',
    dotClass: 'bg-blue-600',
    icon: Users,
  },
};

export const SchoolCalendar: React.FC<SchoolCalendarProps> = ({
  customEvents,
  title = 'Official Academic Calendar & Important Dates',
  subtitle = 'Keep track of term resumptions, CBT test weeks, terminal examinations, public holidays, and school celebrations.',
  showSpotlight = true,
}) => {
  const { schoolInfo } = useSchool();
  const allEvents = useMemo(() => customEvents || initialCalendarEvents, [customEvents]);

  // Filters & State
  const [selectedTerm, setSelectedTerm] = useState<'All' | '1st Term' | '2nd Term' | '3rd Term'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'agenda' | 'month' | 'keydates'>('agenda');
  const [selectedEventModal, setSelectedEventModal] = useState<CalendarEvent | null>(null);

  // Month navigation state for month grid view
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date(2024, 9, 1)); // October 2024 default

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((ev) => {
        if (selectedTerm !== 'All' && ev.term !== selectedTerm && ev.term !== 'All Year') {
          return false;
        }
        if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = ev.title.toLowerCase().includes(q);
          const matchDesc = ev.description?.toLowerCase().includes(q) || false;
          const matchLoc = ev.location?.toLowerCase().includes(q) || false;
          const matchAud = ev.targetAudience?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchDesc && !matchLoc && !matchAud) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [allEvents, selectedTerm, selectedCategory, searchQuery]);

  // Key Dates Summary Cards
  const keyDates = useMemo(() => {
    return allEvents.filter((ev) => ev.isKeyDate).slice(0, 8);
  }, [allEvents]);

  // Next Upcoming Event for Spotlight
  const upcomingSpotlight = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = allEvents
      .filter((ev) => ev.startDate >= todayStr || (ev.endDate && ev.endDate >= todayStr))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

    // Fallback to first major key event if all dates in demo are past today
    return upcoming || allEvents.find((e) => e.isKeyDate) || allEvents[0];
  }, [allEvents]);

  // Group events by Month for Agenda View
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((ev) => {
      const date = new Date(ev.startDate);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(ev);
    });
    return groups;
  }, [filteredEvents]);

  // Helpers
  const formatDisplayDate = (start: string, end?: string) => {
    const sDate = new Date(start);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    if (!end || end === start) {
      return sDate.toLocaleDateString('en-US', options);
    }
    const eDate = new Date(end);
    if (sDate.getMonth() === eDate.getMonth() && sDate.getFullYear() === eDate.getFullYear()) {
      return `${sDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} – ${eDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return `${sDate.toLocaleDateString('en-US', options)} – ${eDate.toLocaleDateString('en-US', options)}`;
  };

  // Generate .ics download
  const handleDownloadICS = (event: CalendarEvent) => {
    const formatDateForICS = (dateStr: string) => dateStr.replace(/-/g, '');
    const startDateFormatted = formatDateForICS(event.startDate);
    const endDateFormatted = event.endDate ? formatDateForICS(event.endDate) : startDateFormatted;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sharon Brain Academy//School Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@sharonbrainacademy.edu.ng`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${startDateFormatted}`,
      `DTEND;VALUE=DATE:${endDateFormatted}`,
      `SUMMARY:${event.title} - Sharon Brain Academy`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || 'Sharon Brain Academy, No 2, 2nd Otakhiogbogie St, Ugbowo Benin City'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (event: CalendarEvent) => {
    const sDate = event.startDate.replace(/-/g, '');
    const eDate = event.endDate ? event.endDate.replace(/-/g, '') : sDate;
    const details = encodeURIComponent(
      `${event.description || ''}\n\nCategory: ${CATEGORY_META[event.category]?.label || event.category}\nTerm: ${event.term}\nAudience: ${event.targetAudience || 'All Pupils & Parents'}`
    );
    const title = encodeURIComponent(`${event.title} | Sharon Brain Academy`);
    const location = encodeURIComponent(event.location || 'Sharon Brain Academy, Ugbowo, Benin City');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${sDate}/${eDate}&details=${details}&location=${location}`;
  };

  // Month grid calculations
  const monthYearDisplay = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const monthGridDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dayNum: number;
      dateString: string;
      isCurrentMonth: boolean;
      events: CalendarEvent[];
    }> = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, dNum);
      const dStr = prevDate.toISOString().split('T')[0];
      days.push({
        dayNum: dNum,
        dateString: dStr,
        isCurrentMonth: false,
        events: allEvents.filter(
          (e) => e.startDate <= dStr && (e.endDate ? e.endDate >= dStr : e.startDate === dStr)
        ),
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const currDate = new Date(year, month, d);
      // Format as YYYY-MM-DD
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dStr = `${year}-${monthStr}-${dayStr}`;
      days.push({
        dayNum: d,
        dateString: dStr,
        isCurrentMonth: true,
        events: allEvents.filter(
          (e) => e.startDate <= dStr && (e.endDate ? e.endDate >= dStr : e.startDate === dStr)
        ),
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dStr = nextDate.toISOString().split('T')[0];
      days.push({
        dayNum: d,
        dateString: dStr,
        isCurrentMonth: false,
        events: allEvents.filter(
          (e) => e.startDate <= dStr && (e.endDate ? e.endDate >= dStr : e.startDate === dStr)
        ),
      });
    }

    return days;
  }, [currentMonthDate, allEvents]);

  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="school-calendar" className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B3D27] via-[#0E4930] to-[#0B3D27] text-white rounded-3xl p-8 md:p-10 shadow-xl border-2 border-[#D4AF37]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold text-[#D4AF37]">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Academic Year {schoolInfo.academicSession}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#F9F6EF] tracking-tight">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-emerald-100 px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center gap-2 shadow-sm"
              title="Print academic timetable"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print Schedule</span>
            </button>

            <button
              onClick={() => {
                const icsEvents = allEvents
                  .map((ev) => {
                    const s = ev.startDate.replace(/-/g, '');
                    const e = ev.endDate ? ev.endDate.replace(/-/g, '') : s;
                    return `BEGIN:VEVENT\r\nUID:${ev.id}@sharonbrainacademy.edu.ng\r\nDTSTART;VALUE=DATE:${s}\r\nDTEND;VALUE=DATE:${e}\r\nSUMMARY:${ev.title}\r\nDESCRIPTION:${ev.description || ''}\r\nEND:VEVENT`;
                  })
                  .join('\r\n');
                const fullCalendar = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Sharon Brain Academy//Calendar//EN\r\n${icsEvents}\r\nEND:VCALENDAR`;
                const blob = new Blob([fullCalendar], { type: 'text/calendar;charset=utf-8' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', `sharon_brain_calendar_${schoolInfo.academicSession.replace('/', '_')}.ics`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-[#D4AF37] hover:bg-amber-400 text-[#0B3D27] font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Sync All to Phone / PC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Event Spotlight Card */}
      {showSpotlight && upcomingSpotlight && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D4AF37]/40 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-emerald-50 border border-[#0B3D27]/20 text-[#0B3D27] rounded-2xl flex flex-col items-center justify-center font-serif shrink-0 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                  {new Date(upcomingSpotlight.startDate).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-xl font-extrabold leading-none">
                  {new Date(upcomingSpotlight.startDate).getDate()}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#D4AF37] text-[#0B3D27] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Upcoming Spotlight
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${CATEGORY_META[upcomingSpotlight.category]?.badgeClass || ''}`}>
                    {CATEGORY_META[upcomingSpotlight.category]?.label || upcomingSpotlight.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {upcomingSpotlight.term}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold font-serif text-[#0B3D27]">
                  {upcomingSpotlight.title}
                </h3>

                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  {upcomingSpotlight.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-800">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {formatDisplayDate(upcomingSpotlight.startDate, upcomingSpotlight.endDate)}
                    {upcomingSpotlight.time && ` • ${upcomingSpotlight.time}`}
                  </span>
                  {upcomingSpotlight.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {upcomingSpotlight.location}
                    </span>
                  )}
                  {upcomingSpotlight.targetAudience && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {upcomingSpotlight.targetAudience}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
              <button
                onClick={() => handleDownloadICS(upcomingSpotlight)}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#0B3D27] border border-[#0B3D27]/30 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                title="Download .ics event file"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add to iCal / Outlook</span>
              </button>
              <a
                href={getGoogleCalendarUrl(upcomingSpotlight)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0B3D27] hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Google Calendar</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Controls & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200 space-y-4">
        {/* Top row: Term selector tabs and View switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          {/* Term Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
              Term:
            </span>
            {(['All', '1st Term', '2nd Term', '3rd Term'] as const).map((term) => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedTerm === term
                    ? 'bg-[#0B3D27] text-[#D4AF37] shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {term === 'All' ? 'All Terms (Full Session)' : term}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('agenda')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'agenda'
                  ? 'bg-white text-[#0B3D27] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Agenda Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-[#0B3D27] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Monthly Grid</span>
            </button>
            <button
              onClick={() => setViewMode('keydates')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'keydates'
                  ? 'bg-white text-[#0B3D27] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Milestones</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Search query & Category filter chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#0B3D27] text-white border-[#0B3D27]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              All Events ({allEvents.length})
            </button>
            {Object.entries(CATEGORY_META).map(([key, meta]) => {
              const count = allEvents.filter((e) => e.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    selectedCategory === key
                      ? 'bg-[#0B3D27] text-white border-[#0B3D27]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                  <span>{meta.label}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events or tests..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0B3D27] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: AGENDA TIMELINE */}
      {viewMode === 'agenda' && (
        <div className="space-y-8">
          {Object.keys(groupedByMonth).length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No events found matching your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your search query or selecting "All Terms" and "All Events".
              </p>
              <button
                onClick={() => {
                  setSelectedTerm('All');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#0B3D27] underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            Object.entries(groupedByMonth).map(([monthYear, rawEvents]) => {
              const events = rawEvents as CalendarEvent[];
              return (
              <div key={monthYear} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold font-serif text-[#0B3D27] flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
                    <span>{monthYear}</span>
                  </h3>
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-400">
                    {events.length} {events.length === 1 ? 'event' : 'events'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((ev) => {
                    const meta = CATEGORY_META[ev.category];
                    const IconComponent = meta?.icon || CalendarIcon;
                    return (
                      <div
                        key={ev.id}
                        className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-200 border-l-4 ${meta?.borderClass || 'border-l-emerald-600'} flex flex-col justify-between space-y-3 group`}
                      >
                        <div className="space-y-2">
                          {/* Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${meta?.badgeClass || 'bg-slate-100 text-slate-700'}`}>
                              {meta?.label || ev.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                              <span>{ev.term}</span>
                              {ev.isKeyDate && (
                                <span className="text-[#D4AF37] font-bold flex items-center gap-0.5">
                                  <Sparkles className="w-3 h-3 fill-[#D4AF37]" />
                                  <span>Key Date</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Event Title */}
                          <h4 className="text-base font-bold font-serif text-[#0B3D27] group-hover:text-emerald-900 transition-colors">
                            {ev.title}
                          </h4>

                          {/* Date & Time */}
                          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{formatDisplayDate(ev.startDate, ev.endDate)}</span>
                            {ev.time && <span className="text-slate-500 font-normal">• {ev.time}</span>}
                          </div>

                          {/* Description */}
                          {ev.description && (
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                              {ev.description}
                            </p>
                          )}
                        </div>

                        {/* Footer Details & Action buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="text-[11px] text-slate-500 space-y-0.5">
                            {ev.targetAudience && (
                              <p className="flex items-center gap-1 text-slate-600 font-medium">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span>{ev.targetAudience}</span>
                              </p>
                            )}
                            {ev.location && (
                              <p className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{ev.location}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedEventModal(ev)}
                              className="text-[#0B3D27] hover:text-emerald-700 font-bold px-2 py-1 text-xs rounded hover:bg-slate-100 transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDownloadICS(ev)}
                              title="Download iCal event file"
                              className="bg-emerald-50 hover:bg-emerald-100 text-[#0B3D27] p-1.5 rounded-lg transition-colors"
                            >
                              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                            </button>
                            <a
                              href={getGoogleCalendarUrl(ev)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Add to Google Calendar"
                              className="bg-[#0B3D27] hover:bg-emerald-900 text-white p-1.5 rounded-lg transition-colors"
                            >
                              <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
          )}
        </div>
      )}

      {/* VIEW MODE 2: MONTHLY GRID */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#D4AF37]" />
              <h3 className="text-xl font-bold font-serif text-[#0B3D27]">
                {monthYearDisplay}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonthDate(new Date(2024, 9, 1))}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Session Start
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-2">
            {monthGridDays.map((cell, idx) => {
              const hasEvents = cell.events.length > 0;
              return (
                <div
                  key={idx}
                  className={`min-h-[90px] md:min-h-[110px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
                    cell.isCurrentMonth
                      ? hasEvents
                        ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-[#D4AF37]'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                      : 'bg-slate-50/50 border-slate-100 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        cell.isCurrentMonth ? 'text-slate-800' : 'text-slate-300'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {hasEvents && (
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    )}
                  </div>

                  {/* Day Events Stack */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cell.events.slice(0, 2).map((ev) => {
                      const meta = CATEGORY_META[ev.category];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEventModal(ev)}
                          className={`w-full text-left truncate text-[10px] font-semibold px-1.5 py-0.5 rounded border ${meta?.badgeClass || 'bg-slate-100'} hover:opacity-80 transition-opacity block`}
                          title={ev.title}
                        >
                          {ev.title}
                        </button>
                      );
                    })}
                    {cell.events.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-500 block text-right">
                        +{cell.events.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${meta.dotClass}`} />
                <span>{meta.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: KEY MILESTONES SUMMARY */}
      {viewMode === 'keydates' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-bold font-serif text-[#0B3D27]">
              Essential Session Milestones & Examination Schedule
            </h3>
            <p className="text-xs text-slate-600">
              Quick reference for parents and guardians planning family travel, examination preparations, and school festivals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyDates.map((kd) => {
              const meta = CATEGORY_META[kd.category];
              return (
                <div
                  key={kd.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${meta?.badgeClass}`}>
                        {kd.term}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>

                    <h4 className="text-sm font-bold font-serif text-[#0B3D27]">
                      {kd.title}
                    </h4>

                    <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{formatDisplayDate(kd.startDate, kd.endDate)}</span>
                    </p>

                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {kd.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
                      {kd.targetAudience || 'All Pupils'}
                    </span>
                    <button
                      onClick={() => handleDownloadICS(kd)}
                      className="text-[#0B3D27] hover:text-[#D4AF37] font-bold text-xs flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>iCal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Details Popup Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-2 border-[#D4AF37] space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${CATEGORY_META[selectedEventModal.category]?.badgeClass}`}>
                  {CATEGORY_META[selectedEventModal.category]?.label || selectedEventModal.category}
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  {selectedEventModal.term} • Session {selectedEventModal.academicSession}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold font-serif text-[#0B3D27]">
                {selectedEventModal.title}
              </h3>

              <div className="bg-emerald-50 rounded-xl p-3.5 space-y-1.5 text-xs text-emerald-900 border border-emerald-200">
                <p className="flex items-center gap-2 font-bold text-[#0B3D27]">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>{formatDisplayDate(selectedEventModal.startDate, selectedEventModal.endDate)}</span>
                </p>
                {selectedEventModal.time && (
                  <p className="pl-6 text-slate-700">Time: {selectedEventModal.time}</p>
                )}
                {selectedEventModal.location && (
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Venue: {selectedEventModal.location}</span>
                  </p>
                )}
                {selectedEventModal.targetAudience && (
                  <p className="flex items-center gap-2 text-slate-700">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Attendees: {selectedEventModal.targetAudience}</span>
                  </p>
                )}
              </div>

              {selectedEventModal.description && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Event Overview & Parent Guidance:
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedEventModal.description}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadICS(selectedEventModal)}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#0B3D27] border border-[#0B3D27]/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download .ics</span>
              </button>
              <a
                href={getGoogleCalendarUrl(selectedEventModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0B3D27] hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add to Google Calendar</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
