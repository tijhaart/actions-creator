# Node Starter

Create Node apps with zero initial configuration. `node-starter` is built using [Neutrino](https://github.com/mozilla-neutrino/neutrino-dev) to harness the power of Webpack with the simplicity of [presets](https://neutrino.js.org/presets/). 
 
## Features

- Zero upfront configuration necessary to start developing and building a Node.js project
- Extends from [neutrino-preset-node](https://neutrino.js.org/presets/neutrino-preset-node/)
  - Modern Babel compilation supporting ES modules, Node.js 6.9+, and async functions
  - Auto-wired sourcemaps
  - Chunking of external dependencies apart from application code
  - Easily extensible to customize your project as needed
- Extends from [neutrino-preset-airbnb-base](https://neutrino.js.org/presets/neutrino-preset-airbnb-base/)
  - Zero upfront configuration necessary to start linting your project
  - Modern Babel knowledge supporting ES modules, JSX, Web and Node.js apps
  - Highly visible during development, fails compilation when building for production
  - Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client

## Installation

To get you started fork and clone the `node-starter` repository and install the dependencies using Yarn or the npm client.

```bash
❯ cd node-starter/
❯ yarn
```

## Quick start

Start the app with `yarn serve`, then open a browser to `http://localhost:3000`.

### Yarn

```bash
❯ yarn serve
Warning: This preset does not support watch compilation. Falling back to a one-time build.
Hash: 6d68f05af2c10be27bed
Version: webpack 2.2.1
Time: 627ms
       Asset     Size  Chunks             Chunk Names
    index.js  3.65 kB       0  [emitted]  index
index.js.map  3.48 kB       0  [emitted]  index
✨  Done in 1.35s.
Running on :3000
```

### npm

```bash
❯ npm run serve
Warning: This preset does not support watch compilation. Falling back to a one-time build.
Hash: 6d68f05af2c10be27bed
Version: webpack 2.2.1
Time: 627ms
       Asset     Size  Chunks             Chunk Names
    index.js  3.65 kB       0  [emitted]  index
index.js.map  3.48 kB       0  [emitted]  index
✨  Done in 1.35s.
Running on :3000
```

**Important Note:** At the time of writing, Neutrino's Node preset does not support `watch` compilation; it will instead fall back to running a build with the `NODE_ENV` environment variable set to `development`.

## Building

`node-starter` builds static assets to the `build` directory by default when running `yarn build`.

```bash
❯ yarn build
clean-webpack-plugin: /Users/hassanali/Documents/Mozilla/projects/node-starter/build has been removed.
Build completed in 0.653s

Hash: 6d68f05af2c10be27bed
Version: webpack 2.2.1
Time: 656ms
       Asset     Size  Chunks             Chunk Names
    index.js  3.65 kB       0  [emitted]  index
index.js.map  3.48 kB       0  [emitted]  index
✨  Done in 1.39s.
```

## Running Tests

In order to keep this starter kit minimalist, `node-starter` has no test runner configured, however adding one is incredible easy with Neutrino. Refer to the [relevant section on building and running tests](https://neutrino.js.org/usage.html#building-and-running-tests). 

## Customizing

To override the build configuration, start with the documentation on [customization](/customization/README.md). `neutrino-preset-node` creates some conventions to make overriding the configuration easier once you are ready to make changes.

By default the Node.js preset creates a single **main** `index` entry point to your application, and this maps to the `index.js` file in the `src` directory. This means that the Node.js preset is optimized toward a main entry to your app. Code not imported in the hierarchy of the `index` entry will not be output to the bundle. To overcome this you must either define more entry points, or import the code path somewhere along the `index` hierarchy.

### Vendoring

`node-starter` uses `neutrino-preset-node`. The latter automatically vendors all external dependencies into a separate chunk based on their inclusion in your `package.json`. No extra work is required to make this work.

### Rules

Refer to the [list of rules and their identifers](https://neutrino.js.org/presets/neutrino-preset-node/#rules) which can be overridden.

### Plugins

Refer to the [list of plugins and their identifiers](https://neutrino.js.org/presets/neutrino-preset-node/#plugins) which can be overridden.

### Simple customization

By following the [customization guide](https://neutrino.js.org/customization/simple.html) and knowing the rule, loader, and plugin IDs above, you can override and augment the build directly from `package.json`.

_Example: Allow importing modules with an `.mjs` extension._

```json
{
  "config": {
    "neutrino": {
      "resolve": {
        "extensions": [
          ".mjs"
        ]
      }
    }
  }
}
```

### Advanced configuration

By following the [customization guide](/customization/advanced.md) and knowing the rule, loader, and plugin IDs above, you can override and augment the build by creating a JS module which overrides the config.

_Example: Allow importing modules with an `.mjs` extension._

```js
module.exports = neutrino => {
  neutrino.config.resolve.extensions.add('.mjs');
};
```

## Contributing

Thank you for wanting to help out with Neutrino! We are very happy that you want to contribute, and have put together the [contributing guide](https://neutrino.js.org/contributing/#contributing) to help you get started. We want to do our best to help you make successful contributions and be part of our community.