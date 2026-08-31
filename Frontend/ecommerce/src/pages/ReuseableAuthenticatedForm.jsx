import ReactDatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";
import { userRegister, userLogin, checkAuthStatus } from "../features/authentication/authenticationSlice";

// ─── FloatingField wrapper ────────────────────────────────────────────────────
function FloatingField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#0f3d2e]">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-red-500 text-[11px] flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full border rounded-lg px-4 py-2.5 text-sm bg-white text-gray-800
   placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2
   ${hasError
     ? "border-red-400 focus:ring-red-300"
     : "border-gray-200 focus:border-[#0f3d2e] focus:ring-[#0f3d2e]/20"
   }`;

// ─── Role picker cards ────────────────────────────────────────────────────────
// Two clickable cards — Buyer and Vendor.
// Receives `value` and `onChange` from Controller so it integrates
// with react-hook-form exactly like any other controlled input.
function RolePicker({ value, onChange, error }) {
  const roles = [
    {
      id: "buyer",
      label: "Buyer",
      tagline: "Shop & discover products",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      ),
    },
    {
      id: "vendor",
      label: "Vendor",
      tagline: "Sell & manage your store",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#0f3d2e]">
        I am a <span className="text-[#0f3d2e]">*</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const isSelected = value === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={`relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200 text-center group
                ${isSelected
                  ? "border-[#0f3d2e] bg-[#0f3d2e] shadow-lg shadow-[#0f3d2e]/20 scale-[1.02]"
                  : "border-gray-200 bg-white hover:border-[#0f3d2e]/40 hover:bg-[#f0f7f3] hover:scale-[1.01]"
                }`}
            >
              {/* checkmark badge when selected */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-[#0f3d2e]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}

              {/* icon */}
              <span className={`transition-colors duration-200 ${isSelected ? "text-white" : "text-[#0f3d2e]/60 group-hover:text-[#0f3d2e]"}`}>
                {role.icon}
              </span>

              {/* label */}
              <span className={`text-sm font-semibold transition-colors duration-200 ${isSelected ? "text-white" : "text-gray-800"}`}>
                {role.label}
              </span>

              {/* tagline */}
              <span className={`text-[10px] leading-tight transition-colors duration-200 ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                {role.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <span className="text-red-500 text-[11px] flex items-center gap-1 mt-0.5">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ReuseableAuthenticationForm({
  fields = [{ name: "abc", type: "text", placeholder: "Backup Field" }],
  handler,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  // ── all original logic untouched ──────────────────────────────────────────
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
    try {
      if (handler === "register") {
        await dispatch(
          userRegister({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,   // ← comes from the RolePicker card selection
          })
        ).unwrap();
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
      setServerError(typeof error === "string" ? error : "Something went wrong");
    }
  };
  // ── end original logic ────────────────────────────────────────────────────

  const handleDemoLogin = async (role) => {
    localStorage.setItem("demo_role", role);
    localStorage.setItem("demo_mode_active", "true");
    try {
      await dispatch(checkAuthStatus()).unwrap();
      if (role === "vendor") {
        navigate("/vendordashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (e) {
      console.error("Demo login error:", e);
    }
  };

  const isRegister = handler === "register";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .card-enter { animation: fadeUp 0.4s ease-out both; }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f3d2e 0%, #1a4d3c 50%, #0f3d2e 100%)" }}
      >
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
          }}
        />

        <div className="relative w-full max-w-[420px]">

          {/* logo */}
          <div className="card-enter text-center mb-6">
            <span className="text-2xl font-semibold tracking-wide text-white">Jaydor</span>
            <p className="text-white/60 text-xs mt-1 uppercase tracking-widest">
              {isRegister ? "Create your account" : "Welcome back"}
            </p>
          </div>

          {/* card */}
          <div
            className="card-enter bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/30 px-8 py-8 space-y-5"
            style={{ animationDelay: "0.08s" }}
          >
            {/* heading */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">
                {isRegister ? "Join Jaydor" : "Sign in"}
              </h1>
              <p className="text-gray-400 text-xs mt-1">
                {isRegister
                  ? "Start your curated shopping experience"
                  : "Log in to continue your journey"}
              </p>
            </div>

            {/* server error */}
            {serverError && (
              <div className="rounded-lg bg-red-50 text-red-600 text-xs px-4 py-3 border border-red-200 flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-6h2v4h-2V5z" clipRule="evenodd" />
                </svg>
                {serverError}
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* ── regular fields (text, email, password, date) ── */}
              {fields.map((eachField, idx) => (
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
                  render={({ field: { onChange, onBlur, value } }) => (
                    <div
                      className="animate-[fadeUp_0.35s_ease-out_both]"
                      style={{ animationDelay: `${0.15 + idx * 0.06}s` }}
                    >
                      {eachField.type === "date" ? (
                        <FloatingField label={eachField.placeholder} error={errors[eachField.name]?.message}>
                          <ReactDatePicker
                            onChange={onChange}
                            onBlur={onBlur}
                            selected={value}
                            className={inputClass(!!errors[eachField.name])}
                          />
                        </FloatingField>
                      ) : (
                        <FloatingField label={eachField.placeholder} error={errors[eachField.name]?.message}>
                          <input
                            type={eachField.type}
                            value={value || ""}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder={eachField.placeholder}
                            className={inputClass(!!errors[eachField.name])}
                          />
                        </FloatingField>
                      )}
                    </div>
                  )}
                />
              ))}

              {/* ── Role picker — only shown on register ── */}
              {isRegister && (
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: "Please select a role to continue" }}
                  render={({ field: { onChange, value } }) => (
                    <div className="animate-[fadeUp_0.35s_ease-out_both]" style={{ animationDelay: `${0.15 + fields.length * 0.06}s` }}>
                      <RolePicker
                        value={value}
                        onChange={onChange}
                        error={errors.role?.message}
                      />
                    </div>
                  )}
                />
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full py-3 rounded-lg bg-[#0f3d2e] hover:bg-[#1a4d3c] active:scale-[0.98] text-white text-sm font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-[#0f3d2e]/30 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Please wait...
                  </>
                ) : isRegister ? "Create Account" : "Sign In"}
              </button>
            </form>

            {/* Try Demo Section */}
            {!isRegister && (
              <div className="border-t border-gray-150 pt-4 mt-2 space-y-3">
                <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Or Try Demo
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("buyer")}
                    className="py-2 px-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:border-[#0f3d2e] hover:bg-[#f0f7f3] active:scale-[0.98] transition-all duration-250 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("vendor")}
                    className="py-2 px-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:border-[#0f3d2e] hover:bg-[#f0f7f3] active:scale-[0.98] transition-all duration-250 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Vendor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("admin")}
                    className="py-2 px-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:border-[#0f3d2e] hover:bg-[#f0f7f3] active:scale-[0.98] transition-all duration-250 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            {/* footer nav */}
            <p className="text-center text-xs text-gray-400 pt-1">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <span
                onClick={() => navigate(isRegister ? "/login" : "/register")}
                className="text-[#0f3d2e] font-semibold cursor-pointer hover:underline underline-offset-2 transition"
              >
                {isRegister ? "Log In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReuseableAuthenticationForm;