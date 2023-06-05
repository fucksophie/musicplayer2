declare global {
    interface Window { 
        __TAURI__?: {
            invoke: (prop: string, ...args: any[]) => any;
            shell: {
                open: (url: string) => void;
            }
        }; 
    }
}

export {};