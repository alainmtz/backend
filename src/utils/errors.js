class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.type = 'validation';
    this.details = details;
  }
}

class AuthError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'AuthError';
    this.type = 'auth';
    this.details = details;
  }
}

class NotFoundError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'NotFoundError';
    this.type = 'not_found';
    this.details = details;
  }
}

class InternalError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'InternalError';
    this.type = 'internal';
    this.details = details;
  }
}

module.exports = { ValidationError, AuthError, NotFoundError, InternalError };
