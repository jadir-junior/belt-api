import { NextFunction, Request, Response } from 'express';

import { PermissionFlags } from '../enums/common.permissionflags.enum';

class PermissionValidationMiddeware {
    async onlySameUserOrAdminCanDoThisActions(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
        if (
            req.params &&
            req.params.userId &&
            req.params.userId === res.locals.jwt._id
        ) {
            return next();
        } else {
            if (userPermissionFlags & PermissionFlags.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send();
            }
        }
    }
}

export default new PermissionValidationMiddeware();
