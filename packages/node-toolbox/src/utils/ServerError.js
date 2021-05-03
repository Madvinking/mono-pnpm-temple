global.ServerError = class ServerError extends Error {
  constructor({ message, statusCode = 500, status, err = null, error = null, logIdentifier = null, ...meta } = {}) {
    super(message || err.message || error.message);
    this.statusCode = statusCode || status;
    this.meta = meta;
    this.logIdentifier = logIdentifier;

    const realError = err || error;

    if (realError) {
      if (realError.originalMessage) {
        this.originalMessage = realError.originalMessage;
      } else {
        this.originalMessage = realError.message;
      }

      this.stack = realError.stack;
    } else Error.captureStackTrace(this, ServerError);
  }
};
