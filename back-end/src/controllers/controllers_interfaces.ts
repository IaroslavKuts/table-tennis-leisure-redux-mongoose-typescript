import { Types } from "mongoose";
import {
  IUser,
  IPerson,
  IOrder,
} from "../mongoose_api/mongo_models_interfaces";
export type PersonFieldToUpdate = Partial<Omit<IPerson, "gender">>;
export type RequestBodyOrQuery = {
  chosenTimePeriods?: string[];
  dateOfGame?: string;
  message?: string;
  start_date?: string;
  end_date?: string;
  passport?: string;
};
export type VerifiedUser = Partial<
  Pick<IUser, "_id" | "authorities" | "email">
>;

// export interface AggregationResult {
//   [index: string]: string | number | Record<string, string> | undefined;
// }

export type AggregationResult = Record<
  string,
  | string
  | number
  // | undefined
  | Record<string, string>
  | Record<string, string>[]
>;
// export type ExtendedAggregationResult = PrimitiveAggregationResult &
//   Record<string, Record<string, string>>;
