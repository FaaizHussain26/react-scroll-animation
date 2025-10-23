import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'MyScrollComponent',
      fileName: () => 'my-scroll-component.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: 'assets/[name][extname]'
      }
    },
    cssCodeSplit: false
  }
})