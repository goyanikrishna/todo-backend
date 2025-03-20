import express, {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import path from "path";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import helmet from "helmet";
import logger from "morgan";
import cors from "cors";
import httpStatus from "http-status";
import { ValidationError } from "express-validation";
import APIError from "../utility/APIError";
import { indexRouter } from "../routes/index.route";
import { ErrorType } from "../dto/global.dto";

export default async (app: Application) => {
  app.use(logger("dev"));
  // parse json request body
  app.use((req, res, next) => {
    if (req.originalUrl === "/subscription/webhook") {
      next();
    } else {
      express.json({ limit: "50mb" })(req, res, next);
    }
  });
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress() as unknown as RequestHandler);
  app.use(methodOverride());

  // secure apps by setting various HTTP headers
  app.use(helmet());
  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());
  app.use(express.static(path.join(__dirname, "public")));
  app.set("trust proxy", 1);

  app.use("/", indexRouter);

  //if error is not an instanceOf APIError, convert it.
  app.use(
    (
      err: ErrorType | ValidationError,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      var error = err;
      if (err instanceof ValidationError) {
        const mergedErrors = Object.values(err?.details || {}).flatMap(
          (paramErrors) => paramErrors.map((error: any) => error.message)
        );

        const unifiedErrorMessage = mergedErrors.join(", ");
        error = new APIError(
          unifiedErrorMessage,
          err.statusCode || httpStatus.BAD_REQUEST,
          true
        );
      } else if (err instanceof Error && err.name != APIError.name) {
        const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
        console.log(err);
        error = new APIError(err.message, status, false);
      }
      return next(error);
    }
  );

  // catch 404 and forward to error handler aasxzzzzzzzzzzzzz
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new APIError("API not found", httpStatus.NOT_FOUND, true);
    return next(err);
  });

  // api error
  app.use(
    (dataOrError: ErrorType, z: Request, res: Response, next: NextFunction) => {
      let status: number, body: any, message: string;

      if (dataOrError.isError) {
        status = dataOrError.status;

        if (status === 500) console.log(dataOrError);
        message =
          dataOrError.isPublic && dataOrError.status != 500
            ? dataOrError.message
            : httpStatus[dataOrError.status];
        body = { status, message };
      } else {
        status = 200;
        message = "Success";
        body = { status, message, data: dataOrError };
      }

      res.status(status).json(body);
    }
  );

  return app;
};
