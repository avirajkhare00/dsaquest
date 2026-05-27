import Link from "next/link";
import { topics } from "@/data/topics";
import TopicCard from "@/components/TopicCard";

const features = [
  {
    emoji: "📖",
    title: "Story-Driven Learning",
    desc: "Every algorithm comes with a story. Arrays are a library. Linked lists are a spy network. Your brain wires faster with narrative.",
  },
  {
    emoji: "🎮",
    title: "Interactive Visualizers",
    desc: "Watch algorithms work step-by-step. Pause, rewind, control speed. See exactly what happens at each comparison and swap.",
  },
  {
    emoji: "🧠",
    title: "Interview-Ready Patterns",
    desc: "Two pointers. Sliding window. Fast/slow pointers. DFS templates. Every pattern that shows up in 70% of interview problems.",
  },
  {
    emoji: "🏆",
    title: "Quizzes That Stick",
    desc: "Test yourself with interview-style questions. Immediate explanations that give you the 'aha!' moment — not just the answer.",
  },
];

const stats = [
  { value: "8", label: "Core Topics" },
  { value: "24", label: "Story Chapters" },
  { value: "40+", label: "Interview Patterns" },
  { value: "40", label: "Quiz Questions" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 pt-16 pb-24 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Perfect for coding interview prep
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Master DSA,{" "}
            <span className="shimmer-text">One Story at a Time</span>{" "}
            🚀
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Arrays. Linked Lists. Sorting. Trees. Learn each one through
            <strong className="text-gray-800"> engaging stories</strong>,
            <strong className="text-gray-800"> step-by-step visualizations</strong>, and
            <strong className="text-gray-800"> interview-focused quizzes</strong>.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-0.5"
            >
              🎮 Start Learning
            </Link>
            <Link
              href="/topics/arrays"
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              📚 Try Arrays First
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-indigo-600">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            📚 Pick Your Adventure
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Each topic is a complete learning journey — story, visualizer, and quiz included.
            Start anywhere, they&apos;re self-contained!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              ✨ Why DSAQuest Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ emoji, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning path */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            🗺️ Recommended Learning Path
          </h2>
          <p className="text-gray-600">Follow this order for the most effective interview prep journey</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-200 via-pink-200 to-emerald-200" />

          <div className="space-y-4">
            {topics.map((topic, i) => (
              <Link key={topic.slug} href={`/topics/${topic.slug}`}>
                <div className={`relative flex items-center gap-6 p-5 bg-white rounded-2xl border border-gray-100 card-hover shadow-sm ${i % 2 === 0 ? 'sm:mr-8' : 'sm:ml-8'}`}>
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center text-2xl shadow-md`}>
                    {topic.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Step {i + 1}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : topic.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-0.5">{topic.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{topic.tagline}</p>
                  </div>
                  <span className="text-gray-300 text-xl flex-shrink-0">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-black mb-4">Ready to crack the coding interview? 💪</h2>
        <p className="text-indigo-200 mb-8 max-w-md mx-auto">
          Every top-tier engineer learned these fundamentals. Your turn.
        </p>
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl"
        >
          🚀 Start Your Quest
        </Link>
      </section>
    </div>
  );
}
