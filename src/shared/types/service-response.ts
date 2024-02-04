export type ServiceResponse =
  | { message: string }
  | {
      error: string;
      status: number;
    };
