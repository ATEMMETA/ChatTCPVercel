// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  return {
    ...config,
    transformer: {
      ...config.transformer,
      minifierPath: 'metro-minify-terser',
      minifierConfig: {
        keep_classnames: true,
        keep_fnames: true,
        mangle: false
      }
    },
    server: {
      ...config.server,
      enhanceMiddleware: (middleware) => {
        return (req, res, next) => {
          console.log(`[Metro] Processing request: ${req.url}`);
          return middleware(req, res, next);
        };
      }
    },
    resolver: {
      ...config.resolver,
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
      extraNodeModules: {
        '@expo/metro-runtime': path.resolve(__dirname, 'node_modules/@expo/metro-runtime')
      },
      unstable_enablePackageExports: true
    },
    maxWorkers: 2,
    resetCache: true
  };
})();
