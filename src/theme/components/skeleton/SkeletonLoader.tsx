import { Card, Skeleton } from "@nextui-org/react";

export const SkeletonLoader = () => {
  return (
    <div className="w-screen h-72 md:h-86 xl:96 flex justify-center items-center md:w-56 lg:w-96 xl:w-[100%] xl:h-96 mx-2 my-2 cursor-pointer">
      <Card className="w-[100%] h-[100%] space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      </Card>
    </div>
  );
};
