import * as fs from "fs";

const devServerTsConfig = JSON.parse(fs.readFileSync(".react-email/tsconfig.json").toString());
const currentTsConfig = JSON.parse(fs.readFileSync("tsconfig.json").toString());

const normalizedPaths = Object.entries(currentTsConfig.compilerOptions.paths).reduce(
  (prev, [key, paths]) => {
    return { ...prev, [key]: paths.map((path) => `../${path}`) };
  },
  {},
);

devServerTsConfig.compilerOptions.paths = normalizedPaths;

fs.writeFileSync(".react-email/tsconfig.json", JSON.stringify(devServerTsConfig, null, 2));
