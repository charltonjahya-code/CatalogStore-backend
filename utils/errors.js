// utils/errors.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);              // pass the message to the built-in Error
    this.statusCode = statusCode; // ← attach a status code to the error
    this.isOperational = true;    // marks this as an "expected" error (not a bug)
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);          // a NotFoundError is always a 404
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);          // always a 401
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);          // always a 409 (e.g. duplicate email)
  }
}

module.exports = { AppError, NotFoundError, UnauthorizedError, ConflictError };