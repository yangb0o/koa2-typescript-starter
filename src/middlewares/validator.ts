import Ajv, { JSONSchemaType } from 'ajv';
import { Ctx, Next } from '../utils/koaUtils';


function validate<T>(schema: JSONSchemaType<T>, data: T) {
  const ajv = new Ajv({
    strict: false
  });
  const valid = ajv.validate(schema, data);

  if (!valid && ajv.errors) {
    console.log(ajv.errors);  // for debug;
    return ajv.errors;
  }
}

export default <T>(schema: JSONSchemaType<T>) => async (ctx: Ctx, next: Next) => {
  let error;

  switch (ctx.request.method) {
    case 'GET':
      error = validate<T>(schema, ctx.request.query as any);
      break;
    case 'POST':
      error = validate<T>(schema, ctx.request.body as any);
      break;
  }

  if (error) {
    ctx.status = 400;
    return;
  }

  await next();
};
