import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { JwtPayload } from "../interfaces/jwt.payload";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const token = req.headers.authorization;

    if (!token) {
      throw new HttpException(
        "you must login to get this feather",
        HttpStatus.BAD_REQUEST
      );
    }

    const payload = this.validateToken(token);

    req.user = payload;

    return true;
  }

  validateToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new ForbiddenException("invalid token");
    }
  }
}
