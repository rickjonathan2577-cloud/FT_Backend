export const validate = (schema) => (req, res, next) => {

    const results = schema.safeParse(req.body);
   
    if(!results.success) {
        const formattedErrors = results.error.issues.map((err) => ({
            field: err.path[0] || "payload",
            message: err.message,
        }));

        return res.status(400).json({
            status: 400,
            message: 'Validation error',
            errors: formattedErrors,
        });
    }

    req.body = results.data;    
    next();
};