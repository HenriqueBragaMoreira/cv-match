import { Hono } from "hono";
import { cors } from "hono/cors";
import { handleError, handleNotFound } from "./errors";
import { analyze, health, improve } from "./routes";

const app = new Hono();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  })
);

app.onError(handleError);
app.notFound(handleNotFound);

app.route("/", health);
app.route("/analyze", analyze);
app.route("/improve", improve);

export default app;
