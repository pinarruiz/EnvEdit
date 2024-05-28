import React from "react";
import { useDebouncedState } from "@mantine/hooks";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ProjectVariableSchema } from "@gitbeaker/rest";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/contexts/user";
import { VariableProcessorProps } from "@/types/variables/processor";
import { queryVariables } from "@/lib/gitlab/variables";
import VariableCard, { LoadingVariableCard } from "@/components/variables/card";
import { GITLAB_PER_PAGE } from "@/lib/appEnv";
import DownloadEnvButton from "@/components/downloadenv/button";
import UploadEnvButton from "@/components/uploadenv/button";

export default function VariableProcessor(props: VariableProcessorProps) {
  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const [globalFilter, setGlobalFilter] = useDebouncedState("", 200);
  const [extraEnvs, setExtraEnvs] = React.useState<
    ProjectVariableSchema["environment_scope"][]
  >(["*"]);

  const {
    data: variablesData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["variables", props.projectId, userData.accessToken],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
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

  const _flatEnvironmentScopes =
    _flatVariables
      ?.flatMap((data) => data.environment_scope)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      }) || [];

  const _flatEnvironmentScopesExtras = [
    ..._flatEnvironmentScopes,
    ...extraEnvs.filter((envName) => !_flatEnvironmentScopes.includes(envName)),
  ];

  const _consolidatedVariables: Record<
    ProjectVariableSchema["key"],
    Record<
      ProjectVariableSchema["environment_scope"],
      ProjectVariableSchema["value"]
    >
  > = {};

  _flatVariables?.forEach((variable) => {
    if (variable.key.toLowerCase().includes(globalFilter.toLowerCase())) {
      if (!Object.keys(_consolidatedVariables).includes(variable.key)) {
        _consolidatedVariables[variable.key] = {};
      }
      _consolidatedVariables[variable.key][variable.environment_scope] =
        variable.value;
    }
  });

  if (!isFetchingNextPage && !isLoading && hasNextPage) {
    fetchNextPage();
  }

  const noVariables =
    !isFetchingNextPage && !isLoading && _flatVariables?.length === 0;

  const noResults =
    !isFetchingNextPage &&
    !isLoading &&
    _flatVariables &&
    _flatVariables.length > 0 &&
    Object.keys(_consolidatedVariables).length === 0;

  return (
    <div className="container bg-background p-0 shadow-sm flex flex-col border rounded-lg">
      <div className="transition-[padding] duration-300 px-4 pt-4 pb-4 flex flex-col items-center w-full gap-2 md:pb-0 md:gap-5 md:flex-row">
        <Input
          placeholder="Filter variables ..."
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="w-full"
          disabled={_flatVariables?.length === 0}
        />
        <div className="flex gap-2 md:gap-5 w-full md:w-auto">
          <DownloadEnvButton
            projectId={props.projectId}
            flatVariables={_flatVariables !== undefined ? _flatVariables : []}
            env_scopes_no_extra={_flatEnvironmentScopes}
            loading={
              props.loading ||
              isLoading ||
              isFetchingNextPage ||
              status === "pending" ||
              hasNextPage
            }
          />
          <UploadEnvButton
            projectId={props.projectId}
            env_scopes={_flatEnvironmentScopesExtras}
            loading={
              props.loading ||
              isLoading ||
              isFetchingNextPage ||
              status === "pending" ||
              hasNextPage
            }
          />
        </div>
      </div>
      <div
        className={cn(
          "transition-[gap] overflow-auto px-4 md:py-4 py-2 flex flex-col md:gap-4 gap-2",
          noResults || noVariables ? "flex" : "",
        )}
      >
        {Object.keys(_consolidatedVariables).map((key) => (
          <VariableCard
            key={key}
            variableName={key}
            variable={_consolidatedVariables[key]}
            envScopes={_flatEnvironmentScopesExtras}
            projectId={props.projectId}
            extraEnvs={extraEnvs}
            setExtraEnvs={setExtraEnvs}
          />
        ))}
        {(props.loading ||
          isLoading ||
          isFetchingNextPage ||
          status === "pending") &&
          Array.from(Array(GITLAB_PER_PAGE)).map((_, index) => (
            <LoadingVariableCard key={`loading${index}`} />
          ))}
        {noResults && <p className="text-center w-full">No results</p>}
        {noVariables && (
          <p className="text-center w-full">There are no variables</p>
        )}
      </div>
    </div>
  );
}
