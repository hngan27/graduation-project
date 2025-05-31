import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import session from 'express-session';
import flash from 'express-flash';
import MySQLSession, { Options } from 'express-mysql-session';
import * as expressSession from 'express-session';
import { sessionMiddleware } from './middleware/auth.middleware';
import { User } from './entity/user.entity';
import * as EnumType from './enums';
import { THREE_HOURS } from './constants';
import passport from 'passport';
import './config/passport';

import indexRouter from './routes/index';
import { countUnreadMessages } from './services/chat.service';

import * as dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import { exec } from 'child_process';

// chạy lúc 2:00 sáng mỗi ngày
cron.schedule('0 2 * * *', () => {
  console.log('[cron] Starting recommendation pipeline…');
  exec(
    // hoặc 'npm run recommend-all' nếu bạn đã gom các bước vào 1 script
    'npm run export_feedback && npm run export_courses && py scripts/train_cf.py && py scripts/train_cb.py && py scripts/generate_recs.py',
    { cwd: __dirname + '/../' }, // đảm bảo path đúng đến root project
    (err, stdout, stderr) => {
      if (err) {
        console.error('[cron][error]', err);
      } else {
        console.log('[cron][stdout]\n', stdout);
        if (stderr) console.error('[cron][stderr]\n', stderr);
      }
    }
  );
});

declare module 'express-session' {
  interface SessionData {
    user?: User;
    selectedAnswers?: Record<string, string>;
  }
}

// establish database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err: Error | unknown) => {
    console.error('Error during Data Source initialization:', err);
  });

// i18n
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    preload: ['en', 'vi'],
    saveMissing: true,
    ns: [
      'lesson',
      'user',
      'common',
      'exam',
      'course',
      'title',
      'error',
      'auth',
      'admin',
    ],
    defaultNS: [
      'lesson',
      'user',
      'common',
      'exam',
      'course',
      'title',
      'error',
      'auth',
      'admin',
    ],
    backend: {
      loadPath: path.join(__dirname, './locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.missing.json'),
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'lng',
      ignoreCase: true,
      cookieSecure: false,
    },
  });

// create and setup express app
const app = express();

// i18next middleware
app.use(
  middleware.handle(i18next, {
    ignoreRoutes: [],
    removeLngFromUrl: false,
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.t = req.t;
  res.locals.language = req.language;
  res.locals.UserRole = EnumType.UserRole;
  res.locals.EnrollStatus = EnumType.EnrollStatus;
  res.locals.CourseLevel = EnumType.CourseLevel;
  res.locals.CourseStatus = EnumType.CourseStatus;
  res.locals.AssignmentStatus = EnumType.AssignmentStatus;
  res.locals.Specialization = EnumType.Specialization;
  next();
});

// Cấu hình Passport
app.use(passport.initialize());

const MySQLStore = MySQLSession(expressSession);

const options: Options = {
  connectionLimit: parseInt(process.env.CONNECTION_LIMIT || '10'),
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  createDatabaseTable: true,
};

const sessionStore = new MySQLStore(options);

// Cấu hình session trong Express
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'abcxyz',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: false, // Đặt thành true nếu sử dụng HTTPS
      maxAge: THREE_HOURS, // 3h
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

//thêm middleware cho việc quản lý sessions
app.use(sessionMiddleware);

// Middleware to inject unread message count into locals
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    try {
      res.locals.unreadCount = await countUnreadMessages(req.session.user.id);
    } catch {
      res.locals.unreadCount = 0;
    }
  } else {
    res.locals.unreadCount = 0;
  }
  next();
});

// Cấu hình flash messages
app.use(flash());

// Đặt middleware để sử dụng flash messages
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success');
  res.locals.error_message = req.flash('error');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
