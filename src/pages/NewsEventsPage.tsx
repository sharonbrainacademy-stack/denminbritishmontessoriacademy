import React, { useState } from 'react';
import { Calendar, Tag, User, Sparkles, Filter, Image as ImageIcon } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const NewsEventsPage: React.FC = () => {
  const { newsArticles, galleryPhotos } = useSchool();
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('All');

  const galleryCategories = ['All', 'Montessori Labs', 'Sports Day', 'Cultural Celebrations', 'Classrooms', 'Events'];

  const filteredPhotos = selectedGalleryCategory === 'All'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === selectedGalleryCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Banner */}
      <div className="bg-[#0B3D27] text-white p-8 md:p-12 rounded-3xl border-2 border-[#D4AF37] shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
          School Life & Updates
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#F9F6EF]">
          News, Events & Gallery
        </h1>
        <p className="text-sm md:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Stay informed with the latest school announcements, educational blogs, and photo gallery highlights.
        </p>
      </div>

      {/* Latest News Articles Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            School Bulletin
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            Announcements & Newsletter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsArticles.map(article => (
            <div
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#0B3D27] text-[#D4AF37] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{article.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{article.author}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-[#0B3D27] leading-tight">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 text-xs">
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {article.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Photo Gallery */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
            Visual Highlights
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0B3D27]">
            School Photo Gallery
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {galleryCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedGalleryCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedGalleryCategory === cat
                  ? 'bg-[#0B3D27] text-[#D4AF37] shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-3 left-3 bg-[#0B3D27]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm">
                  {photo.category}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-serif font-bold text-sm text-[#0B3D27]">{photo.title}</h4>
                {photo.caption && <p className="text-xs text-slate-500">{photo.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
