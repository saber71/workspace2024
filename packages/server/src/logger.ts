import chalk from "chalk";
import { Injectable } from "dependency-injection";
import * as process from "node:process";
import { CONTEXT_LABEL, MODULE_NAME } from "./constant";
import { ServerRequest } from "./request";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  day: "2-digit",
  month: "2-digit",
});

@Injectable({
  moduleName: MODULE_NAME,
  singleton: true,
  paramtypes: [CONTEXT_LABEL],
})
export class ConsoleLogger implements LoggerInterface {
  constructor(readonly contextName: string) {}

  /* 日志颜色表 */
  private readonly logLevelColorMap: Record<
    LogLevel,
    (...args: any[]) => string
  > = {
    debug: chalk.magentaBright,
    warn: chalk.yellow,
    error: chalk.red,
    verbose: chalk.cyanBright,
    fatal: chalk.bold,
    log: chalk.green,
  };

  log(level: LogLevel, message: string | Error | ServerRequest): void {
    const colorize = this.logLevelColorMap[level] ?? this.logLevelColorMap.log;
    if (message instanceof Error) message = colorize(message);
    else if (typeof message === "object")
      message = `[${message.method}] ${message.url}`;
    const output = `[${this.contextName}] ${colorize(process.pid)} - ${dateTimeFormatter.format(Date.now())} ${colorize(level.toUpperCase())} ${message}\n`;
    process.stdout.write(output);
  }
}
