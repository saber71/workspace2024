import axios from "axios";
import { remove } from "common";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import terminal from "terminal-kit";

const term = terminal.terminal;

const workspaceDependencies = [
  "class-validator",
  "common",
  "dependency-injection",
  "http-test",
  "server",
  "server-api-provider",
  "server-platform-express",
  "server-platform-koa",
  "vue-auto-route",
  "vue-class",
];

enum ProjectType {
  Packages = "packages",
  Projects = "projects",
}

const dependencies: Dependency[] = [];
const peerDependencies: Dependency[] = [];
const externalDependencies: string[] = [];
let isBin = false;
let binName = "";
let isBrowser = false;
let useVite = false;
let useVue = false;
let useVueJsx = false;
let useDecorator = false;

const waitWriteContents: Array<{
  path: string;
  content?: string | (() => string);
  isDir?: boolean;
}> = [];

const workspaceRoot = enterWorkspaceRoot("workspace2024");
const templateBinDir = path.join(workspaceRoot, "packages", "template", "bin");

axios.defaults.baseURL = getNpmRegistry();

const chosenType = await chooseType([
  ProjectType.Packages,
  ProjectType.Projects,
]);
const [projectPath, projectName] = await inputProjectNameAndGetPath();

if (chosenType === ProjectType.Packages) {
  await isBinOrNot();
  if (isBin) {
    binName = await inputBinName();
    await addDependencies();
  } else {
    await useViteOrNot();
    await useVueOrNot();
    if (useVue) await useVueJsxOrNot();
  }
} else {
  await isBrowserOrNot();
}

setupTsConfig();
outputFile();
process.exit();

async function addDependencies() {
  const result = await inputDependencies();
  dependencies.push(
    ...result.map((item) => ({
      name: item.name,
      version: item.version || "workspace:*",
    })),
  );
}

function inputBinName() {
  return new Promise<string>((resolve, reject) => {
    br();
    term.cyan("请输入命令名：");
    term.inputField(function (err, input) {
      if (err) reject(err);
      else {
        input = (input || "").trim();
        if (input) {
          if (/\s/.test(input)) {
            term.red("not allow blank");
            inputBinName().then(resolve).catch(reject);
          } else {
            resolve(input);
          }
        } else {
          inputBinName().then(resolve).catch(reject);
        }
      }
    });
  });
}

async function isBrowserOrNot() {
  isBrowser = await yesOrNot("是否是浏览器端项目？", false);
}

async function useVueJsxOrNot() {
  useVueJsx = await yesOrNot("是否使用Jsx？", true);
}

async function useVueOrNot() {
  useVue = await yesOrNot("是否使用Vue？", false);
}

async function isBinOrNot() {
  isBin = await yesOrNot("是否是bin项目？", false);
  if (isBin) {
    waitWriteContents.push(
      {
        path: path.join(projectPath, "bin"),
        isDir: true,
      },
      {
        path: path.join(projectPath, "bin", "index.ts"),
      },
    );
  }
}

function setupTsConfig() {
  waitWriteContents.push({
    path: path.resolve(projectPath, "tsconfig.json"),
    content() {
      if (isBin)
        return fs.readFileSync(
          path.join(templateBinDir, "tsconfig.bin.json"),
          "utf8",
        );
      else if (chosenType === ProjectType.Packages)
        return fs.readFileSync(
          path.join(templateBinDir, "tsconfig.packages.json"),
          "utf8",
        );
      else
        return fs.readFileSync(
          path.join(templateBinDir, "tsconfig.projects.json"),
          "utf8",
        );
    },
  });
}

async function useViteOrNot() {
  useVite = await yesOrNot("是否使用Vite？", true);
  if (useVite) {
    waitWriteContents.push({
      path: path.resolve(projectPath, "vite.config.ts"),
      content() {
        const imports = [
          'import { resolve } from "path";',
          'import swc from "unplugin-swc";',
          'import { defineConfig } from "vite";',
          'import dtsPlugin from "vite-plugin-dts";',
        ];
        const plugins: string[] = [
          "dtsPlugin({ rollupTypes: true })",
          "swc.vite()",
        ];
        if (useVueJsx) {
          imports.push('import vueJsx from "@vitejs/plugin-vue-jsx";');
          if (useDecorator)
            plugins.unshift(`vueJsx({
      babelPlugins: [
        [
          "@babel/plugin-proposal-decorators",
          {
            version: "legacy",
          },
        ],
        ["@babel/plugin-transform-class-properties"],
      ],
    })`);
          else plugins.unshift("vueJsx()");
        }
        if (useVue) {
          imports.push('import vue from "@vitejs/plugin-vue";');
          plugins.unshift("vue()");
        }
        return (
          imports.join("\n") +
          `
export default defineConfig({
  plugins: [${plugins.join(",")}],
  build: {
    rollupOptions: {
      external: [${externalDependencies.map((item) => `"${item}"`).join(",")}],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});`
        );
      },
    });
  }
}

