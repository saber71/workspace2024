import chalk from "chalk";
import { Logger } from "./decorators";
import { ServerRequest } from "./request";
import type { LoggerInterface, LogLevel } from "./types";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  day: "2-digit",
  month: "2-digit",
});

@Logger()
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
    const output = `[${this.contextName}] - ${dateTimeFormatter.format(Date.now())} ${colorize(level.toUpperCase())} ${message}\n`;
    console.log(output);
  }
}
