import { Types } from "mongoose";
export interface IAbonement {
  name_of_abonement: string;
  description: string;
  price: number;
}

export interface IAlteredWorkSchedule {
  date: string;
  open: string;
  close: string;
}
export interface IBasicWorkSchedule {
  day_name: string;
  day_id: number;
  open: string;
  close: string;
}
export interface IOrder {
  date_of_game: string;
  start_time: string;
  end_time: string;
  payment: number;
}
export interface IPerson {
  personID?: Types.ObjectId | string;
  first_name: string;
  surname: string;
  passport: string;
  date_of_birth: string;
  gender: string;
}
export interface ITimePeriods {
  time_period_id: number;
  start_time: string;
  end_time: string;
  price: number;
}
export interface IUser {
  _id?: Types.ObjectId | string;
  email: string;
  password: string;
  authorities: string;
  abonement: Types.ObjectId;
  person: Types.ObjectId;
  orders: Types.ObjectId[];
  theme: string;
  refreshToken: string | null;
  comparePassword(plainPass: string): Promise<boolean>;
}
