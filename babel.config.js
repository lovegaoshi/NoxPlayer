module.exports = function (api) {
  api.cache(true);
  // const isProd = process.env.NODE_ENV === 'production';

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
      '@babel/preset-typescript',
    ],
    overrides: [
      {
        test: /\.[jt]sx$/,
        presets: [
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
              // This ensures jsxDEV is only used strictly when in development
              development: process.env.NODE_ENV === 'development',
            },
          ],
        ],
      },
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Manually maps the blocked import directly to its physical file location
            'youtubei.js/dist/src': './node_modules/youtubei.js/dist/src',
          },
        },
      ],
      // !isProd && 'react-refresh/babel'
    ].filter(Boolean),
  };
};
