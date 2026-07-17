/**
 * Async response handler
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const handleAsync = (req, res, operation) => {
  return asyncHandler(async () => {
    const result = await operation();
    return result;
  });
};

module.exports = {
  asyncHandler,
  handleAsync,
};
