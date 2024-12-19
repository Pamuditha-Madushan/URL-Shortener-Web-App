import { Request, Response, NextFunction } from "express";

interface ErrorResponse extends Error {
  responseCode: number;
  success: boolean;
  errorMessage: string;
}

const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const responseCode = err.responseCode || 500;
  const success = false;
  const error = err.errorMessage || "Internal Server Error !";

  res.status(responseCode).send({
    responseCode,
    success,
    error,
  });
};

export default errorHandler;
