import { Navbar } from "../components/Navbar";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { host } from "../api/api";

export function SignIn() {
  const { register, handleSubmit } = useForm(); //Guardar los datos del form en variables
  const navigate = useNavigate();
  //Mensajes de error
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const passwordIsValid = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    if (!passwordIsValid(password)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    if (confirmPassword !== document.getElementById("password").value) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const validatePassword = (data) => {
    if (!passwordIsValid(data.password)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
      );
      return false;
    }
    if (data.password !== document.getElementById("confirmPassword").value) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (validatePassword(data) === false) {
      setError("Contraseña no valida.");
      return;
    }

    if (!data.email.includes("@")) {
      setError("El correo electrónico no es válido");
      return;
    } else {
      setError("");
    }

    try {
      console.log(data);
      const response = await fetch(`${host}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al registrar el usuario");
      }

      const body = await response.json();

      if (body.token && body.user) {
        toast.success("Usuario registrado correctamente");
        navigate("/login");
      } else {
        console.error("Error:", body);
        setError(body.message || "Error al registrar el usuario");
        toast.error("Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error al registrar el usuario");
      toast.error(error.message || "Error al registrar el usuario");
    }
  });

  return (
    <>
      <Navbar />
      <div className="min-h-full flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Crear una cuenta
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <a
                  href="/login"
                  className="font-medium text-custom-blue hover:text-custom-blue-4"
                >
                  Iniciar sesión aquí
                </a>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre (s)
                    </label>
                    <div className="mt-1">
                      <input
                        placeholder="Nombre"
                        type="text"
                        pattern="[A-Za-z\s]+"
                        {...register("first_name", { required: true })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apellidos
                    </label>
                    <div className="mt-1">
                      <input
                        placeholder="Apellido paterno"
                        type="text"
                        pattern="[A-Za-z\s]+"
                        {...register("last_name", { required: true })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre de usuario
                    </label>
                    <div className="mt-1">
                      <input
                        placeholder="Nombre de usuario"
                        type="text"
                        {...register("username", { required: true })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Género
                    </label>
                    <div className="mt-1">
                      <select
                        id="gender"
                        name="gender"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      >
                        <option value="">Seleccione su género</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Correo electrónico
                    </label>
                    <div className="mt-1">
                      <input
                        placeholder="Correo electrónico"
                        type="email"
                        autoComplete="email"
                        {...register("email", { required: true })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-red-500">{passwordError}</p>
                    <label
                      onChange={handleConfirmPasswordChange}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contraseña
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        autoComplete="current-password"
                        onChange={handlePasswordChange}
                        {...register("password", { required: true })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
                      <p className="text-gray-400">
                        La contraseña debe ser minimo 8 caracteres y una
                        mayuscula{" "}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Corfirmar contraseña
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        onChange={handlePasswordChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-red-500 mb-4">{error}</p>

                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-blue hover:bg-custom-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Registrarse
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default SignIn;
