import Joi from "joi";

export const validateCreateMaintenance = (req, res, next) => {
  const schema = Joi.object({
    assetId: Joi.string().required(),
    issue: Joi.string().required(),
    description: Joi.string().allow(""),
    reportedDate: Joi.date().required(),
    status: Joi.string()
      .valid("Pending", "In Progress", "Completed")
      .optional(),
    resolvedDate: Joi.date().allow(null),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};