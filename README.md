Initialise NPM in root directory

```bash
npm init -y
```

Create directories in root directory

```bash
mkdir components
mkdir pages
mkdir public
```

In `package.json` change `"main"` to `"server.js"`.

```diff
{
-   "main": "index.js"
+   "main": "server.js"
}
```

Modify `package.json`

```diff
{
+	"engines": {
+		"node": "12"
+	}
}
```

Install dependencies

Install ExpressJs

```bash
npm i express
```

Install Firebase

```bash
npm i firebase firebase-admin firebase functions
```

Install NextJs

```bash
npm i next@9.5.4
```

Install React

```bash
npm i react@16.13.1 react-dom@16.13.1
```

Install development dependencies

```bash
npm i -D rimraf
```

Initialise `git` version control

```bash
git init
```

Add `.gitignore` file

```bash
echo node_modules/ > .gitignore
```

```git
node_modules/
firebase-debug.log
nextjs/
```

Setting up Firebase

```bash
echo > .firebaserc
echo > firebase.json
echo > firestore.rules
```

Modify `.firebaserc`

```json
{
	"projects": {
		"staging": "FIREBASE_APP_ID"
	}
}
```

Modify `firebase.json`

```json
{
	"emulators": {
		"functions": {
			"port": 5001
		},
		"firestore": {
			"port": 8080
		},
		"hosting": {
			"port": 5000
		},
		"ui": {
			"enabled": true
		}
	},
	"firestore": {
		"rules": "firestore.rules"
	},
	"functions": {
		"runtime": "nodejs12",
		"source": ".",
		"ignore": [
			"firebase.json",
			"firebase-debug.log",
			"**/.*",
			"**/node_modules/**",
			"components/**",
			"pages/**",
			"public/**",
			"firestore.rules",
			"README.md"
		]
	},
	"hosting": [
		{
			"site": "FIREBASE_APP_ID",
			"public": "public/",
			"cleanUrls": true,
			"rewrites": [
				{
					"source": "**",
					"function": "nextjs-server"
				}
			]
		}
	]
}
```

Modify `firestore.rules`

```js
rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {
        allow read: if false;
        allow write: if false;
    }
}
```

Set up NextJs Application

```bash
echo > next.config.js
```

Modify `next.config.js`

```js
module.exports = {
	distDir: "nextjs",
	env: {
		FIREBASE_PROJECT_ID: "FIREBASE_APP_ID",
	},
	experimental: {
		sprFlushToDisk: false,
	},
};
```

Setup NPM scripts

```diff
{
+	"scripts": {
+		"clean": "rimraf nextjs/",
+		"dev": "next dev",
+		"build": "next build",
+		"start": "next start",
+		"predeploy": "npm run clean && next build",
+		"deploy": "firebase deploy"
+	}
}
```

Create custom ExpressJs server

```bash
echo > server.js
```

In `server.js`

Import `firebase-admin`

```js
const admin = require("firebase-admin");
```

Import `firebase-functions`

```js
const functions = require("firebase-functions");
```

Import `next`

```js
const next = require("next");
```

Import `next.config.js`

```js
const config = require("./next.config");
```

Import `express`

```js
const express = require("express");
```

Create server with ExpressJs

```js
const expressServer = express();
```

Initialise `firebase-admin` application

```js
admin.initializeApp();
```

Check environment

```js
const dev = process.env.NODE_ENV !== "production";
```

Initialise NextJs application

```js
const app = next({
	dev,
	conf: config,
});
```

Get NextJs application's request handler

```js
const handle = app.getRequestHandler();
```

Create `firebase-functions` request handler

```js
const server = functions.https.onRequest(async (request, response) => {
	await app.prepare();
	expressServer.get("/", (req, res) => app.render(req, res, "/"));
	expressServer.get("*", (req, res) => handle(req, res));
	expressServer(request, response);
	return app;
});

exports.nextjs = { server };
```

Create NextJs front end

```bash
cd pages
echo > index.js
echo > about.js
```

Modify `index.js`

```js
import React from "react";

const Home = () => {
	return <div>Home Page</div>;
};

export default Home;
```

Modify `about.js`

```js
import React from "react";

const About = () => {
	return <div>About Page</div>;
};

export default About;
```

Converting to Typescript

Create `tsconfig.json` file in root directory.

Change `.jsx` files to `.tsx`

```tsx
import * as React from "react";

export interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
	return <div>Home Page</div>;
};

export default HomePage;
```

```tsx
import * as React from "react";

export interface HomePageProps {}

const AboutPage: React.FC<AboutPageProps> = () => {
	return <div>About Page</div>;
};

export default AboutPage;
```

Add `_app.tsx` file in `./pages` directory as root App

```tsx
import * as React from "react";

import { AppProps } from "next/app";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default App;
```

Install `typescript` and `@types/react` as development dependencies

```bash
npm i -D typescript @types/react
```
