interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
  );
}

function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-6 rounded-xl bg-white border border-gray-100 shadow-card p-6">
      <Skeleton className="h-24 w-24 rounded-2xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-4 mt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}

function InfoCardSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-card p-6">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-card p-6">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileHeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCardSkeleton />
        <InfoCardSkeleton />
      </div>
      <InfoCardSkeleton />
      <SkillsSkeleton />
    </div>
  );
}
