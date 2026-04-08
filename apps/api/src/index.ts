import { Hono } from "hono";
import { handleError, handleNotFound } from "./errors";
import { health } from "./routes";

const app = new Hono();

app.onError(handleError);
app.notFound(handleNotFound);

app.route("/", health);

export default app;
