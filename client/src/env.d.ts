/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_TIMEOUT: string
    readonly VITE_ENV: string
    readonly VITE_APP_NAME: string
    readonly VITE_ENABLE_DEBUG_LOGGING: string
    readonly VITE_ENABLE_ERROR_REPORTING: string
    readonly VITE_AUTH_PERSISTENT: string
    readonly VITE_API_BASE_PATH: string
    readonly VITE_AUTH_PATH: string
    readonly VITE_DOCTORS_PATH: string
    readonly VITE_PATIENTS_PATH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}