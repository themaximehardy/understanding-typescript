# Using Webpack with TypeScript

### Useful Resources & Links

- [Official Webpack Docs](https://webpack.js.org/)

### What is Webpack & Why Do You Need It

If we use the ES6 import/export module and `<script type="module" src="../dist/app.js"></script>`, we open the console, we can see a bunch of requests. Each time we import a file (another file needs)... There is an HTTP request to get the file. It can slow our app (imagine thousand of JS files = thousand of HTTP requests).

Webpack is a tool which help us to bundle our files together. Webpack is a Bundling & "Build Orchestration" Tool". It helps up to reduce the number of HTTP requests by bundling our code, all the files together. We can write code, split our code on multiple files and Webpack will bundle them in one file. Plus, it optimize our code and it can add more build steps, more build tools.

|                    "Normal" Setup                    |                     With Webpack                     |
| :--------------------------------------------------: | :--------------------------------------------------: |
|   **Multiple .ts files** & imports (HTTP requests)   |       **Code bundles**, less imports required        |
|   **Unoptimized code** (not as small as possible)    | **Optimized (minified) code**, less code to download |
| "External" development server needed (_lite-server_) |          **More build steps** can be added           |

---

### Installing Webpack & Important Dependencies

We need to install first some **dev dependencies**.

```sh
yarn add webpack webpack-cli webpack-dev-server typescript ts-loader -D
```

---

### Adding Entry & Output Configuration

Firstly, we go to our `tsconfig.json` and check the `target` – it should be `es5` or `es6` – and the `"module": "es2015"`. We don't need `"rootDir"` anymore, because webpack will take over there and it will define what your `rootDir` will be.

Then we need to create a `webpack.config.js` file. We need to configure Webpack to be sure it works correctly.

> Note: we had to remove all the `.js` extension in our import.

```js
const path = require('path');

module.exports = {
  entry: './src/app.ts', // what is the entry file
  output: {
    filename: 'bundle.js', // what is the name you want to give to the output file
    path: path.resolve(__dirname, 'dist'), // what is the ABSOLUTE path of your output file
  },
};
```

---

### Adding TypeScript Support with the ts-loader Package

`webpack.config.js`

```js
const path = require('path');

module.exports = {
  entry: './src/app.ts', // what is the entry file
  output: {
    filename: 'bundle.js', // what is the name you want to give to the output file
    path: path.resolve(__dirname, 'dist'), // what is the ABSOLUTE path of your output file
  },
  devtool: 'inline-source-map', // in tsconfig.json file, we have "sourceMap": true
  module: {
    // how to manage all the files
    rules: [
      // 1 rule per file type
      {
        test: /\.ts$/, // regex to match all the ts files
        use: 'ts-loader', // we use the ts-loader
        exclude: /node_modules/, // WE EXCLUDE node_modules
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // bundle all the ts and js files
  },
};
```

Then we need to add in `package.json`:

```json
"scripts": {
  "build": "webpack"
},
```

---

### Finishing the Setup & Adding webpack-dev-server

We need to add a `script` in `package.json`:

```json
"scripts": {
  "start": "webpack-dev-server",
  "build": "webpack"
},
```

Then we can add information to the `webpack.config.js` (the `publicPath`) and `devServer`.

```js
mode: 'development',
//...
output: {
  filename: 'bundle.js', // what is the name you want to give to the output file
  path: path.resolve(__dirname, 'dist'), // what is the ABSOLUTE path of your output file
  publicPath: 'dist', // important for the webpack-dev-server to understand where the output is written and where this is relative to the index HTML file
},
//...
devServer: {
  compress: true,
  port: 9000,
},
```

---

### Adding a Production Workflow

```sh
yarn add clean-webpack-plugin -D
```

`package.json`

```json
"scripts": {
  "start": "webpack-dev-server",
  "build": "webpack --config webpack.config.prod.js"
},
```

`webpack.config.prod.js`

```js
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
```
