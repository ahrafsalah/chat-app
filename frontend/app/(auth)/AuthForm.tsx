"use client";
import AuthImagePattern from "@/components/AuthImagePattern";
import { useAuth  } from "@/hooks/useAuth";
import { Eye, EyeOff, Lock, Mail, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {  useEffect } from "react";
import { useForm } from "react-hook-form";

const AuthForm = ({ isSignIn }: { isSignIn: boolean }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
const {isLoggedIn, signin, signup} = useAuth()

useEffect(() => {
  if(isLoggedIn){
    router.push("/")
  }
}, [isLoggedIn])

  const {
    register,
    handleSubmit,
    formState: { errors,isLoading },
    
  } = useForm({ defaultValues: { email: "", password: "", fullName: "" } });
  const onSubmit =async (data: any) => {
    if (isSignIn) {
          signin(data)
    } else {
       signup(data)
    }
  };
  return (
    <div
      className="
        container grid
        min-h-screen
        lg:grid-cols-2
      "
    >
      <div
        className="
          flex flex-col
          p-6
          justify-center items-center
          sm:p-12
        "
      >
        <div
          className="
            w-full max-w-md
            space-y-8
          "
        >
          <div
            className="
              flex flex-col
              gap-2 items-center
            "
          >
            <div
              className="
                flex
                w-12 h-12
                bg-primary/10
                rounded-xl
                transition-colors
                items-center justify-center group-hover:bg-primary/20
              "
            >
              <MessageSquare
                className="
                  w-6 h-6
                  text-primary
                "
              />
            </div>
            <h1
              className="
                mt-2
                text-2xl font-bold
              "
            >
              Welcome Back
            </h1>
            <p
              className="
                text-base-content/60
              "
            >
              Sign in to your account
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="
                flex flex-col
                gap-6
              "
            >
              {!isSignIn && (
                <label
                  className="
                    flex flex-col
                    gap-2
                  "
                >
                  {" "}
                  Full Name{" "}
                  <div className="flex p-2 rounded-md border items-center gap-2">
                    {" "}
                    <User />
                    <input
                      type="text"
                      placeholder="Ashraf Salah"
                      {...register("fullName", {
                        required: "Full name is required",
                        
                      })}
                      className="w-full text-gray-200"
                    />
                  </div>
                  {errors.fullName && (
                    <p
                      className="
                        text-red-500 text-xs
                      "
                    >
                      {errors.fullName.message}
                    </p>
                  )}
                </label>
              )}
              <label
                className="
                  flex flex-col
                  gap-2
                "
              >
                Email{" "}
                <div
                  className="
                    flex
                    p-2
                    rounded-md border
                    items-center gap-2
                  "
                >
                  <Mail color="gray" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="
                      w-full
                      text-gray-200
                    "
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address", 
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p
                    className="
                      text-red-500 text-xs
                    "
                  >
                    {errors.email.message}
                  </p>
                )}
              </label>

              <label
                className="
                  flex flex-col
                  gap-2
                "
              >
                Password
                <div
                  className="
                    flex
                    p-2
                    rounded-md border
                    items-center gap-2
                  "
                >
                  <Lock color="gray" />
                  <div
                    className="
                      flex
                      w-full
                      text-gray-200
                      items-center justify-between
                    "
                  >
                    <input
                      type={`${showPassword ? "text" : "password"}`}
                      placeholder="Password"
                      className="
                        w-full
                      "
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />

                    {showPassword ? 
                      
                    (
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        color="gray"
                        className="
                          flex
                          justify-end
                        "
                      />
                    ):<Eye
                        color="gray"
                        onClick={() => setShowPassword(true)}
                        className="
                          flex
                          justify-end
                        "
                      />}
                  </div>
                </div>
                {errors.password && (
                  <p
                    className="
                      text-red-500 text-xs
                    "
                  >
                    {errors.password.message}
                  </p>
                )}
              </label>

              <button
                type="submit"
                className="
              btn btn-primary
              w-full

                "
                disabled={isLoading}
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </button>
            </form>
            <p
              className="
                mt-6
                text-gray-500 text-center
              "
            >
              {isSignIn
                ? "Don't have an account?"
                : " Already have an account?"}
              <Link
                href={isSignIn ? "/signup" : "/login"}
                className="
                  text-primary
                  underline
                "
              >
                {isSignIn ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title={isSignIn ? "Welcome back!" : "Join our community"}
        subtitle={
          isSignIn
            ? "Sign in to continue your conversations and catch up with your messages."
            : "Connect with friends, share moments, and stay in touch with your loved ones."
        }
      />
    </div>
  );
};

export default AuthForm;
