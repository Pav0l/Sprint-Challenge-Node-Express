function errorHandler(err, req, res, next) {
  const { status, message } = err;
  res.status(status).json({ message });
}

module.exports = errorHandler;