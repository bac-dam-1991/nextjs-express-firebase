const admin = require("firebase-admin");
const functions = require("firebase-functions");
const next = require("next");
const config = require("./next.config");
const express = require("express");

const expressServer = express();

admin.initializeApp();

const dev = process.env.NODE_ENV !== "production";

const app = next({
	dev,
	conf: config,
});

const handle = app.getRequestHandler();

const server = functions.https.onRequest(async (request, response) => {
	await app.prepare();
	expressServer.get("/", (req, res) => app.render(req, res, "/"));
	expressServer.get("/express", (req, res) =>
		res.send("Response from Express Server.")
	);
	expressServer.get("*", (req, res) => handle(req, res));
	expressServer(request, response);
	return app;
});

exports.nextjs = { server };
