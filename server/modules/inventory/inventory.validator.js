import Joi from "joi";

export const validateCreateInventory = (req, res, next) => {
  const schema = Joi.object({
    assetId: Joi.string().required(),
    employeeId: Joi.string().required(),
    assignedDate: Joi.date().required(),
    returnDate: Joi.date().allow(null),
    status: Joi.string()
      .valid("Assigned", "Returned")
      .optional(),
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