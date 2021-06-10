import Koa from 'koa';
import session from 'koa-session';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import path, { resolve } from 'path';

import cors from './middlewares/cors';

import { SESSION_KEY, KEY_NAME } from './config/keysConfig';
import { loadRouter } from './utils/koaUtils';

const app = new Koa();
app.keys = [SESSION_KEY];

app.use(session({
  key: KEY_NAME,
  overwrite: true,
  httpOnly: true,
  signed: true,
}, app));

// error handler
onerror(app);

// middlewares
app.use(cors());
app.use(bodyparser({ enableTypes:['json', 'form', 'text'] }));
app.use(json());
app.use(logger());
app.use(require('koa-static')(path.join(__dirname, '../public')));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = (new Date() as any) - (start as any);
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
const routers = loadRouter(resolve(__dirname, './controllers'));
app.use(routers.routes()).use(routers.allowedMethods());

// error-handling b
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
