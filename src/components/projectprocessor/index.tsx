import React from "react";
import { useDebouncedState, useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryProjects } from "@/lib/gitlab/projects";
import { UserContextProviderType } from "@/types/usercontext";
import { UserContext } from "@/components/contexts/user";
import { Input } from "@/components/ui/input";

export default function ProjectProcessor() {
  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const lastCardRef = React.useRef<HTMLDivElement>(null);
  const { ref: lastCardRefIntersect, entry: lastCardRefEntry } =
    useIntersection({
      root: lastCardRef.current,
      threshold: 1,
    });

  const [globalFilter, setGlobalFilter] = useDebouncedState("", 200);

  const {
    data: projectsData,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
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

  const _flatProjects = projectsData?.pages
    .flatMap((page) => page.data)
    .filter((project) => !project.archived);

  const _filteredFlatProjects = _flatProjects?.filter(
    (project) =>
      project.name.includes(globalFilter) ||
      project.path_with_namespace.includes(globalFilter),
  );

  if (
    !isFetchingNextPage &&
    !isLoading &&
    hasNextPage &&
    _filteredFlatProjects?.length === 0
  ) {
    fetchNextPage();
  }

  return (
    <div className="container bg-background p-4 shadow-sm flex flex-col border rounded-lg">
      <div className="transition-[padding] duration-300 flex flex-col items-center sm:pb-4 pb-2 w-full">
        <Input
          placeholder="Filter projects ..."
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="w-full"
          disabled={_flatProjects?.length === 0}
        />
      </div>
      <div className="transition-[gap] flex flex-col sm:gap-3 gap-2 overflow-auto">
        {_filteredFlatProjects?.map((project, index) => (
          <div
            key={project.id}
            ref={
              index === _filteredFlatProjects.length - 1
                ? lastCardRefIntersect
                : undefined
            }
          >
            {project.name}
          </div>
        ))}
      </div>
    </div>
  );
}
