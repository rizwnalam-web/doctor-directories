/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly VITE_API_URL: string
        readonly VITE_API_TIMEOUT: string
        readonly VITE_ENV: 'development' | 'production'
        readonly VITE_APP_NAME: string
        readonly VITE_API_BASE_PATH: string
        readonly VITE_AUTH_PATH: string
        readonly VITE_DOCTORS_PATH: string
        readonly VITE_PATIENTS_PATH: string
    }
}

declare module '*.svg' {
    import * as React from 'react'
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    export default ReactComponent
}

declare module '*.png' {
    const content: string
    export default content
}

declare module '*.jpg' {
    const content: string
    export default content
}