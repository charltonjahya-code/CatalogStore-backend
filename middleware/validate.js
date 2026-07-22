function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // invalid → respond 400 with the errors
      return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
    }
    // valid → proceed
    req.body = result.data;   // use the cleaned/parsed data
    next();
  };
}

module.exports = validate;