/* index.js */

import { Application, send, Status } from "https://deno.land/x/oak@v6.5.1/mod.ts";
import { parse } from 'https://deno.land/std/flags/mod.ts'
import { Md5 } from 'https://deno.land/std@0.89.0/hash/md5.ts'
// status codes https://deno.land/std@0.82.0/http/http_status.ts
import { getEtag, setHeaders } from "./modules/util.js";
import { login } from "./modules/accounts.js";
import router from "./pageSwap.js";
import apiRouter from "./api.js";


const defaultPort = 8080
const { args } = Deno
const argPort = parse(args).port
const port = argPort ? Number(argPort) : defaultPort

const app = new Application();

// checks if file exists
async function fileExists(path) {
  try {
    const stats = await Deno.lstat(path);
    return stats && stats.isFile;
  } catch (e) {
    if (e && e instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw e;
    }
  }
}

async function staticFiles(context, next) {
	const path = `${Deno.cwd()}/static${context.request.url.pathname}`
	const isFile = await fileExists(path)
	if (isFile) {
		// file exists therefore we can serve it
		console.log(path)
		const etag = await getEtag(path)
// 		console.log(`etag: ${etag}`)
		context.response.headers.set('ETag', etag)
		await send(context, context.request.url.pathname, {
			root: `${Deno.cwd()}/static`,
		})
	} else {
		await next()
	}
}

async function errorHandler(context, next) {
  try {
    const method = context.request.method;
    const path = context.request.url.pathname;
    console.log(`${method} ${path}`);
    await next();
  } catch (err) {
    console.log(err);
    context.response.status = Status.InternalServerError;
    const msg = { err: err.message };
    context.response.body = JSON.stringify(msg, null, 2);
  }
}

app.use(staticFiles);
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(setHeaders);
app.use(errorHandler);



app.addEventListener(
  "listen",
  ({ port }) => console.log(`listening on port: ${port}`),
);

await app.listen({ port });
