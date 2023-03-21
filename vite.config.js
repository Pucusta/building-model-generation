import glsl from 'vite-plugin-glsl';

export default {

    build: {
        outDir: 'dist',
    },

    server: {
        port: 3000,
    },

    plugins: [glsl()],
};