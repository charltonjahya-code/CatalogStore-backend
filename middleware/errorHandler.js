// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

// logs the error so it is easier to debug
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    error: err.isOperational ? err.message : 'Internal server error',
  });
}

module.exports = errorHandler;