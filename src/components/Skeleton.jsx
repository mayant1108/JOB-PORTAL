const shimmerClass = 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]';

export const SkeletonJobCard = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
    <div className="flex items-start gap-4">
      <div className={`h-12 w-12 shrink-0 rounded-lg ${shimmerClass}`} />
      <div className="min-w-0 flex-1 space-y-3">
        <div className={`h-5 w-2/3 rounded-md ${shimmerClass}`} />
        <div className={`h-4 w-1/3 rounded-md ${shimmerClass}`} />
        <div className="flex flex-wrap gap-2 pt-2">
          <div className={`h-6 w-16 rounded-md ${shimmerClass}`} />
          <div className={`h-6 w-20 rounded-md ${shimmerClass}`} />
          <div className={`h-6 w-14 rounded-md ${shimmerClass}`} />
        </div>
        <div className="h-10 w-full rounded-lg bg-slate-100" />
      </div>
    </div>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
    <div className={`h-8 w-8 rounded-lg ${shimmerClass}`} />
    <div className={`mt-4 h-8 w-16 rounded-md ${shimmerClass}`} />
    <div className={`mt-2 h-4 w-24 rounded-md ${shimmerClass}`} />
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 rounded-md ${shimmerClass}`}
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonAvatarText = () => (
  <div className="flex items-center gap-3">
    <div className={`h-10 w-10 rounded-full ${shimmerClass}`} />
    <div className="flex-1 space-y-2">
      <div className={`h-4 w-1/3 rounded-md ${shimmerClass}`} />
      <div className={`h-3 w-1/2 rounded-md ${shimmerClass}`} />
    </div>
  </div>
);

const Skeleton = {
  JobCard: SkeletonJobCard,
  StatCard: SkeletonStatCard,
  Text: SkeletonText,
  AvatarText: SkeletonAvatarText,
};

export default Skeleton;

