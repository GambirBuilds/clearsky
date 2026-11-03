import React from 'react';
import { Mountain, Flame, CloudFog, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EnvironmentalInfoSection() {
  const cards = [
    {
      title: 'Valley Thermal Inversion',
      subtitle: 'Winter Atmospheric Trapping',
      description: 'During winter months in the bowl-shaped Kathmandu Valley, cool heavy air settles on the valley floor under a warm ceiling layer, trapping vehicular exhaust, brick kiln smoke, and dust particles from dispersing.',
      icon: CloudFog,
      color: 'text-cyan-400'
    },
    {
      title: 'Brick Kiln Seasonality',
      subtitle: 'December – April Peak Emissions',
      description: 'Over 100 fixed-chimney bull trench kilns operate around the valley periphery during the dry winter and spring construction seasons, contributing significantly to ambient black carbon and fine PM2.5.',
      icon: Flame,
      color: 'text-amber-400'
    },
    {
      title: 'Terai Indo-Gangetic Transboundary Haze',
      subtitle: 'Southern Plains Influx',
      description: 'Cities like Birgunj, Biratnagar, and Nepalgunj receive seasonal agricultural residue burning smoke and industrial aerosols transported eastward along the Himalayan foothills.',
      icon: Mountain,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Nepal Environmental Dynamics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geographic and meteorological drivers of air pollution in Nepal
          </p>
        </div>
        <Link
          to="/education"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Explore Full Education Guide →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${card.color} shrink-0`} />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {card.title}
                  </h4>
                </div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {card.subtitle}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
