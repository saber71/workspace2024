#!/usr/bin/env node
import axios from "axios";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import terminal from "terminal-kit";

const term = terminal.terminal;

enum ProjectType {
  Packages = "packages",
  Projects = "projects",
}

const workspaceDependencies: string[] = [];
const dependencies: Dependency[] = [];
const peerDependencies: Dependency[] = [];
const devDependencies: Dependency[] = [];
const externalDependencies: string[] = [];
let isBin = false;
let isServer = false;
let binName = "";
let useVite = false;
let useVitest = false;
let useVue = false;
let useVueJsx = false;
let useDecorator = false;

const waitWriteContents: Array<{
  path: string;
  content?: string | (() => string);
  isDir?: boolean;
}> = [];

const workspaceRoot = enterWorkspaceRoot("workspace2024");
const workspacePackages: string[] = fs.readdirSync(
  path.join(workspaceRoot, "packages"),
);

const templateBinDir = path.join(workspaceRoot, "packages", "template", "bin");

const npmRegistry = getNpmRegistry();

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
    if (useVite) {
      await useVueOrNot();
      if (useVue) await useVueJsxOrNot();
      await useVitestOrNot();
    }
    await addPeerDependencies();
    await addDevDependencies();
    setupTypesAndSrc();
  }
} else {
  await useViteOrNot();
  if (useVite) {
    await useVitestOrNot();
  }
  await isServerOrNot();
  await addPeerDependencies();
  await addDevDependencies();
  setupTypesAndSrc();
}

setupTsConfig();
setupPackageJson();
outputFile();

process.exit();

async function isServerOrNot() {
  isServer = await yesOrNot("是否是server项目？", true);
  if (isServer) {
    workspaceDependencies.push(
      "server",
      "server-log-decorator",
      "server-store",
    );
    peerDependencies.push(
      { name: "server", version: "workspace:^" },
      { name: "server-log-decorator", version: "workspace:^" },
      { name: "server-store", version: "workspace:^" },
    );
    waitWriteContents.push(
      {
        path: path.resolve(projectPath, "index.ts"),
        content: () => {
          const template = fs.readFileSync(
            path.resolve(templateBinDir, "index.ts.template"),
            "utf-8",
          );
          return template.replace("$NAME$", projectName);
        },
      },
      {
        path: path.resolve(projectPath, "index.js"),
        content: () => {
          const template = fs.readFileSync(
            path.resolve(templateBinDir, "index.js.template"),
            "utf-8",
          );
          return template.replace("$NAME$", projectName);
        },
      },
    );
  }
}

function setupTypesAndSrc() {
  waitWriteContents.push(
    {
      path: path.resolve(projectPath, "src"),
      isDir: true,
    },
    {
      path: path.resolve(projectPath, "src", "index.ts"),
      content: `///<reference types="../types.d.ts"/>\n`,
    },
    {
      path: path.resolve(projectPath, "types.d.ts"),
      content: workspaceDependencies
        .map((name) => `///<reference types="${name}/types.d.ts"/>`)
        .join("\n"),
    },
  );
}

async function addPeerDependencies() {
  const result = await inputDependencies("peer");
  peerDependencies.push(
    ...result.map((item) => ({
      name: item.name,
      version: item.version ? "^" + item.version : "workspace:^",
    })),
  );
  externalDependencies.push(...peerDependencies.map((item) => item.name));
}

async function addDevDependencies() {
  const result = await inputDependencies("dev");
  devDependencies.push(
    ...result.map((item) => ({
      name: item.name,
      version: item.version ? "^" + item.version : "workspace:^",
    })),
  );
  externalDependencies.push(...devDependencies.map((item) => item.name));
}

async function addDependencies() {
  const result = await inputDependencies("");
  dependencies.push(
    ...result.map((item) => ({
      name: item.name,
      version: item.version || "workspace:*",
    })),
  );
  externalDependencies.push(...dependencies.map((item) => item.name));
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
        content: `#!/usr/bin/env node\n`,
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

async function useVitestOrNot() {
  useVitest = await yesOrNot("是否使用Vitest？", true);
  if (useVitest) {
    waitWriteContents.push({
      path: path.resolve(projectPath, "vitest.config.ts"),
      content: fs.readFileSync(
        path.resolve(templateBinDir, "vitest.config.template"),
        "utf8",
      ),
    });
  }
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

function setupPackageJson() {
  waitWriteContents.push({
    path: path.resolve(projectPath, "package.json"),
    content() {
      if (isBin) {
        const dependenciesContent = dependencies.map(
          (item) => `    "${item.name}": "${item.version}"`,
        );
        let template = fs.readFileSync(
          path.resolve(templateBinDir, "package-json.bin.template"),
          "utf8",
        );
        template = template
          .replace("$NAME$", projectName)
          .replace("$BIN_NAME$", binName);
        if (dependenciesContent.length)
          template = template.replace(
            "$SLOT$",
            `,
  "dependencies": {
${dependenciesContent.join(",\n")}
  }`,
          );
        else template = template.replace("$SLOT$", "");
        return template;
      } else {
        const peerDependenciesContent = peerDependencies.map(
          (item) => `    "${item.name}": "${item.version}"`,
        );
        let template =
          chosenType === ProjectType.Packages
            ? fs.readFileSync(
                path.resolve(templateBinDir, "package-json.package.template"),
                "utf8",
              )
            : fs.readFileSync(
                path.resolve(templateBinDir, "package-json.project.template"),
                "utf8",
              );
        template = template.replace("$NAME$", projectName);
        if (peerDependenciesContent.length)
          template = template.replace(
            "$SLOT$",
            `,
  "peerDependencies": {
${peerDependenciesContent.join(",\n")}
  }`,
          );
        else template = template.replace("$SLOT$", "");
        if (useVitest)
          template = template.replace(
            "$SCRIPT_SLOT$",
            ',\n    "test": "vitest"',
          );
        else template = template.replace("$SCRIPT_SLOT$", "");
        return template;
      }
    },
  });
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
    term.green("\nDone!\n");
  } catch (e) {
    fs.rmSync(projectPath, { recursive: true, force: true });
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

async function inputDependencies(prefix: string) {
  const versionMap: Record<string, string> = {};
  workspacePackages.forEach((item) => (versionMap[item] = ""));
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
      term.cyan(`请输入需要的${prefix}依赖名（esc或直接enter跳过）：`);
      term.inputField(
        {
          autoCompleteMenu: true,
          autoComplete: async (inputString: string) => {
            const builtin = workspacePackages.filter((item) =>
              item.includes(inputString),
            );
            let { data } = await axios
              .get("https://www.npmjs.com/search/suggestions", {
                params: { q: inputString },
              })
              .catch(() => ({ data: [] }));
            // .catch(() => ({ data: [] }));
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
            if (workspacePackages.includes(res))
              workspaceDependencies.push(res);
            if (res in versionMap)
              resolve({ name: res, version: versionMap[res] });
            else {
              const { data } = await axios.get(npmRegistry + res + "/latest");
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
