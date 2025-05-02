const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandler;