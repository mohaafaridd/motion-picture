const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const hbs = require('hbs');
const { connectDB } = require('./db/mongoose');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const mediaRouter = require('./routes/media');
const listsRouter = require('./routes/lists');

const app = express();
connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const partialsPath = path.join(__dirname, 'views', 'partials');
hbs.registerPartials(partialsPath);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/owlcarousel', express.static(path.join(__dirname, 'node_modules', 'owl.carousel', 'dist')));
app.use('/owlcarousel', express.static(path.join(__dirname, 'node_modules', 'owl.carousel', 'dist', 'assets')));



app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/media', mediaRouter);
app.use('/lists', listsRouter);

app.get('*', (req, res) => {
  res.render('404');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
