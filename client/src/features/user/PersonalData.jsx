import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectPerson, useUpdatePersonMutation } from "./personSlice";
import { selectUser } from "./userSlice";
import { selectAbonementById } from "./abonementSlice";
import { selectCurrentColor } from "../appSettingsSlice";

//Component that gives to an user an option to browse its personal data
//User can update its personal data
const PersonalData = () => {
  const user = useSelector(selectUser)[0];
  const person = useSelector(selectPerson)[0];
  const [updatePerson] = useUpdatePersonMutation();
  const currentColor = useSelector(selectCurrentColor);
  const { first_name, surname, passport, date_of_birth } = person;
  const { email, password, abonement, user_id } = user;
  const { name_of_abonement, price, description } = useSelector((state) =>
    selectAbonementById(state, abonement)
  );

  const [isDisabled, setIsDisabled] = useState(true);
  let navigate = useNavigate();

  const handleClick = () => {
    navigate("/UserApp/ChooseAbonement");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name,
      surname,
      passport,
      email,
      password,
      confirmPassword: "",
      date_of_birth,
    },
  });
  const onSubmit = async (data) => {
    try {
      await updatePerson({ ...data, id: user_id }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      id="contact"
      className="w-full lg:h-screen  dark:bg-secondary-dark-bg bg-white"
    >
      <div className=" m-auto px-2  w-full dark:bg-secondary-dark-bg bg-zinc-100 ">
        <div className="grid lg:grid-cols-5 gap-8 bg-zinc-100 rounded-3xl  ">
          {/* left */}
          <div className="col-span-3 w-full h-auto shadow-xl shadow-gray-400 rounded-xl lg:p-4 ">
            <div className="p-4">
              <p className="text-xl tracking-widest uppercase text-[#5651e5]">
                Person Data
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-4 w-full py-2">
                  <div className="flex flex-col">
                    <label className="uppercase text-sm py-2">Name</label>
                    <input
                      className="border-2 rounded-lg p-3 flex border-gray-300"
                      type="text"
                      name="first_name"
                      {...register("first_name", {
                        required: "First name is required",
                        disabled: isDisabled,
                      })}
                    />
                    {errors.first_name?.message}
                  </div>
                  <div className="flex flex-col">
                    <label className="uppercase text-sm py-2">Surname</label>
                    <input
                      className="border-2 rounded-lg p-3 flex border-gray-300"
                      type="text"
                      name="surname"
                      {...register("surname", {
                        required: "Surname is required",
                        disabled: isDisabled,
                      })}
                    />
                    {errors.surname?.message}
                  </div>
                </div>
                <div className="flex flex-col py-2">
                  <label className="uppercase text-sm py-2">Passport No</label>
                  <input
                    className="border-2 rounded-lg p-3 flex border-gray-300"
                    type="number"
                    name="passport"
                    disabled={isDisabled}
                    {...register("passport", {
                      required: "Passport is required",
                      pattern: {
                        value: /^[0-9]{9}$/,
                        message: "*must enter 9 digits",
                      },
                    })}
                  />
                  {errors.passport?.message}
                </div>
                <div className="flex flex-col py-2">
                  <label className="uppercase text-sm py-2">Email</label>
                  <input
                    className="border-2 rounded-lg p-3 flex border-gray-300"
                    type="email"
                    name="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "*email is invalid",
                      },
                      disabled: isDisabled,
                    })}
                  />
                  {errors.email?.message}
                </div>
                <div className="flex flex-col py-2">
                  <label className="uppercase text-sm py-2">Password</label>
                  <input
                    className="border-2 rounded-lg p-3 flex border-gray-300"
                    type="password"
                    name="password"
                    disabled={isDisabled}
                    {...register("password")}
                  />
                </div>
                <div className="flex flex-col py-2">
                  <label className="uppercase text-sm py-2">
                    Confirm password
                  </label>
                  <input
                    className="border-2 rounded-lg p-3 flex border-gray-300"
                    type="password"
                    name="confirmPassword"
                    disabled={isDisabled}
                    {...register("confirmPassword")}
                  />
                </div>
                <div className="flex flex-col py-2">
                  <label className="uppercase text-sm py-2">
                    Date of birth
                  </label>
                  <input
                    className="border-2 rounded-lg p-3 flex border-gray-300"
                    type="date"
                    name="date_of_birth"
                    {...register("date_of_birth", {
                      required: "Date of birth is required",
                      disabled: isDisabled,
                    })}
                  />
                  {errors.date_of_birth?.message}
                </div>
                <button
                  style={{ backgroundColor: currentColor }}
                  className="w-full p-4  text-gray-100 mt-4 rounded-full"
                >
                  Confirm changes
                </button>
              </form>
            </div>
          </div>

          {/* right */}
          <div className=" col-span-3 lg:col-span-2 w-full h-full shadow-xl shadow-gray-400 rounded-xl p-4 ">
            <div className="lg:p-4 h-full">
              <div>
                <button
                  style={{ backgroundColor: currentColor }}
                  className="w-full rounded-full py-4 my-4 "
                  onClick={() => setIsDisabled((prev) => !prev)}
                >
                  Update profile
                </button>
              </div>
              <div className="bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative hover:scale-105 ease-in duration-300">
                <span className="uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm">
                  {name_of_abonement}
                </span>
                <div>
                  <p className="text-6xl font-bold py-4 flex">
                    {`$${price}`}
                    <span className="text-xl text-slate-500 flex flex-col justify-end">
                      /mo
                    </span>
                  </p>
                </div>
                <div className="text-2xl">
                  <p>{description}</p>
                  <button
                    style={{ backgroundColor: currentColor }}
                    className="w-full rounded-full py-4 my-4 "
                    onClick={handleClick}
                  >
                    Choose abonement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalData;
