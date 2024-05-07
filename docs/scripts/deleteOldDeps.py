from os import getenv

from github import Auth, Github
from requests import Timeout
from requests import delete as reqdelete

if __name__ == "__main__":
    g = Github(auth=Auth.Token(token=str(getenv("GITHUB_AUTH_TOKEN"))))
    repo = g.get_repo(getenv("GITHUB_REPOSITORY", "pinarruiz/EnvEdit"))
    for deployment in repo.get_deployments(environment="github-pages"):
        is_inactive = any(
            status.state == "inactive" for status in deployment.get_statuses()
        )
        if is_inactive:
            try:
                print(f"Deleting {deployment.id} ...")
                res = reqdelete(
                    url=deployment.url,
                    timeout=20,
                    headers={
                        "Accept": "application/vnd.github+json",
                        "Authorization": f"Bearer {getenv('GITHUB_AUTH_TOKEN')}",
                        "X-GitHub-Api-Version": "2022-11-28",
                    },
                )
                if res.status_code == 204:
                    print(f"Deleted {deployment.id}")
                else:
                    print(f"Cannot delete {deployment.id}, error {res.status_code}")
            except Timeout:
                print(f"Timeout for {deployment.id}")
