import React from "react";
import { useDebouncedState } from "@mantine/hooks";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/usercontext";
import { VariableProcessorProps } from "@/types/variableprocessor";
import { queryVariables } from "@/lib/gitlab/variables";
import VariableCard from "@/components/variablecard";
import { GITLAB_PER_PAGE } from "@/lib/appEnv";

export default function VariableProcessor(props: VariableProcessorProps) {
  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const [globalFilter, setGlobalFilter] = useDebouncedState("", 200);

  const {
    data: variablesData,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["variables", props.projectId, userData.accessToken],
    queryFn: async ({ pageParam = 1 }) =>
      queryVariables(
        userData.accessToken as string,
        props.projectId,
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage.paginationInfo.next,
    getPreviousPageParam: (lastPage) => lastPage.paginationInfo.previous,
    enabled:
      userData.accessToken !== undefined &&
      userData.accessToken !== null &&
      userData.accessToken !== "" &&
      !props.loading,
  });

  const _flatVariables = variablesData?.pages
    .flatMap((page) => page.data)
    .filter((variable) => variable.variable_type === "env_var");

  const _filteredFlatVariables = _flatVariables?.filter((variable) =>
    variable.key.toLowerCase().includes(globalFilter.toLowerCase()),
  );

  const noVariables =
    !isFetchingNextPage && !isLoading && _flatVariables?.length === 0;

  const noResults =
    !isFetchingNextPage &&
    !isLoading &&
    _flatVariables &&
    _flatVariables.length > 0 &&
    _filteredFlatVariables?.length === 0;

  return (
    <div className="container bg-background p-0 shadow-sm flex flex-col border rounded-lg">
      <div className="transition-[padding] duration-300 px-4 pt-4 flex flex-col items-center w-full">
        <Input
          placeholder="Filter variables ..."
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="w-full"
          disabled={_flatVariables?.length === 0}
        />
      </div>
      <div
        className={cn(
          "transition-[gap] overflow-auto px-4 sm:py-4 py-2 flex flex-col sm:gap-4 gap-2",
          noResults || noVariables ? "flex" : "",
        )}
      >
        {_filteredFlatVariables?.map((variable, index) => (
          <VariableCard key={index} variable={variable} />
        ))}
        {(props.loading || isLoading || isFetchingNextPage) &&
          Array.from(Array(GITLAB_PER_PAGE)).map((index) => (
            <VariableCard key={`loading${index}`} loading />
          ))}
        {noResults && <p className="text-center w-full">No results</p>}
        {noVariables && (
          <p className="text-center w-full">There are no variables</p>
        )}
      </div>
    </div>
  );
}
