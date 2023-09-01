import React from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryProjects } from "@/lib/gitlab/projects";
import { UserContextProviderType } from "@/types/usercontext";
import { UserContext } from "../contexts/user";

export default function ProjectProcessor() {
  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const lastCardRef = React.useRef<HTMLDivElement>(null);
  const {
    // ref: lastCardRefIntersect,
    entry: lastCardRefEntry,
  } = useIntersection({
    root: lastCardRef.current,
    threshold: 1,
  });

  const {
    // data: projectsData,
    fetchNextPage,
    // isLoading,
    // isFetchingNextPage,
    // hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["projectsData", userData.accessToken],
    queryFn: async ({ pageParam = 1 }) =>
      queryProjects(userData.accessToken as string, pageParam),
    getNextPageParam: (lastPage) => lastPage.paginationInfo.next,
    getPreviousPageParam: (lastPage) => lastPage.paginationInfo.previous,
    enabled:
      userData.accessToken !== undefined &&
      userData.accessToken !== null &&
      userData.accessToken !== "",
  });

  React.useEffect(() => {
    if (lastCardRefEntry?.isIntersecting) {
      fetchNextPage();
    }
  }, [fetchNextPage, lastCardRefEntry?.isIntersecting]);

  return (
    <div className="container bg-background p-4 shadow-sm flex border rounded-lg"></div>
  );
}
