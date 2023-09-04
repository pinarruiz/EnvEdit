import React from "react";
import { useDebouncedState, useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryProjects } from "@/lib/gitlab/projects";
import { UserContextProviderType } from "@/types/usercontext";
import { UserContext } from "@/components/contexts/user";
import { Input } from "@/components/ui/input";
import ProjectCard from "@/components/projectcard";
import { GITLAB_PER_PAGE } from "@/lib/appEnv";
import { ProjectProcessorProps } from "@/types/projectprocessor";

export default function ProjectProcessor(props: ProjectProcessorProps) {
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
      userData.accessToken !== "" &&
      !props.loading,
  });

  const _flatProjects = projectsData?.pages
    .flatMap((page) => page.data)
    .filter((project) => !project.archived);

  const _filteredFlatProjects = _flatProjects?.filter(
    (project) =>
      project.name.includes(globalFilter) ||
      project.path_with_namespace.includes(globalFilter),
  );

  if (!isFetchingNextPage && !isLoading && hasNextPage) {
    if (
      (_filteredFlatProjects?.length === 0 && _flatProjects?.length !== 0) ||
      lastCardRefEntry?.isIntersecting
    ) {
      fetchNextPage();
    }
  }

  return (
    <div className="container bg-background p-0 shadow-sm flex flex-col border rounded-lg">
      <div className="transition-[padding] duration-300 px-4 pt-4 flex flex-col items-center w-full">
        <Input
          placeholder="Filter projects ..."
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="w-full"
          disabled={_flatProjects?.length === 0}
        />
      </div>
      <div className="transition-[gap] grid sm:gap-4 gap-2 md:grid-cols-2 lg:grid-cols-3 overflow-auto px-4 sm:py-4 py-2">
        {!props.loading &&
          _filteredFlatProjects?.map((project, index) => (
            <div
              key={project.id}
              ref={
                index === _filteredFlatProjects.length - 1
                  ? lastCardRefIntersect
                  : undefined
              }
            >
              <ProjectCard
                projectName={project.name}
                projectId={project.id}
                namespace={project.name_with_namespace.replace(
                  ` / ${project.name}`,
                  "",
                )}
              />
            </div>
          ))}
        {(props.loading || isLoading || isFetchingNextPage) &&
          Array.from(Array(GITLAB_PER_PAGE)).map((index) => (
            <ProjectCard
              key={`loading${index}`}
              projectName=""
              projectId={0}
              namespace=""
              loading
            />
          ))}
      </div>
    </div>
  );
}
