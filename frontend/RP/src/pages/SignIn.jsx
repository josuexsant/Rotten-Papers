import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { host } from "../api/api";
import {
  UserIcon,
  EnvelopeIcon,
  UserCircleIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  IdentificationIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Form data state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Errors state
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    username: false,
    gender: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasLength: false,
    hasUpperCase: false,
    hasNumber: false,
  });

  // Update password strength when password changes
  useEffect(() => {
    const { password } = formData;
    const strength = {
      score: 0,
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
    };

    // Calculate score (0-3)
    let score = 0;
    if (strength.hasLength) score++;
    if (strength.hasUpperCase) score++;
    if (strength.hasNumber) score++;
    strength.score = score;

    setPasswordStrength(strength);
  }, [formData.password]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Password validation
  const passwordIsValid = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate in real-time if field has been touched or form was submitted
    if (touched[name] || isSubmitted) {
      validateField(name, value);
    }
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { name } = e.target;
    // Mark field as touched
    setTouched({ ...touched, [name]: true });
    // Validate the field
    validateField(name, formData[name]);
  };

  // Field validation
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "first_name":
        if (!value.trim()) {
          errorMessage = "El nombre es requerido";
        } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) {
          errorMessage = "El nombre solo debe contener letras";
        }
        break;

      case "last_name":
        if (!value.trim()) {
          errorMessage = "El apellido es requerido";
        } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) {
          errorMessage = "El apellido solo debe contener letras";
        }
        break;

      case "username":
        if (!value.trim()) {
          errorMessage = "El nombre de usuario es requerido";
        } else if (value.length < 3) {
          errorMessage = "El nombre de usuario debe tener al menos 3 caracteres";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errorMessage = "Solo letras, números y guiones bajos";
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
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Formato de correo electrónico inválido";
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "La contraseña es requerida";
        } else if (!passwordIsValid(value)) {
          errorMessage = "La contraseña no cumple con los requisitos";
        }
        
        // Validate confirm password if already entered
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Las contraseñas no coinciden",
          }));
        } else if (formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
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

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return errorMessage === "";
  };

  // Validate entire form
  const validateForm = () => {
    let isValid = true;

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const isFieldValid = validateField(field, formData[field]);
      isValid = isValid && isFieldValid;
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      setFormError("Por favor, corrija los errores en el formulario.");
      return;
    }

    setLoading(true);
    
    // Prepare data for sending, excluding confirmPassword
    const dataToSend = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      gender: formData.gender,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${host}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message || "Error al registrar el usuario");
      }

      if (body.token && body.user) {
        showNotification("Usuario registrado correctamente");
        // Redirect after a short delay
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setFormError(body.message || "Error al registrar el usuario");
        showNotification("Error al registrar el usuario", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError(error.message || "Error al registrar el usuario");
      showNotification(error.message || "Error al registrar el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if an error should be displayed
  const shouldShowError = (fieldName) => {
    return (touched[fieldName] || isSubmitted) && errors[fieldName];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.type === "success" ? (
            <CheckCircleIcon className="h-6 w-6 mr-2" />
          ) : (
            <ExclamationCircleIcon className="h-6 w-6 mr-2" />
          )}
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="ml-3 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span>Volver</span>
        </button>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="lg:flex">
            {/* Left side - Form */}
            <div className="lg:w-1/2 p-8">
              <div className="max-w-md mx-auto">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserCircleIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-800">Crear una cuenta</h1>
                    <p className="text-gray-600">Únete a nuestra comunidad de lectores</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Personal Information Section */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Información personal</h2>
                    
                    <div className="space-y-4">
                      {/* First Name */}
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nombre(s)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IdentificationIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="first_name"
                            name="first_name"
                            placeholder="Tu nombre"
                            type="text"
                            value={formData.first_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`pl-10 block w-full rounded-lg border ${
                              shouldShowError("first_name") ? "border-red-500" : "border-gray-300"
                            } py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                          />
                        </div>
                        {shouldShowError("first_name") && (
                          <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Apellidos
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IdentificationIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="last_name"
                            name="last_name"
                            placeholder="Tus apellidos"
                            type="text"
                            value={formData.last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`pl-10 block w-full rounded-lg border ${
                              shouldShowError("last_name") ? "border-red-500" : "border-gray-300"
                            } py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                          />
                        </div>
                        {shouldShowError("last_name") && (
                          <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Género
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`pl-10 block w-full rounded-lg border ${
                              shouldShowError("gender") ? "border-red-500" : "border-gray-300"
                            } py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 appearance-none bg-none`}
                          >
                            <option value="">Seleccione su género</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                            <option value="other">Otro</option>
                          </select>
                        </div>
                        {shouldShowError("gender") && (
                          <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Information Section */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Información de la cuenta</h2>
                    
                    <div className="space-y-4">
                      {/* Username */}
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nombre de usuario
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="username"
                            name="username"
                            placeholder="Nombre de usuario"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`pl-10 block w-full rounded-lg border ${
                              shouldShowError("username") ? "border-red-500" : "border-gray-300"
                            } py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                          />
                        </div>
                        {shouldShowError("username") && (
                          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            placeholder="tu@email.com"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`pl-10 block w-full rounded-lg border ${
                              shouldShowError("email") ? "border-red-500" : "border-gray-300"
                            } py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                          />
                        </div>
                        {shouldShowError("email") && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Seguridad</h2>
                    
                    <div className="space-y-4">
                      {/* Password */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contraseña
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`pl-10 block w-full rounded-lg border ${
                              shouldShowError("password") ? "border-red-500" : "border-gray-300"
                            } py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        
                        {/* Password strength indicator */}
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                            <div 
                              className={`h-2.5 rounded-full ${
                                passwordStrength.score === 0 ? "w-0" :
                                passwordStrength.score === 1 ? "w-1/3 bg-red-500" :
                                passwordStrength.score === 2 ? "w-2/3 bg-yellow-500" :
                                "w-full bg-green-500"
                              }`}
                            />
                          </div>
                          <div className="flex flex-wrap text-xs space-x-4">
                            <span className={passwordStrength.hasLength ? "text-green-600" : "text-gray-500"}>
                              {passwordStrength.hasLength ? "✓" : "•"} 8+ caracteres
                            </span>
                            <span className={passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-500"}>
                              {passwordStrength.hasUpperCase ? "✓" : "•"} 1 mayúscula
                            </span>
                            <span className={passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}>
                              {passwordStrength.hasNumber ? "✓" : "•"} 1 número
                            </span>
                          </div>
                        </div>
                        
                        {shouldShowError("password") && (
                          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirmar contraseña
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`pl-10 block w-full rounded-lg border ${
                              shouldShowError("confirmPassword") ? "border-red-500" : "border-gray-300"
                            } py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {shouldShowError("confirmPassword") && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Error */}
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                      <div className="flex">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm text-red-700">{formError}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${
                        loading
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      } transition-colors`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </>
                      ) : (
                        "Crear cuenta"
                      )}
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      ¿Ya tienes una cuenta?{" "}
                      <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Iniciar sesión aquí
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Right side - Image and info */}
            <div className="lg:w-1/2 relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30 z-10"></div>
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Biblioteca con libros"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md mx-4">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Únete a nuestra comunidad de lectores
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Al registrarte en Rotten Papers, podrás:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Descubrir nuevos libros adaptados a tus gustos</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Guardar tus libros favoritos en colecciones personalizadas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Compartir tus opiniones y calificaciones con otros lectores</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Recibir recomendaciones personalizadas basadas en tus intereses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;