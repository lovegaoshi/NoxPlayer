const path = require('path');
const fs = require('fs');
const { camelCase } = require('lodash');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBar = require('progress-bar-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

const ifDirIsNotEmpty = (dir, value) => {
  return fs.readdirSync(dir).length !== 0 ? value : undefined;
};

/**
 * @param SrcPath the folder/file name (eg 'popup') or the path relative to the 'src' dir (eg 'scripts/background.ts')
 * @param value the value to return if the folder is found
 */
const ifDirExists = (SrcPath, value) => {
  return fs.existsSync(path.join(__dirname, 'src', SrcPath))
    ? value
    : undefined;
};

module.exports = (env) => {
  const { ifProd, ifDev } = getIfUtils(env);

  /**
   * @param dirPath the path relative to src (eg 'scripts' not 'src/scripts')
   */
  const getFolders = (dirPath) => {
    return fs
      .readdirSync(path.join(__dirname, 'src', dirPath), {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  };

  /**
   * @param dirPath the path relative to src (eg 'scripts' not 'src/scripts')
   * @param entryFile the entry point (eg 'index.ts' or 'index.tsx')
   */
  const getEntries = (dirPath, entryFile = 'index.tsx') => {
    const _e = {};
    // get all folders
    const folders = getFolders(dirPath);

    folders.forEach((folderName) => {
      _e[camelCase(folderName)] = path.join(
        __dirname,
        'src',
        dirPath,
        folderName,
        entryFile,
      );
    });

    return _e;
  };

  const fileExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'eot',
    'otf',
    'svg',
    'ttf',
    'woff',
    'woff2',
    'txt',
  ];

  return {
    experiments: {
      topLevelAwait: true,
    },
    mode: ifProd('production', 'development'),
    entry: removeEmpty({
      popup: ifDirExists('popup', path.join(__dirname, 'src/popup/index.tsx')),
      options: ifDirExists('options', './src/options/index.tsx'),
      onboarding: ifDirExists('onboarding', './src/onboarding/index.tsx'),
      newtab: ifDirExists('newtab', './src/newtab/index.tsx'),
      serviceworker: ifDirExists('serviceworker/index.ts', {
        import: './src/serviceworker/index.ts',
        filename: 'serviceWorker.js',
      }),
      ...getEntries('scripts', 'index.ts'),
    }),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'js/[name].js',
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'classic' }],
                '@babel/preset-typescript',
              ],
              plugins: removeEmpty([ifDev('react-refresh/babel')]),
            },
          },
          exclude: /node_modules/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'azusa-player-mobile'),
          ],
        },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: removeEmpty([
            ifProd(MiniCssExtractPlugin.loader, 'style-loader'),
            'css-loader',
          ]),
        },
        {
          test: new RegExp(`\.(${fileExtensions.join('|')})$`),
          use: {
            loader: 'file-loader?name=[name].[ext]',
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]',
          },
        },
      ],
    },
    plugins: removeEmpty([
      new Dotenv({
        path: './.env', // Path to .env file (this is the default)
        safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
      }),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false, // don't remove index.html when using the flag watch
      }),
      ifProd(
        new MiniCssExtractPlugin({
          filename: 'css/[name].css',
        }),
      ),
      ifDirExists(
        'popup',
        new HtmlWebpackPlugin({
          filename: 'popup.html',
          template: 'src/popup/index.html',
          chunks: ['popup'],
        }),
      ),
      ifDirExists(
        'options',
        new HtmlWebpackPlugin({
          filename: 'options.html',
          template: 'src/options/index.html',
          chunks: ['options'],
        }),
      ),
      ifDirExists(
        'newtab',
        new HtmlWebpackPlugin({
          filename: 'newtab.html',
          template: 'src/newtab/index.html',
          chunks: ['newtab'],
        }),
      ),
      ifDirExists(
        'onboarding',
        new HtmlWebpackPlugin({
          filename: 'onboarding.html',
          template: 'src/onboarding/index.html',
          chunks: ['onboarding'],
        }),
      ),
      new CopyPlugin({
        patterns: removeEmpty([
          ifDirIsNotEmpty(path.join(__dirname, 'public', 'icons'), {
            from: 'public/icons',
            to: 'icons',
          }),
          {
            from: 'public/manifest.json',
            transform: (buffer) => {
              const manifestJson = JSON.parse(buffer.toString());
              return Buffer.from(JSON.stringify(manifestJson));
            },
          },
          {
            from: 'public/rules.json',
            transform: (buffer) => {
              const rulesJson = JSON.parse(buffer.toString());
              return Buffer.from(JSON.stringify(rulesJson));
            },
          },
        ]),
      }),
      ifDev(new ReactRefreshWebpackPlugin()),
      ifProd(new ProgressBar()),
      new webpack.NormalModuleReplacementPlugin(
        /react-native-track-player/,
        require.resolve('./mocks/react-native-track-player.js'),
      ),
      new webpack.NormalModuleReplacementPlugin(
        /react-native-paper/,
        require.resolve('./mocks/react-native-paper.js'),
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^react-native$/,
        require.resolve('./mocks/react-native.js'),
      ),
      new webpack.NormalModuleReplacementPlugin(
        /ytdl-core/,
        require.resolve('./mocks/libmuse.js'),
      ),
    ]),
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      alias: {
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@objects': path.resolve(__dirname, 'src/objects'),
        '@background': path.resolve(__dirname, 'src/background'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@enums': path.resolve(__dirname, 'azusa-player-mobile/src/enums'),
        '@mfsdk': path.resolve(
          __dirname,
          'azusa-player-mobile/MusicFreePlugins/dist',
        ),
        '@APM': path.resolve(__dirname, 'azusa-player-mobile/src'),
      },
      extensions: ['.tsx', '.ts', '.js', '.jsx', 'svg', 'png'],
      fallback: {
        '@env': false,
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        fs: false,
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        vm: false,
      },
    },
    devtool: ifProd(false, 'source-map'),
    devServer: {
      //   index: 'index.html', // The filename that is considered the index file.
      port: 3003,
      host: 'localhost',
      open: true, // open the browser after server had been started
      compress: true,
      // overlay: true, // show compiler errors in the browser
      static: path.join(__dirname, 'public'),
    },
  };
};
