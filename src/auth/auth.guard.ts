import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable, from, map } from "rxjs";
import { Request as ExpressRequest } from 'express';
import { PrismaService } from "src/services/prisma.service";
import { hasTimeElapsedInMinutes } from "src/utils/date-helper";
import { AuthLoggedInUserDto } from "src/models/user.model";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const http = context.switchToHttp();
        const request = http.getRequest<ExpressRequest>();
        const authorization = request.headers.authorization ?? '';
        const access_token = authorization.split(' ')[1] ?? '';

        const tokenEntryPromise = this.prisma.userLoginEntry.findFirst({
            where: { access_token: access_token },
            include: { user: true },
        });

        return from(tokenEntryPromise)
            .pipe(
                map(tokenEntry => {
                    if (!tokenEntry) {
                        throw new UnauthorizedException('Your current session is invalid or has expired!');
                    };

                    if (hasTimeElapsedInMinutes(tokenEntry.created_at, tokenEntry.expires_in)) {
                        throw new UnauthorizedException('Your current session is invalid or has expired!');
                    }

                    const user: AuthLoggedInUserDto = {
                        id: tokenEntry.user.id,
                        name: tokenEntry.user.name,
                        email: tokenEntry.user.email
                    };

                    request['user'] = user;

                    return true;
                })
            );
    }
}