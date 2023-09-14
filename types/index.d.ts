interface Sails {
  log: LogMethod & LogObject
  helpers: Helper
  on(event: string, listener: (...args: any[]) => void): void
  off(event: string, listener: (...args: any[]) => void): void
  emit(event: string, ...args: any[]): void
  lift(cb?: (err: Error, sails: Sails) => void): Sails
  lower(cb?: (err?: Error) => void): void
  load(): Sails
  config: Config
  renderView: (
    relPathToView: string,
    _options: Dictionary,
    optionalCb?: (err: Error | null, compiledHtml: string) => void
  ) => Sails & Promise<string>
  intercept(callback: (err: Error) => Error): Sails & Promise<string>
}

interface Helper {
  mail: {
    send: {
      with: (params: EmailParams) => Promise<string>
    }
  }
}
interface EmailParams {
  mailer?: string
  to: string
  subject?: string
  template?: string
  templateData?: object
}

interface Hook {
  inertia: Inertia
}
interface LogMethod {
  (...args: any[]): void
}

interface LogObject {
  info: LogMethod
  warn: LogMethod
  error: LogMethod
  debug: LogMethod
  silly: LogMethod
  verbose: LogMethod
}

interface Config {
  mailer: string
  mail: {
    default: string
    mailers: {
      log: object
      smtp: {
        transport: 'smtp'
        host: string
        port: number
        encryption: 'tls' | 'ssl'
        username?: string
        password?: string
      }
    }
    from: {
      name: string
      address: string
    }
  }
}

declare const sails: Sails
