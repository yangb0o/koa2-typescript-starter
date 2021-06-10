import * as glob from 'glob';
import path from 'path';
import { JSONSchemaType } from 'ajv';
import { ParameterizedContext, Next as N } from 'koa';
import Router from 'koa-router';
import validator from '../middlewares/validator';

const router = new Router();

export type Ctx = ParameterizedContext<any, Router.IRouterParamContext<any, {}>>;
export type Next = N;

export const getReqParams = <T>(ctx: Ctx, schema: JSONSchemaType<T>) => {
  let ret: T = {} as T;

  switch (ctx.request.method) {
    case 'GET':
      for (const property in schema.properties) {
        (ret as any)[property] = (ctx.request.query as any)[property];
      }
      break;
    case 'POST':
      for (const property in schema.properties) {
        (ret as any)[property] = (ctx.request.body as any)[property];
      }
      break;
  }

  return ret;
};

export const delay = async (ms: number) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(0);
  }, ms);
});

export const Request = (method: string, url: string) => (target: any) => {
  const action = target.action;
  const SCHEMA = target.SCHEMA;
  if (SCHEMA) {
    (router as any)[method.toLowerCase()](url, validator<any>(SCHEMA), async (ctx: any, next: any) => {
      await action(ctx, next);
    });
  } else {
    (router as any)[method.toLowerCase()](url, async (ctx: Ctx, next: N) => {
      await action(ctx, next);
    });
  }
};

export const loadRouter = (folder: string): Router  => {
    const extname = '.{js,ts}';
    glob.sync(path.join(folder, `./**/*${extname}`)).forEach((item) => import(item));
    return router;
};
