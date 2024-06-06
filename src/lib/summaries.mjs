import boxen from "boxen";
import appEnv from "./appEnv.js";

const boxenGenericOptions = {
  titleAlignment: "center",
  padding: 1,
  textAlignment: "center",
  borderColor: "green",
  float: "center",
};

const buildMessage = [
  `Gitlab Domain: ${appEnv.GITLAB_DOMAIN}`,
  `NextAuth URL: ${appEnv.NEXTAUTH_URL}`,
];

const boxes = {
  build: {
    message: buildMessage.join("\n"),
    boxenOptions: {
      title: "Build Info",
    },
  },
};

const argv = process.argv.slice(2);
if (argv.length == 1 && Object.keys(boxes).includes(argv[0])) {
  const boxInfo = boxes[argv[0]];
  console.log(
    boxen(boxInfo.message, { ...boxenGenericOptions, ...boxInfo.boxenOptions }),
  );
}
