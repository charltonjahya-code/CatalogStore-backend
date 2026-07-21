// The SAME thing, written out longhand:
function asyncHandler(fn) {           // ← takes your controller
  return function (req, res, next) {  // ← returns a wrapped handler
    Promise.resolve(fn(req, res, next)).catch(next); // shorthand for catch(error => next(error));
  };
}
module.exports = asyncHandler;