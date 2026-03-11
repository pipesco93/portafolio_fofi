import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                projects: resolve(__dirname, 'projects.html'),
                projectDetail: resolve(__dirname, 'project-detail.html'),
                rates: resolve(__dirname, 'rates.html'),
                notFound: resolve(__dirname, '404.html'),
            }
        }
    }
});
