import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`}></div>
  );
};

export const TableSkeleton = () => (
  <div className="space-y-4 w-full">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-[32px]" />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-8">
      <Skeleton className="col-span-2 h-[400px] rounded-[40px]" />
      <Skeleton className="h-[400px] rounded-[40px]" />
    </div>
  </div>
);

export default Skeleton;
