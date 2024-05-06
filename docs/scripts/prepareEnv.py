from os import getenv

if __name__ == "__main__":
    GITHUB_ENV = getenv("GITHUB_ENV", None)
    ENV_FILE_MODE = "w" if getenv("CI", None) is None else "a"
    print(f"Writing to {GITHUB_ENV} in mode {ENV_FILE_MODE}")

    if GITHUB_ENV is not None:
        with open(
            file=GITHUB_ENV,
            mode=ENV_FILE_MODE,
            encoding="utf-8",
        ) as gh_env_file:

            def write_to_env_file(string: str):
                gh_env_file.write(
                    string.replace("'", "") + ("" if string[-1] == "\n" else "\n")
                )
                print(string)

            GITHUB_REPOSITORY = getenv("GITHUB_REPOSITORY", "pinarruiz/EnvEdit")
            write_to_env_file(f"{GITHUB_REPOSITORY=}")

            REPOSITORY_URL = f"https://github.com/{GITHUB_REPOSITORY}"
            write_to_env_file(f"{REPOSITORY_URL=}")

            REPOSITORY_OWNER = GITHUB_REPOSITORY.split("/")[0]
            write_to_env_file(f"{REPOSITORY_OWNER=}")

            REPOSITORY_NAME = GITHUB_REPOSITORY.split("/")[1]
            write_to_env_file(f"{REPOSITORY_NAME=}")

            SITE_NAME = f"{REPOSITORY_NAME} Docs\n"
            write_to_env_file(f"{SITE_NAME=}")

            PAGES_URL = f"https://{REPOSITORY_OWNER}.github.io/{REPOSITORY_NAME}/"
            write_to_env_file(f"{PAGES_URL=}")
