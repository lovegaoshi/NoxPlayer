class Logger {
  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  generateMessage(message: string) {
    return `${this.namespace}: ${message}`;
  }

  debug(message: string) {
    // eslint-disable-next-line no-console
    console.debug(this.generateMessage(message));
  }

  info(message: string) {
    console.info(this.generateMessage(message));
  }

  notice(message: string) {
    console.warn(this.generateMessage(message));
  }

  warn(message: string) {
    console.warn(this.generateMessage(message));
  }

  error(message: string) {
    console.error(this.generateMessage(message));
  }
}

export const logger = new Logger('Data.js');

export default logger;
