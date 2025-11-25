const validateInput = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.validatedData = validatedData;   // pass sanitized data forward
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors,
    });
  }
};

module.exports = validateInput;
