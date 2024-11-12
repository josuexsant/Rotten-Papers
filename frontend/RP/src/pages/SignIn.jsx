import { Navbar } from "../components/Navbar";
import { createUser } from "../api/api";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const { register, handleSubmit } = useForm(); //Guardar los datos del form en variables
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        toast.success("Usuario registrado correctamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error al registrar el usuario");
      });

    navigate("/login");
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
                  href="#"
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
                        placeholder="Nombre"
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
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contraseña
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        autoComplete="current-password"
                        {...register("password", { required: true })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
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
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
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
