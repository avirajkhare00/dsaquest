import Link from 'next/link';
import type { Topic } from '@/data/topics';

type TopicStatus = 'not-started' | 'in-progress' | 'completed';

interface TopicCardProps {
  topic: Topic;
  index?: number;
  status?: TopicStatus;
}

const statusConfig: Record<TopicStatus, { label: string; color: string }> = {
  'not-started': { label: '', color: '' },
  'in-progress': { label: '📖 In Progress', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700' },
  'completed': { label: '✅ Completed', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700' },
};

export default function TopicCard({ topic, index = 0, status = 'not-started' }: TopicCardProps) {
  const badge = statusConfig[status];

  return (
    <Link href={`/topics/${topic.slug}`}>
      <div
        className="card-hover rounded-2xl border overflow-hidden cursor-pointer"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          animationDelay: `${index * 100}ms`,
        }}
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${topic.gradient} p-6 text-white relative`}>
          <div className="flex items-start justify-between">
            <span className="text-4xl">{topic.emoji}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {topic.difficulty}
            </span>
          </div>
          <h3 className="text-xl font-bold mt-3">{topic.title}</h3>
          <p className="text-sm text-white/80 mt-1">{topic.tagline}</p>
        </div>

        {/* Card body */}
        <div className="p-5">
          {/* Status badge */}
          {status !== 'not-started' && (
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border mb-3 ${badge.color}`}>
              {badge.label}
            </div>
          )}

          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
            {topic.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
              <span>⏱️ {topic.timeToComplete}</span>
              <span>•</span>
              <span>🧩 {topic.patterns.length} patterns</span>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              {status === 'completed' ? 'Review' : 'Start'} <span>→</span>
            </span>
          </div>

          {/* Complexity preview */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Key Complexity</p>
            <div className="flex flex-wrap gap-1">
              {topic.keyComplexities.slice(0, 2).map(({ operation, complexity }) => (
                <span
                  key={operation}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--card-border)', color: 'var(--muted)' }}
                >
                  {operation.split(' ')[0]}: <strong style={{ color: 'var(--foreground)' }}>{complexity}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
