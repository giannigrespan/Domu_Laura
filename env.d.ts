/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_GOOGLE_CALENDAR_ID: string;
  readonly VITE_GOOGLE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Declare process.env for client-side code (injected by Vite's define)
declare const process: {
  env: {
    readonly API_KEY: string;
    readonly GOOGLE_CALENDAR_ID: string;
    readonly GOOGLE_API_KEY: string;
    readonly TELEGRAM_LINK: string;
    readonly WHATSAPP_LINK: string;
    readonly FORMSPREE_ENDPOINT: string;
  };
};
