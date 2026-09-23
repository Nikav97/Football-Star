import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../Register.css";

// Yup schema
const schema = yup.object().shape({
  username: yup.string().required("Username je obavezan"),
  email: yup.string().email("Neispravan email format").required("Email je obavezan"),
  password: yup
    .string()
    .min(6, "Lozinka mora imati najmanje 6 karaktera")
    .matches(/[A-Z]/, "Lozinka mora sadržati bar jedno veliko slovo")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Lozinka mora sadržati bar jedan specijalni karakter")
    .required("Lozinka je obavezna"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Lozinke se ne poklapaju")
    .required("Potvrda lozinke je obavezna"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    try {
      await registerUser(data.username, data.email, data.password);
      alert("✅ Registracija uspešna! Proverite email da potvrdite nalog.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registracija neuspešna");
    }
  };

  // helper za proveru pravila
  const hasMinLength = passwordValue.length >= 6;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  return (
    <div className="register-container">
      <h1>Registracija</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            {...register("username")}
            className={errors.username ? "input-error" : ""}
          />
          {errors.username && <p className="error-text">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Lozinka</label>
          <input
            type="password"
            {...register("password")}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}

          {/* Live feedback */}
          <ul className="password-rules">
            <li className={hasMinLength ? "valid" : "invalid"}>
              {hasMinLength ? "✔" : "✖"} Najmanje 6 karaktera
            </li>
            <li className={hasUppercase ? "valid" : "invalid"}>
              {hasUppercase ? "✔" : "✖"} Bar jedno veliko slovo
            </li>
            <li className={hasSpecialChar ? "valid" : "invalid"}>
              {hasSpecialChar ? "✔" : "✖"} Bar jedan specijalni karakter
            </li>
          </ul>
        </div>

        <div className="form-group">
          <label>Potvrdi lozinku</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Kreiranje naloga..." : "Registruj se"}
        </button>
      </form>
    </div>
  );
};

export default Register;
