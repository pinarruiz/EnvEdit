import React from "react";
import { Button } from "@/components/ui/button";
import { ProjectSchema } from "@gitbeaker/rest";
import {
  CirclePlus,
  ExternalLink,
  FolderGit2,
  GitCommitHorizontal,
  GitMerge,
  LucideIcon,
  Settings,
  SquareAsterisk,
} from "lucide-react";

type QuickLinksProps =
  | { projectData: ProjectSchema; loading: false }
  | { loading: true };

export default function QuickLinks(props: QuickLinksProps) {
  const quickLinks: Record<string, { url: string; icon: LucideIcon }> = {
    ["Open project"]: {
      url: props.loading ? "" : props.projectData.web_url,
      icon: ExternalLink,
    },
    ["Project settings"]: {
      url: props.loading ? "" : props.projectData.web_url + "/edit",
      icon: Settings,
    },
    ["Pipelines"]: {
      url: props.loading ? "" : props.projectData.web_url + "/-/pipelines",
      icon: GitCommitHorizontal,
    },
    ["New pipeline"]: {
      url: props.loading ? "" : props.projectData.web_url + "/-/pipelines/new",
      icon: CirclePlus,
    },
    ["CI/CD settings"]: {
      url: props.loading ? "" : props.projectData.web_url + "/-/settings/ci_cd",
      icon: SquareAsterisk,
    },
    ["Repository settings"]: {
      url: props.loading
        ? ""
        : props.projectData.web_url + "/-/settings/repository",
      icon: FolderGit2,
    },
    ["Merge settings"]: {
      url: props.loading
        ? ""
        : props.projectData.web_url + "/-/settings/merge_requests",
      icon: GitMerge,
    },
  };

  return (
    <div className="container bg-background p-0 shadow-sm flex flex-col border rounded-lg">
      <div className="p-4 text-center">
        {Object.keys(quickLinks).map((quickLinkName) => {
          const quickLinkData = quickLinks[quickLinkName];
          const Icon = quickLinkData.icon;
          return (
            <form
              key={quickLinkName}
              action={quickLinkData.url}
              method="get"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block m-1 first:ml-0 last:mr-0 w-full sm:w-fit"
            >
              <Button
                variant="outline"
                className="flex py-5 gap-2 w-full"
                disabled={props.loading}
              >
                <Icon />
                <p>{quickLinkName}</p>
              </Button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
