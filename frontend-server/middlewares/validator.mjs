// see: http://brianyang.com/joi-awesome-code-validation-for-node-js-and-express/
export default function middleware(prop, schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req[prop]);
        const valid = error || null;

        if (!valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map((detail) => detail.message).join(",");
            res.status(400).json({
                error: message
            });
        }
    };
}
