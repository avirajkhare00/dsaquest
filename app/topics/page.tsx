import { topics } from "@/data/topics";
import TopicCard from "@/components/TopicCard";

export const metadata = {
  title: "All Topics — DSAQuest",
  description: "Choose a data structure or algorithm topic to master.",
};

export default function TopicsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-3">
          📚 All Topics
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Each topic contains a story, an interactive visualizer, and a quiz.
          Master them all to become interview-ready!
        </p>
      </div>

      {/* Difficulty filter summary */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {[
          { label: 'Beginner', color: 'bg-green-100 text-green-700 border-green-200', count: topics.filter(t => t.difficulty === 'Beginner').length },
          { label: 'Intermediate', color: 'bg-amber-100 text-amber-700 border-amber-200', count: topics.filter(t => t.difficulty === 'Intermediate').length },
          { label: 'Advanced', color: 'bg-red-100 text-red-700 border-red-200', count: topics.filter(t => t.difficulty === 'Advanced').length },
        ].map(({ label, color, count }) => count > 0 && (
          <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${color}`}>
            <span>{label}</span>
            <span className="font-bold">{count}</span>
          </div>
        ))}
      </div>

      {/* Topics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, i) => (
          <TopicCard key={topic.slug} topic={topic} index={i} />
        ))}
      </div>

      {/* Coming soon */}
      <div className="mt-16 text-center">
        <h2 className="text-xl font-bold text-gray-700 mb-4">🔜 Coming Soon</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['Graphs & BFS/DFS', 'Dynamic Programming', 'Hash Tables', 'Heaps & Priority Queues', 'Tries', 'Backtracking'].map(topic => (
            <span key={topic} className="px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm border border-dashed border-gray-200">
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
