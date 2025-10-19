# Program Integration Project 01
The project is built using React, TypeScript, and Vite. Follow the instructions below to set up and run the project locally using Node.js, Yarn, and Vite.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Prerequisites

Before you can run the application, make sure you have the following tools installed:

1. **Node.js**: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
2. **Yarn**: This project uses Yarn as the package manager. Install it from [here](https://yarnpkg.com/).

## Setting Up the Project

1. **Clone the Repository**:
  Clone the repository to your local machine.

  ```bash
  git clone https://github.com/integration-project-hk241/url-shortener-fe
  cd url-shortener-fe
  ```

2. **Install Dependencies**:
  Install the project dependencies using Yarn.

  ```bash
  yarn
  ```

3. **Start the Development Server**:
  Start the Vite development server.

  ```bash
  yarn dev
  ```

  The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
   // other options...
   parserOptions: {
    project: ['./tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: import.meta.dirname,
   },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
   // Add the react plugin
   react,
  },
  rules: {
   // other rules...
   // Enable its recommended rules
   ...react.configs.recommended.rules,
   ...react.configs['jsx-runtime'].rules,
  },
})
```
## Building for Production

To build the application for production, run:

```bash
yarn build
```

The production-ready files will be in the `dist` directory.

## Running Tests

To run the tests, use:

```bash
yarn test
```

## Additional Scripts

The project includes several npm scripts for common tasks:

- `dev`: Starts the Vite development server.
- `build`: Builds the application for production.
- `lint`: Runs ESLint on the `src` directory.
- `test`: Runs the test suite using Vitest.
- `preview`: Previews the production build.
- `prepare`: Sets up Husky for Git hooks.
- `check-types`: Checks TypeScript types without emitting files.

This will execute the test suite and provide the results.


## Notes

- **Vite Configuration**: The `vite.config.js` file contains the configuration for Vite.
- **TypeScript Configuration**: The `tsconfig.json` file contains the TypeScript configuration.

---

This README provides a comprehensive guide to set up and run the React + TypeScript + Vite project, ensuring a smooth development experience.
