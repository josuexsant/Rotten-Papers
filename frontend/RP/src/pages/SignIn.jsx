import { Navbar } from "../components/Navbar";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { host } from "../api/api";

export function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    username: false,
    gender: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const passwordIsValid = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar el campo en tiempo real si ya ha sido tocado o si se ha intentado enviar
    if (touched[name] || isSubmitted) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Marcar el campo como tocado
    setTouched({ ...touched, [name]: true });
    // Validar el campo
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "first_name":
        if (!value.trim()) {
          errorMessage = "El nombre es requerido";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "El nombre solo debe contener letras";
        }
        break;

      case "last_name":
        if (!value.trim()) {
          errorMessage = "El apellido es requerido";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "El apellido solo debe contener letras";
        }
        break;

      case "username":
        if (!value.trim()) {
          errorMessage = "El nombre de usuario es requerido";
        }
        break;

      case "gender":
        if (!value) {
          errorMessage = "Seleccione un género";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "El correo electrónico es requerido";
        } else if (!value.includes("@")) {
          errorMessage = "El correo electrónico no es válido";
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "La contraseña es requerida";
        } else if (!passwordIsValid(value)) {
          errorMessage = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número";
        }
        // Validar confirmación de contraseña si ya se ha ingresado
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: "Las contraseñas no coinciden"
          }));
        } else if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: ""
          }));
        }
        break;

      case "confirmPassword":
        if (!value) {
          errorMessage = "Confirme su contraseña";
        } else if (value !== formData.password) {
          errorMessage = "Las contraseñas no coinciden";
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    return errorMessage === "";
  };

  const validateForm = () => {
    let isValid = true;
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );
    setTouched(allTouched);

    // Validar cada campo
    Object.keys(formData).forEach(field => {
      const isFieldValid = validateField(field, formData[field]);
      isValid = isValid && isFieldValid;
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      setFormError("Por favor, corrija los errores en el formulario.");
      return;
    }

    // Preparar los datos para enviar, sin incluir confirmPassword
    const dataToSend = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      gender: formData.gender,
      email: formData.email,
      password: formData.password
    };

    try {
      console.log("Enviando datos:", dataToSend);
      const response = await fetch(`${host}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
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
        setFormError(body.message || "Error al registrar el usuario");
        toast.error("Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError(error.message || "Error al registrar el usuario");
      toast.error(error.message || "Error al registrar el usuario");
    }
  };

  // Helper function to determine if an error should be displayed
  const shouldShowError = (fieldName) => {
    return (touched[fieldName] || isSubmitted) && errors[fieldName];
  };

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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre (s)
                    </label>
                    <div className="mt-1">
                      <input
                        id="first_name"
                        name="first_name"
                        placeholder="Nombre"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          shouldShowError("first_name") ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm`}
                      />
                      {shouldShowError("first_name") && (
                        <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apellidos
                    </label>
                    <div className="mt-1">
                      <input
                        id="last_name"
                        name="last_name"
                        placeholder="Apellido paterno"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          shouldShowError("last_name") ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm`}
                      />
                      {shouldShowError("last_name") && (
                        <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre de usuario
                    </label>
                    <div className="mt-1">
                      <input
                        id="username"
                        name="username"
                        placeholder="Nombre de usuario"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          shouldShowError("username") ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm`}
                      />
                      {shouldShowError("username") && (
                        <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                      )}
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
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          shouldShowError("gender") ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm`}
                      >
                        <option value="">Seleccione su género</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                      {shouldShowError("gender") && (
                        <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                      )}
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
                        id="email"
                        name="email"
                        placeholder="Correo electrónico"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          shouldShowError("email") ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm`}
                      />
                      {shouldShowError("email") && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
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
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          shouldShowError("password") ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm`}
                      />
                      {shouldShowError("password") && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                      )}
                      <p className="text-gray-400 text-sm mt-1">
                        La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirmar contraseña
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          shouldShowError("confirmPassword") ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none  focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm`}
                      />
                      {shouldShowError("confirmPassword") && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    {formError && <p className="text-red-500 mb-4">{formError}</p>}

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