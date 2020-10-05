import 'reflect-metadata';
import 'dotenv/config';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';

import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(rateLimiter);
app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
      });
    }

    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  },
);

app.listen(3333, () => console.log('🚀 Server is running'));
