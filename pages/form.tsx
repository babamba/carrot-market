import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
    username: string;
    password: string;
    email: string;
    errors?: string;
}

export default function Forms() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        // watch,
        // setValue,
        // setError,
        resetField,
    } = useForm<LoginForm>({
        mode: "onChange",
    });

    //setError("errors", { message: "Backend is offline Sorry." });
    // setValue("username", "test");

    const onValid = (data: LoginForm) => {
        console.log("im valid bby");
        // setError("username", { message: "Taken username." });
        // resetField("password");
    };

    const onInValid = (errors: FieldErrors) => {
        console.log(errors);
    };

    return (
        <form onSubmit={handleSubmit(onValid, onInValid)}>
            <input
                {...register("username", {
                    required: "Username is required",
                    minLength: {
                        message: "The username should be longer than 5 chars.",
                        value: 5,
                    },
                })}
                type="text"
                placeholder="Username"
                className={`${
                    Boolean(errors.email?.message) ? "border-x-red-400" : ""
                }`}
            />
            {errors.username?.message}
            <input
                {...register("email", {
                    required: "email is required",
                    validate: {
                        notGmail: (value) =>
                            !value.includes("@gmail.com") ||
                            "Gmail is now Allowed",
                    },
                })}
                type="email"
                placeholder="Email"
            />
            {errors.email?.message}
            <input
                {...register("password", {
                    required: "password is required",
                })}
                type="password"
                placeholder="Password"
            />
            <input type="submit" value="Create account" />
            {errors.errors?.message}
        </form>
    );
}
