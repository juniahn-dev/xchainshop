"use client";

import { Skeleton } from "./ui/skeleton";

export const SkeletonCards: React.FC = () => {
  return (
    <>
      <div className="flex flex-col space-y-3 w-[350px]">
        <Skeleton className="h-[230px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3 w-[350px]">
        <Skeleton className="h-[230px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3 w-[350px]">
        <Skeleton className="h-[230px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3 w-[350px]">
        <Skeleton className="h-[230px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </>
  );
};