function outputFile() {
  try {
    fs.mkdirSync(projectPath);
    for (let waitWriteContent of waitWriteContents) {
      if (waitWriteContent.isDir) fs.mkdirSync(waitWriteContent.path);
      else {
        const content =
          typeof waitWriteContent.content === "function"
            ? waitWriteContent.content()
            : waitWriteContent.content;
        fs.writeFileSync(waitWriteContent.path, content || "");
      }
    }
  } catch (e) {
    fs.rmdirSync(projectPath);
    throw e;
  }
}

async function inputProjectNameAndGetPath() {
  let projectName: string = "";
  let projectPath: string = "";
  while (!projectPath) {
    projectName = await inputProjectName();
    projectName = projectName.toLowerCase();
    projectPath = path.join(workspaceRoot, chosenType, projectName);
    if (fs.existsSync(projectPath)) {
      projectPath = "";
      br();
      term.red(`项目名${projectName}已存在\n`);
    }
  }
  return [projectPath, projectName];
}

function inputProjectName() {
  return new Promise<string>((resolve, reject) => {
    term.cyan("请输入项目名：");
    term.inputField((err, res) => {
      if (err) reject(err);
      else if (res?.trim()) resolve(res.trim());
      else {
        br();
        inputProjectName().then(resolve).catch(reject);
      }
    });
  });
}

function chooseType(types: ProjectType[]): Promise<ProjectType> {
  return new Promise<ProjectType>((resolve, reject) => {
    term.cyan("请选择项目类型：");
    term.singleColumnMenu(
      types.map((item, index) => index + 1 + "." + item),
      function (err, response) {
        if (err) reject(err);
        else resolve(types[response.selectedIndex]);
      },
    );
  });
}

function enterWorkspaceRoot(dirName: string): string {
  const curPath = path.resolve(".");
  if (curPath.includes(dirName)) {
    return path.join(curPath.split(dirName)[0], dirName);
  } else {
    const childrenDirs = fs.readdirSync(curPath);
    if (childrenDirs.includes(dirName)) return path.join(curPath, dirName);
    throw new Error("not found workspace root dir name " + dirName);
  }
}

function br() {
  term.cyan("\n");
}

function yesOrNot(prompt: string, defaultYes: boolean) {
  return new Promise<boolean>((resolve, reject) => {
    let promptSuffix: string;
    const yes = ["y", "Y"];
    const no = ["n", "N"];
    if (!defaultYes) {
      promptSuffix = "[y|No]：";
      no.push("ENTER");
    } else {
      promptSuffix = "[Yes|n]：";
      yes.push("ENTER");
    }
    br();
    term.cyan(prompt + promptSuffix);
    term.yesOrNo({ yes, no }, function (err, result) {
      if (err) reject(err);
      else {
        term(result ? "yes" : "no");
        resolve(result);
      }
    });
  });
}

async function inputDependencies() {
  const versionMap: Record<string, string> = {};
  workspaceDependencies.forEach((item) => (versionMap[item] = ""));
  const result: Dependency[] = [];
  while (true) {
    const dep = await input();
    if (!dep) break;
    result.push(dep);
  }
  return result;

  function input() {
    return new Promise<Dependency | undefined>((resolve, reject) => {
      br();
      term.cyan("请输入需要的依赖名（esc或直接按enter跳过）：");
      term.inputField(
        {
          autoComplete: async (inputString: string) => {
            const builtin = workspaceDependencies.filter((item) =>
              item.includes(inputString),
            );
            let { data } = await axios
              .get("https://www.npmjs.com/search/suggestions", {
                params: { q: inputString },
              })
              .catch(() => ({ data: [] }));
            if (data instanceof Array) {
              data.forEach((item) => (versionMap[item.name] = item.version));
              data = data.map((item: any) => item.name);
            } else {
              data = [];
            }
            return [...builtin, ...data];
          },
          cancelable: true,
        },
        async function (err, res) {
          if (err) reject(err);
          else if (!res) resolve(undefined);
          else {
            if (res in versionMap)
              resolve({ name: res, version: versionMap[res] });
            else {
              const { data } = await axios.get("/" + res + "/latest");
              if (data?.version) {
                resolve({
                  name: res,
                  version: data.version,
                });
              } else {
                term.red(`找不到${res}的信息\n`);
                input().then(resolve).catch(reject);
              }
            }
          }
        },
      );
    });
  }
}

function getNpmRegistry() {
  const contents = fs
    .readFileSync(path.resolve(workspaceRoot, ".npmrc"), "utf8")
    .split("\n");
  return contents[0].split("=")[1].trim();
}

interface Dependency {
  name: string;
  version: string;
}
