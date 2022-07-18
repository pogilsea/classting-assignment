import {Request} from 'express';
import {JsonWebToken, JWTForm, ROLE} from '@lib/jwt-auth';
import createHttpError from 'http-errors';
import {ErrorCode} from '@lib/http/error-code';
import {HttpStatus} from '@lib/http/status-code';

export class BaseRouteHandler {
    constructor() {}
    getBody(req: Request) {
        return req.body;
    }
    getParam(req: Request, field: string) {
        return req.params[field];
    }
    async getAuthorizedUser(req: Request) {
        const jwt = new JsonWebToken();
        const token = await jwt.decryptToken(req.token);
        this.assertTokenExpired(token.exp);
        return token;
    }
    getQuery(req: Request) {
        return req.query as any;
    }
    assertAuthorizedUserRole(token: JWTForm, roles: ROLE[]) {
        if (!roles.some((role) => role === token.role)) {
            const errorMessage = 'the request role is forbidden to access this api';
            throw createHttpError(HttpStatus.FORBIDDEN, {errorCode: ErrorCode.USER_ROLE_FORBIDDEN, errorMessage});
        }
    }
    assertTokenExpired(expiresIn: number) {
        const currentTime = new Date().getTime();
        if (currentTime > expiresIn) {
            const errorMessage = 'bearer token was expired';
            throw createHttpError(HttpStatus.UNAUTHORIZED, {errorCode: ErrorCode.TOKEN_EXPIRED, errorMessage});
        }
    }
}
