import cors from 'koa2-cors';

export default () => cors({
  origin: (ctx) => 
    'http://localhost:3001'
  ,
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
});
