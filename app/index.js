// import figlet from "figlet";
import express from "express";
import { Register } from "./register.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
// import fs from "fs";
// import https from "https";
import { connect, disconnect } from "mongoose";
import { Users } from "./schema.js";
import * as dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3005;

// Allow request from any source. In real production, this should be limited to allowed origins only
app.use(cors());
app.disable("x-powered-by"); //Reduce fingerprinting
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
(async () => {
	try {
		await connect(`${process.env.DB}`, {
			dbName: "tiguuweb",
		});
		console.log("Db connected!");
	} catch (err) {
		console.error(err);
	}
	// connect to database

	// routes
	app.get("/", (req, res) => {
		res.setHeader("Content-Type", "text/html");
		res.status(200).sendFile(path.join(__dirname, "/index.html"));
	});
	app.post("/register", async (req, res) => {
		const exisitingUser = await Users.find({ email: req.body.email });

		if (typeof exisitingUser === "object" && !isEmpty(exisitingUser))
			return res.status(400).json({
				message:
					"Registration was not successful. The issue is with the details you sent to us.",
			});
		const newUser = new Users({
			email: req.body?.email,
			password: req.body?.password,
		});
		await newUser.save();
		res.setHeader("Content-Type", "application/json");
		res.status(200).json({
			message: "You have successfully registered with " + req.body.email,
		});
	});

	// app.use("/", router);

	app.listen(port, () => {
		console.log(`Server now running on http://localhost:${port}`);
	});

	process.on("SIGINT", async () => {
		await disconnect();
		process.exit(0);
	});
})();

/**
 *
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {
	for (var x in obj) {
		return false;
	}
	return true;
}
