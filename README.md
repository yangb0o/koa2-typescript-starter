# koa2-typescript-starter
koa2 + typescript脚手架

目前有两个简单的中间件
- cors跨域
- 参数校验（基于ajv）

同时对路由生成进行了封装，使用装饰器进行路由声明
```typescript
@Request('GET', '/test')
class Controller {
  static async action(ctx: Ctx, next: Next) {
    ctx.body = {
      code: 20000,
      msg: 'ok',
    };
  }
}
```