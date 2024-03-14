# Dub h5 Project

## Development

- Install dependencies

  ```
  npm ci
  ```

- Start the service

  ```
  npm run serve
  ```

- Build the development/stage environment

  ```
  npm run build:dev
  ```

- Build the prod environment

  ```
  npm run build:prod
  ```

## Webpack configs

- babel, babel-loader
- eslint
- css-loader
- less-loader
- postcss-loader
- style-loader
- css minimize
- svgo minimize the svg
- .env
- cdn
- auto inject vconsole for debug not for prod environment
- auto inject sentry to report error (upload sourcemap when build the prod environment)


## Common Components

|Name|Desc|Path|Usage|
|:---:|---|---|---|
|CommonBtn|Common button component|@/components/CommonBtn|
|ConfirmDialog|Common dialog component|@/components/ConfirmDialog|
|Loading|Common loading component|@/components/Loading|showLoading() hideLoading()|
|Toast|Common toast component|@/components/Toast|showToast()|
