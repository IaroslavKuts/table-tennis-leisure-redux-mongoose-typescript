export interface ErrorWithStatus extends Partial<Error> {
  status: number;
}
