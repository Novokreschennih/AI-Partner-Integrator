
import React from 'react';

const SkeletonBox: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-slate-700/50 rounded-lg animate-pulse ${className}`} />
);

export const ResultSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-950 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar Skeleton */}
        <aside className="lg:col-span-1 space-y-6">
          <div>
            <SkeletonBox className="h-7 w-1/2 mb-3" />
            <div className="border border-slate-700/50 rounded-lg p-4 space-y-4">
              <SkeletonBox className="h-4 w-1/3" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-1/3 mt-3" />
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-4 w-4/5" />
            </div>
          </div>
          <div>
            <SkeletonBox className="h-7 w-2/3 mb-3" />
            <div className="border border-slate-700/50 rounded-lg p-4 space-y-3">
               <SkeletonBox className="h-4 w-1/3 mb-2" />
               <SkeletonBox className="h-14 w-full" />
               <SkeletonBox className="h-8 w-full mt-2" />
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="lg:col-span-2">
          <SkeletonBox className="h-7 w-2/3 mb-3" />
          <SkeletonBox className="h-5 w-full mb-4" />
          
          {/* Chat Preview Skeleton */}
          <div className="border border-slate-700/50 rounded-lg p-4 h-[400px] mb-4 flex flex-col justify-end">
            <div className="space-y-4">
                <div className="flex flex-col items-start">
                    <SkeletonBox className="h-10 w-3/5 rounded-lg" />
                    <div className="flex gap-2 mt-2">
                        <SkeletonBox className="h-7 w-20 rounded-full" />
                        <SkeletonBox className="h-7 w-24 rounded-full" />
                    </div>
                </div>
                 <div className="flex flex-col items-end self-end">
                    <SkeletonBox className="h-10 w-1/3 rounded-lg" />
                </div>
                <div className="flex flex-col items-start">
                    <SkeletonBox className="h-12 w-4/5 rounded-lg" />
                </div>
            </div>
          </div>

          {/* Export Controls Skeleton */}
          <div className="border border-slate-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <SkeletonBox className="h-8 w-2/3" />
                <SkeletonBox className="h-8 w-1/4" />
            </div>
            <SkeletonBox className="h-40 w-full" />
          </div>
        </main>
      </div>
    </div>
  );
};
