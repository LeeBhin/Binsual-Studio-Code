/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

interface ImportMetaEnv {
  readonly VITE_MAILJS_SERVICE_ID: string
  readonly VITE_MAILJS_TEMPLATE_ID: string
  readonly VITE_MAILJS_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
