// components/skeleton-heredero.tsx
export default function SkeletonHeredero() {
  return (
    <div className="glassmorphism p-4 rounded-xl animate-pulse border border-primary/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-700/40 h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-600/40 rounded w-32" />
            <div className="h-3 bg-gray-600/30 rounded w-24" />
            <div className="h-3 bg-gray-600/20 rounded w-20" />
          </div>
        </div>
        <div className="h-10 w-10 bg-gray-700/30 rounded-full" />
      </div>
      <div className="flex space-x-2 mt-2">
        <div className="h-5 w-16 bg-gray-700/20 rounded" />
        <div className="h-5 w-14 bg-gray-700/20 rounded" />
        <div className="h-5 w-12 bg-gray-700/20 rounded" />
      </div>
    </div>
  );
}
