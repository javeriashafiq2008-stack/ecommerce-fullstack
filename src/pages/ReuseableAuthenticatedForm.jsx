import ReactDatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

// Set this to false once your backend is ready — that's the ONLY line you need to change.
// While true, no real API/Redux call happens; it just fakes a successful register/login
// after a short delay and saves the user in localStorage so the rest of the app
// (e.g. "logged in" UI) still has something to read.
const DUMMY_MODE = true;

function ReuseableAuthenticationForm({
  fields = [{ name: "abc", type: "text", placeholder: "Backup Field" }],
  handler,
}) {
  
  const [serverError, setServerError] = useState("");

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");

    // ---- DUMMY MODE: no backend yet, fake a successful response ----
    if (DUMMY_MODE) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800)); // pretend it's a network call

        if (handler === "register") {
          const dummyUser = { name: data.name, email: data.email, role: "user" };
          localStorage.setItem("dummyUser", JSON.stringify(dummyUser));
          navigate("/");
        } else if (handler === "login") {
          const saved = localStorage.getItem("dummyUser");
          if (!saved) {
            // No "registered" dummy user yet — simulate a login failure
            throw new Error("User not registered or incorrect credentials");
          }
          navigate("/");
        }
      } catch (error) {
        if (handler === "login") {
          setError("email", {
            type: "manual",
            message: "User not registered or incorrect credentials",
          });
        }
        setServerError(error?.message || "Something went wrong");
      }
      return;
    }
    // ---- END DUMMY MODE ----

    try {

      if (handler === "register") {

        await dispatch(userRegister({ name: data.name, email: data.email, password: data.password, role: "user" })).unwrap();
        await dispatch(userLogin({ email: data.email, password: data.password })).unwrap();
        navigate("/");

      } else if (handler === "login") {
        await dispatch(userLogin({ email: data.email, password: data.password })).unwrap();
        navigate("/");
      }
    } catch (error) {
      if (handler === "login") {
        setError("email", {
          type: "manual",
          message: "User not registered or incorrect credentials",
        });
      }
      setServerError(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f5f0ea] font-[Poppins]">

      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-[#0f3d2e] mb-1">
          {handler === "register" ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          {handler === "register"
            ? "Sign up to read interesting topics"
            : "Log in to continue your journey"}
        </p>

        {/* Server error */}
        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {fields.map((eachField) => (
            <Controller
              key={eachField.name}
              control={control}
              name={eachField.name}
              rules={{
                required: `${eachField.placeholder} is required`,
                ...(eachField.name === "password" && {
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Min 8 chars with uppercase, lowercase, number & special character",
                  },
                }),
                ...(eachField.name === "confirmPassword" && {
                  validate: (value) => value === password || "Passwords do not match",
                }),
              }}
              render={({ field: { onChange, onBlur, value } }) =>
                eachField.type === "date" ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-600">
                      {eachField.placeholder}
                    </span>
                    <ReactDatePicker
                      onChange={onChange}
                      onBlur={onBlur}
                      selected={value}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0f3d2e]/40 focus:border-[#0f3d2e]"
                    />
                    {errors[eachField.name] && (
                      <span className="text-red-600 text-xs">
                        {errors[eachField.name].message}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      {eachField.placeholder}
                    </label>
                    <input
                      type={eachField.type}
                      value={value || ""}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder={eachField.placeholder}
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                        errors[eachField.name]
                          ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                          : "border-gray-300 focus:ring-[#0f3d2e]/30 focus:border-[#0f3d2e]"
                      }`}
                    />
                    {errors[eachField.name] && (
                      <span className="text-red-600 text-xs">
                        {errors[eachField.name]?.message}
                      </span>
                    )}
                  </div>
                )
              }
            />
          ))}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full py-3.5 rounded-full font-bold text-sm text-white bg-[#0f3d2e] hover:bg-[#154d3b] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Please wait..." : handler === "register" ? "Create Account" : "Log In"}
          </button>

        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {handler === "register" ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => navigate(handler === "register" ? "/login" : "/register")}
            className="text-[#0f3d2e] font-bold cursor-pointer hover:underline"
          >
            {handler === "register" ? "Log In" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default ReuseableAuthenticationForm;