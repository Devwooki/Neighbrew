/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CUSTOM_ENV_VARIABLE: string;
}

interface ImportMeta {
  env: {
    VITE_BASE_URL?: string;
    VITE_API_KEY?: string;
  };
}
