import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Tag, Calendar, Compass } from 'lucide-react';
import type { DashboardStats } from '../types';

interface StatsPanelProps {
  stats: DashboardStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  const statItems = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-400',
      description: 'Books in your collection',
    },
    {
      title: 'Unique Genres',
      value: stats.totalGenres,
      icon: Tag,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
      description: 'Different genres cataloged',
    },
    {
      title: 'Earliest Release',
      value: stats.earliestYear ?? '—',
      icon: Calendar,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      description: 'Oldest publication year',
    },
    {
      title: 'Latest Release',
      value: stats.latestYear ?? '—',
      icon: Compass,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      description: 'Most recent addition',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Background Glow Effect */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-xl`} />

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                {item.title}
              </span>
              <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/55 ${item.textColor}`}>
                <Icon size={20} />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <span className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1">
                {item.value}
              </span>
              <span className="text-xs text-slate-400">
                {item.description}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
