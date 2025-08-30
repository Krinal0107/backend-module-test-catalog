import mongoose from 'mongoose';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ ok: false, message: 'Invalid id format' });
  }
  const code = err.status || 500;
  if (code >= 500) console.error(err);
  res.status(code).json({ ok: false, message: err.message || 'Internal Server Error' });
}


