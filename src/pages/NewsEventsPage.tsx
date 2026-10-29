import React from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { NewsArticle } from '../types';

export const NewsEventsPage: React.FC = () => {
  const { newsArticles, schoolInfo } = useSchool();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Happenings & News
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Sharon Brain Academy Bulletin
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Stay informed with academic updates, speech and prize-giving ceremonies, sports day schedules,
          and student achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article: NewsArticle) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col justify-between"
          >
            {article.imageUrl && (
              <div className="h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(article.publishedDate || article.date || new Date().toISOString()).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{article.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{article.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                <span>By {article.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
