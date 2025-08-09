import { Express } from 'express';
import compression from 'compression';

export default (app: Express) => {
  app.use(
    compression({
      level: 10,
      threshold: '30kb',
    }),
  );
};
