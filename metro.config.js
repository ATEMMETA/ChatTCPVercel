const { getDefaultConfig } = require('expo/metro-config');

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
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs']
    },
    maxWorkers: 2,
    resetCache: true
  };
})();
