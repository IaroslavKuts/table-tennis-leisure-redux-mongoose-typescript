import React from "react";
import { useForm } from "react-hook-form";

import LogIni from "../../data/LogIni.jpg";
import { useSignUpMutation } from "./authorizationApiSlice";
//Component that gives an option to registrate regular user
const SignUp = () => {
  //form hook
  const [signUp] = useSignUpMutation();
  const {
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      surname: "",
      passport: "",
      password: "",
      confirmPassword: "",
      email: "",
      gender: "male",
      date_of_birth: "",
    },
  });

  const checkPassword = () => {};
  const onSubmit = async (data) => {
    try {
      await signUp(data).unwrap();
    } catch (err) {
      console.log(err.data);
      setError(err.data.field, {
        message: err.data.message,
      });
    }
  };

  {
    /**for calendar date value */
  }
  const endDate = (args) => {
    args.isDisabled = true;
  };

  return (
    <div className="relative w-full h-screen bg-zinc-900/90">
      <img
        className="absolute w-full h-full object-cover mix-blend-overlay"
        src={LogIni}
        alt="/"
      />

      <div className="flex flex-col justify-center items-center h-full opacity-100 ">
        <form
          className="flex flex-col max-w-[500px] w-full mx-auto bg-white p-8 rounded-3xl max-h-screen"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="mb-2  text-center bg-white">
            <b className=" text-center text-2xl uppercase">Sign Up</b>
          </h1>
          <div className="grid gap-6 mb-6  lg:grid-cols-2 ">
            <div>
              <input
                className="mb-2  border relative border-gray-300 rounded-lg bg-gray-200 p-2 "
                name="first_name"
                type="text"
                placeholder="Name"
                {...register("first_name", {
                  required: "*first name is required",
                })}
              />
              {errors?.first_name?.message}
            </div>
            <div>
              <input
                className=" mb-2  border relative border-gray-300 rounded-lg bg-gray-200 p-2"
                name="surname"
                type="text"
                placeholder="Surname"
                {...register("surname", { required: "surname is required" })}
              />
              {errors?.surname?.message}
            </div>

            <div>
              <input
                className=" mb-2  border relative border-gray-300 rounded-lg bg-gray-200 p-2"
                name="passport"
                type="text"
                placeholder="Passport id"
                {...register("passport", {
                  required: "Passport is required",
                  pattern: {
                    value: /^[0-9]{9}$/,
                    message: "9 digits",
                  },
                })}
              />
              {errors.passport?.message}
            </div>
            <div>
              <input
                className=" mb-2  border relative border-gray-300 rounded-lg bg-gray-200 p-2"
                name="email"
                type="text"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email?.message}
            </div>
            <div>
              <input
                className=" mb-2  border relative border-gray-300 rounded-lg bg-gray-200 p-2"
                name="password"
                type="password"
                placeholder="Password"
                // value={register.password}
                // onChange={(e) => {
                //   setValue("password", e.target.value);
                // }}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password?.message}
            </div>
            {/* <div>
              <input
                className=" mb-2  border relative border-gray-300 rounded-lg bg-gray-200 p-2"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => checkPassword(e)}
                {...register("confirmPassword", { required: true })}
              />
              {errors.password?.type === "required" && (
                <p className="text-black z-10">*confirm password is required</p>
              )}
            </div> */}
          </div>

          <div className="flex flex-col w-64">
            <select
              className="mb-6  border relative border-gray-300 rounded-lg bg-gray-200 p-2 appearance-none"
              name="gender"
              value="male"
              {...register("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              type="date"
              className="mb-2  border relative border-gray-300 rounded-lg bg-gray-200 p-2"
              name="date_of_birth"
              {...register("date_of_birth", { required: "Pick a date" })}
            />
            {errors.date_of_birth?.message}
          </div>

          <button
            className="w-full py-3 mt-8  rounded-full bg-indigo-600  hover:bg-indigo-500 relative text-white opacity-80 "
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
