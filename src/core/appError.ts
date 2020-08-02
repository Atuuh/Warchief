import { DomainError } from "./domainError";
import { Result } from "./result";

export namespace AppError {
    export class UnexpectedError extends Result<DomainError> {
        private constructor(err: any) {
            super(false, {
                message: `An unexpected error occurred.`,
                error: err,
            });
        }

        public static create(err: any): UnexpectedError {
            return new UnexpectedError(err);
        }
    }
}
