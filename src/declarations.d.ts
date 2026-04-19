declare module "*.css" {
  const content: string
  export default content
}

declare module "https://deno.land/std/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void
}

declare module "https://deno.land/x/denomailer/mod.ts" {
  export class SMTPClient {
    constructor(config: {
      connection: {
        hostname: string
        port: number
        tls?: boolean
        auth?: {
          username: string
          password: string
        }
      }
    })
    send(message: {
      from: string
      to: string
      subject: string
      html?: string
      text?: string
    }): Promise<void>
    close(): Promise<void>
  }
}