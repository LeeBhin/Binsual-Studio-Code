/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

interface ImportMetaEnv {
  readonly VITE_FORMSUBMIT_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
