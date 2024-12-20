class BadRequestError extends Error {
  responseCode: number;
  errorMessage: string;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.responseCode = 400;
    this.errorMessage = "Bad Request Error";
  }
}

class NotFoundError extends Error {
  responseCode: number;
  errorMessage: string;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.responseCode = 404;
    this.errorMessage = "Not Found Error";
  }
}

class UnprocessableEntityError extends Error {
  responseCode: number;
  errorMessage: string;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.responseCode = 422;
    this.errorMessage = "Unprocessable Entity Error";
  }
}

export { BadRequestError, NotFoundError, UnprocessableEntityError };
