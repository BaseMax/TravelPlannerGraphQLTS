import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const GerCurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === "http") {
      return context.switchToHttp().getRequest().user.sub;
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user.sub;
  }
);
