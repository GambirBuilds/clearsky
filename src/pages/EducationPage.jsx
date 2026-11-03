import React, { useState } from 'react';
import { AQI_CATEGORIES } from '../constants/aqiCategories';
import { POLLUTANTS } from '../constants/pollutants';
import {
  BookOpen,
  Search,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Wind,
  Flame,
  Mountain,
  Home,
  Sun,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export function EducationPage() {
  const [activeTab, setActiveTab] = useState('aqi'); // 'aqi' | 'pollutants' | 'sources' | 'indoor_outdoor' | 'faq' | 'nepal'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Searchable educational articles
  const articles = [
    {
      id: 'aqi-basics',
      title: 'What is the Air Quality Index (AQI)?',
      category: 'Standards',
      summary: 'The AQI is a standardized scale running from 0 to 500, converting complex pollutant concentrations into an understandable single index.',
      readTime: '3 min read',
      source: 'US Environmental Protection Agency'
    },
    {
      id: 'pm25-deep-dive',
      title: 'PM2.5: The Invisible Threat in Himalayan Valleys',
      category: 'Particulates',
      summary: 'Why combustion particles smaller than 2.5 microns represent over 80% of health hazards in the Kathmandu Valley.',
      readTime: '4 min read',
      source: 'World Health Organization (WHO)'
    },
    {
      id: 'indoor-vs-outdoor',
      title: 'Indoor vs Outdoor Air Quality: The Chulho & Infiltration Problem',
      category: 'Public Health',
      summary: 'How outdoor ambient smog infiltrates homes and the health consequences of biomass cooking stoves in rural Nepal.',
      readTime: '5 min read',
      source: 'ICIMOD Atmospheric Program'
    },
    {
      id: 'mask-guide',
      title: 'Mask Efficacy: Surgical vs Cloth vs Certified N95',
      category: 'Protection',
      summary: 'Why surgical masks provide zero protection against PM2.5 and how tight facial seal determines particulate filtration.',
      readTime: '3 min read',
      source: 'NIOSH / CDC Environmental Health'
    }
  ];

  const faqs = [
    {
      q: 'Why does air pollution spike in Kathmandu during winter?',
      a: 'The Kathmandu Valley is a geological bowl surrounded by high ridges. During winter, rapid ground radiational cooling traps cold heavy air beneath a ceiling of warm air aloft (thermal temperature inversion). This inversion lid prevents vertical mixing, trapping vehicle exhaust and smoke inside the valley bowl.'
    },
    {
      q: 'Does an AQI of 150 mean the air is twice as bad as AQI 75?',
      a: 'Not necessarily. The AQI scale is piecewise linear rather than strictly linear. Breakpoints are based on epidemiologically observed health risks rather than a 1:1 proportionality with mass concentration.'
    },
    {
      q: 'Can indoor houseplants clean PM2.5 air pollution?',
      a: 'No. While NASA research showed that plants can absorb trace volatile organic compounds (VOCs) in sealed chambers, they do not filter fine particulates like PM2.5. True particulate reduction requires certified mechanical HEPA filtration.'
    },
    {
      q: 'Is wearing an N95 mask sufficient when commuting?',
      a: 'A genuine certified N95 or FFP2 respirator filters at least 95% of fine particulates when properly fitted. However, facial hair or loose straps create perimeter leaks that drastically degrade effective protection.'
    },
    {
      q: 'How does seasonal brick kiln operation impact Nepal air quality?',
      a: 'Brick kilns operate between December and April to coincide with the dry construction season. Burning low-grade coal and biomass, over 100 kilns around the Kathmandu Valley rim contribute 20% to 28% of winter particulate pollution.'
    }
  ];

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Pollution Education Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authoritative, peer-reviewed atmospheric science, public health guidance, and Nepal valley dynamics
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search educational topics..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('aqi')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'aqi' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          AQI Scale Guide
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pollutants')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pollutants' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Criteria Pollutants
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('indoor_outdoor')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'indoor_outdoor' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Indoor vs Outdoor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('nepal')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'nepal' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Nepal Valley Meteorology
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'faq' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Frequently Asked Questions
        </button>
      </div>

      {/* Tab: AQI Scale */}
      {activeTab === 'aqi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AQI_CATEGORIES.map((cat) => (
              <div
                key={cat.level}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {cat.level}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {cat.range[0]} – {cat.range[1]}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  {cat.nepaliLevel}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px]">
                  <div>
                    <strong className="text-slate-700 dark:text-slate-200">Public Advice: </strong>
                    <span className="text-slate-500 dark:text-slate-400">{cat.healthAdvice}</span>
                  </div>
                  <div>
                    <strong className="text-slate-700 dark:text-slate-200">Sensitive Groups: </strong>
                    <span className="text-slate-500 dark:text-slate-400">{cat.sensitiveGroups}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Criteria Pollutants */}
      {activeTab === 'pollutants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POLLUTANTS.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3"
            >
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {p.name} · <span className="text-xs font-normal text-slate-400">{p.fullName}</span>
                  </h3>
                  <div className="text-xs text-slate-400">{p.nepaliName}</div>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                  {p.unit}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {p.description}
              </p>

              <div className="space-y-1.5 text-xs">
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">Health Impact: </strong>
                  <span className="text-slate-500 dark:text-slate-400">{p.healthImpact}</span>
                </div>
                <div>
                  <strong className="text-slate-700 dark:text-slate-200">Primary Origins: </strong>
                  <span className="text-slate-500 dark:text-slate-400">{p.primarySource}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                <span>Nepal Standard: <strong className="text-slate-700 dark:text-slate-200">{p.standardLimit} {p.unit}</strong></span>
                <span>WHO Baseline: <strong className="text-emerald-500">{p.whoLimit} {p.unit}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Indoor vs Outdoor */}
      {activeTab === 'indoor_outdoor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-cyan-500">
              <Home className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Indoor Air Quality & Infiltration
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Without active HEPA filtration, 50% to 70% of outdoor ambient PM2.5 penetrates residential dwellings through gaps in windows, doors, and masonry vents.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1.5">
              <li>Traditional biomass stoves (mud chulho) generate dangerous levels of CO and black carbon.</li>
              <li>Incense burning (dhoop) releases carcinogenic polycyclic aromatic hydrocarbons (PAHs).</li>
              <li>Gas stoves without exhaust ventilation produce concentrated spikes of NO2.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <Wind className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Outdoor Exposure Mitigation
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Personal precautions when commuting or working outside in polluted urban centers:
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1.5">
              <li>Wear certified N95 / FFP2 respirators with tight facial seal during motorcycling and cycling.</li>
              <li>Avoid high-traffic arterial intersections during peak rush hours (08:30–10:00 & 17:30–19:30).</li>
              <li>Schedule outdoor recreation during mid-day when solar convective venting raises the inversion height.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Nepal Valley Meteorology */}
      {activeTab === 'nepal' && (
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              The Physics of Valley Thermal Inversions in Nepal
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The Kathmandu Valley sits at 1,400 meters altitude, ringed by mountains extending up to 2,800 meters. During the dry winter season (November to March), the valley experiences intense nocturnal radiative cooling.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">1. Cool Air Drainage</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Cold air drains down mountain slopes into the basin floor at night, pooling under dense calm air.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">2. Thermal Inversion Cap</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                A warm layer aloft caps vertical dispersion at 200m–300m, trapping smoke and diesel emissions.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">3. Convective Break</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Sunlight warms the ground by late morning, breaking the lid and initiating afternoon venting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Searchable Articles Shelf */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Peer-Reviewed Educational Articles & Briefings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xs flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{art.category}</span>
                  <span>{art.readTime}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {art.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Source: {art.source}</span>
                <span className="text-emerald-500 font-semibold cursor-pointer">Educational Resource</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers & Official Authorities */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Scientific Sources & Public Health Disclaimers</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Content curated from the World Health Organization (WHO 2021 Global Guidelines), the US Environmental Protection Agency (EPA AirNow), the International Centre for Integrated Mountain Development (ICIMOD Atmospheric Initiative), and Nepal's Ministry of Forests and Environment (MOFE).
        </p>
        <p className="text-[11px] text-slate-400 italic">
          Disclaimer: ClearSky provides atmospheric science and environmental awareness. It does not provide medical diagnoses or replace consultations with licensed physicians.
        </p>
      </div>
    </div>
  );
}
