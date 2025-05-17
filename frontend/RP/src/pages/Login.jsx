import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  BookOpenIcon,
  ArrowPathIcon,
  UserPlusIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

export function Login() {
  const navigate = useNavigate();
  const { signin, isAuthenticated, error, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [animation, setAnimation] = useState("");

  // Reset error on component mount
  useEffect(() => {
    setError("");
  }, [setError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signin(credentials);
      // If there's an error, it will be caught by useAuth and set to the error state
    } catch (err) {
      // This is just in case there's an unhandled error
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger shake animation when error changes
  useEffect(() => {
    if (error) {
      setAnimation("animate-shake");
      const timer = setTimeout(() => {
        setAnimation("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
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
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="flex items-center mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpenIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
                    <p className="text-gray-600">Bienvenido de nuevo a Rotten Papers</p>
                  </div>
                </div>
                
                {/* Error message */}
                {error && (
                  <div className={`bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md ${animation}`}>
                    <div className="flex">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email input */}
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
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="tu@email.com"
                        value={credentials.email}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contraseña
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        placeholder="Tu contraseña"
                        value={credentials.password}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
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
                  </div>

                  {/* Remember me checkbox */}
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                      Recordar mi sesión
                    </label>
                  </div>

                  {/* Submit button */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${
                        loading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      } transition-colors`}
                    >
                      {loading ? (
                        <>
                          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                          Iniciando sesión...
                        </>
                      ) : (
                        <>
                          Iniciar Sesión 
                          <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Registration link */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      ¿No tienes una cuenta?{" "}
                      <Link
                        to="/signin"
                        className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center"
                      >
                        Regístrate aquí
                        <UserPlusIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Right side - Image and features */}
            <div className="lg:w-1/2 relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-cyan-900/30 z-10"></div>
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1908&q=80"
                alt="Libros en estanterías"
              />
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md mx-8">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Bienvenido a tu biblioteca digital
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Inicia sesión para disfrutar de estas funciones:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Tu biblioteca personal</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Mantén un registro de tus libros y organízalos a tu manera.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Comparte reseñas</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Comparte tus opiniones y descubre qué piensan otros lectores.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Guarda tus favoritos</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Marca libros como favoritos para encontrarlos fácilmente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

// Add this CSS to your global styles or App.css
/**
 * @keyframes shake {
 *   0% { transform: translateX(0) }
 *   25% { transform: translateX(-8px) }
 *   50% { transform: translateX(8px) }
 *   75% { transform: translateX(-4px) }
 *   100% { transform: translateX(0) }
 * }
 * 
 * .animate-shake {
 *   animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
 * }
 */