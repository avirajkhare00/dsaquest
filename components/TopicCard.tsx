import Link from 'next/link';
import type { Topic } from '@/data/topics';

interface TopicCardProps {
  topic: Topic;
  index?: number;
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

export default function TopicCard({ topic, index = 0 }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.slug}`}>
      <div
        className="card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${topic.gradient} p-6 text-white`}>
          <div className="flex items-start justify-between">
            <span className="text-4xl">{topic.emoji}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm`}>
              {topic.difficulty}
            </span>
          </div>
          <h3 className="text-xl font-bold mt-3">{topic.title}</h3>
          <p className="text-sm text-white/80 mt-1">{topic.tagline}</p>
        </div>

        {/* Card body */}
        <div className="p-5">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {topic.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>⏱️ {topic.timeToComplete}</span>
              <span>•</span>
              <span>🧩 {topic.patterns.length} patterns</span>
            </div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              Start <span>→</span>
            </span>
          </div>

          {/* Complexity preview */}
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Key Complexity</p>
            <div className="flex flex-wrap gap-1">
              {topic.keyComplexities.slice(0, 2).map(({ operation, complexity }) => (
                <span
                  key={operation}
                  className="text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                >
                  {operation.split(' ')[0]}: <strong className="text-gray-900">{complexity}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
