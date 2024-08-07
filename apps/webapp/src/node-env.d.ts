declare namespace NodeJS {
  export interface ProcessEnv {
    API_SOCKET_URL: string;
    API_URL: string;
    APP_ENVIRONMENT: string;
    FORCE_BASE_URL?: string;
    FORCE_TENANT_SLUG?: string;
    SENTRY_DSN?: string;
    BROWSERLESS_CHROME_ENDPONT?: string;
  }
}
