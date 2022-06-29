# boilerplate-vanilla-express-webpack-babel-starter

👉 Starter with `Vanilla JS` & `Express` & `Webpack` & `Babel` for Web Server and Client dev

<br/>

## Features

✅ Express v4.16.1

✅ Webpack v4.44.2

✅ Babel (Core) v7.11.6

✅ Support syntax ES2015+

✅ Client file will be stored in `/dist` after build

✅ Static directory `dist/`

✅ Serving Static Files in `Express.js`

<br/>

## Directory Structure

```javascript

.
├── Client
│   ├── components
│   ├── index.js
│   ├── pages
│   │   └── indexPage
│   │       ├── index.css
│   │       ├── index.html
│   │       └── index.js
│   └── services
│
├── Server
│   ├── app.js
│   ├── config
│   ├── middleware
│   ├── models
│   └── routes
│       ├── api
│       └── index.js
├── README.md
├── nodemon.json
├── package-lock.json
├── package.json
├── webpack.config.dev.js
└── webpack.config.prod.js

```

<br/>

## How to build an application?

```javascript
npm run build-dev     # Development mode
npm run build-prod    # Production mode
```

<br/>

## How to develop an application?

```javascript
npm run dev     # Use webpack, express and babel with nodemon
npm run start   # Use webpack, express and babel
```

<br/>

## How to change dev/prod environment variable setting?

```javascript
/* .env file location */

# development mode => /.env.dev
# production mode => /.env.prod
```

<br/>
