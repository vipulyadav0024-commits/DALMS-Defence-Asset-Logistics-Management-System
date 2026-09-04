import Joi from "joi";

export const validateCreateEmployee = (req, res, next) => {
    const schema = Joi.object({
        employeeId: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        department: Joi.string().required(),
        designation: Joi.string().required(),
        phoneNumber: Joi.string().optional(),
        status: Joi.string()
            .valid("Active", "Inactive")
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
