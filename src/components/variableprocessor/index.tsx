import React from "react";
import { useDebouncedState } from "@mantine/hooks";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/usercontext";
import { VariableProcessorProps } from "@/types/variableprocessor";
import { queryVariables } from "@/lib/gitlab/variables";
import VariableCard from "@/components/variablecard";

export default function VariableProcessor(props: VariableProcessorProps) {
  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const [globalFilter, setGlobalFilter] = useDebouncedState("", 200);

  const { data: variablesData } = useInfiniteQuery({
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

  const _flatVariables = variablesData?.pages.flatMap((page) => page.data);

  const _filteredFlatVariables = _flatVariables?.filter((variable) =>
    variable.key.toLowerCase().includes(globalFilter.toLowerCase()),
  );

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
      <div className="transition-[gap] overflow-auto px-4 sm:py-4 py-2 flex flex-col sm:gap-4 gap-2">
        {_filteredFlatVariables?.map((variable, index) => (
          <VariableCard key={index} variable={variable} />
        ))}
      </div>
    </div>
  );
}
