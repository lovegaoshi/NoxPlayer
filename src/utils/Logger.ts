class Logger {
  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  generateMessage(message: unknown) {
    return `${this.namespace}: ${String(message)}`;
  }

  debug(message: unknown) {
    // eslint-disable-next-line no-console
    console.debug(this.generateMessage(message));
  }

  info(message: unknown) {
    console.info(this.generateMessage(message));
  }

  log(message: unknown) {
    this.info(message);
  }

  notice(message: unknown) {
    console.warn(this.generateMessage(message));
  }

  warn(message: unknown) {
    console.warn(this.generateMessage(message));
  }

  error(message: unknown) {
    console.error(this.generateMessage(message));
  }
}

export const logger = new Logger('Data.js');

export default logger;
