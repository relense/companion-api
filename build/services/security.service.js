import { Errors } from "../utils/errors.js";
function assertAdminContext(context) {
    if (context.type === "ADMIN") {
        return context;
    }
    else {
        throw Errors.forbidden();
    }
}
function assertClientContext(context) {
    if (context.type === "CLIENT") {
        return context;
    }
    else {
        throw Errors.forbidden();
    }
}
const securityService = {
    assertAdminContext,
    assertClientContext,
};
export { securityService };
