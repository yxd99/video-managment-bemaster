export type ClassValidatorError = {
  response: {
    message: string[];
    error: string;
    statusCode: number;
  };
};
