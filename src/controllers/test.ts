import { Request, Ctx, Next } from '../utils/koaUtils';

@Request('GET', '/test')
class Controller {
  static async action(ctx: Ctx, next: Next) {
    ctx.body = {
      code: 20000,
      msg: 'ok',
    };
  }
}

export default Controller;
