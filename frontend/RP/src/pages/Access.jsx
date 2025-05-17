import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookOpenIcon, ArrowRightIcon, UserPlusIcon, UserIcon } from '@heroicons/react/24/outline';

export const Access = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-purple-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex lg:items-center">
            {/* Lado izquierdo - Texto e información */}
            <div className="p-8 lg:p-12 lg:w-1/2">
              <div className="max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center space-x-2 mb-6">
                  <BookOpenIcon className="h-8 w-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">Rotten Papers</h2>
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
                  Abre un libro, abre tu mente
                </h1>
                
                <p className="text-xl text-blue-100 mb-10">
                  Descubre y lee más. Encuentra tu próxima aventura literaria.
                </p>
                
                <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center bg-white hover:bg-blue-50 text-blue-800 rounded-lg px-6 py-3 text-base font-medium shadow-md transition-colors w-full sm:w-auto group"
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    Iniciar sesión
                    <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    to="/signin"
                    className="flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-6 py-3 text-base font-medium shadow-md transition-colors w-full sm:w-auto"
                  >
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    Registrarse
                  </Link>
                </div>
                
                <div className="mt-10 text-blue-100 border-t border-blue-200/30 pt-6">
                  <h3 className="text-lg font-semibold mb-2">¿Por qué unirte a nosotros?</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Descubre nuevos libros
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Comparte tus opiniones
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Guarda tus favoritos
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Conecta con lectores
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Lado derecho - Imagen */}
            <div className="lg:w-1/2 relative">
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-blue-400/80 to-transparent z-10"></div>
              <div className="bg-cream-100 h-full flex items-center justify-center p-8 lg:p-0">
                <img
                  src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149320038.jpg?t=st=1727840060~exp=1727843660~hmac=9e69c3dfb1e1b705aa07202ab017ea9b515a2ded9a155173a6c874fa70b60616&w=1380"
                  alt="Pila de libros coloridos"
                  className="max-h-96 lg:max-h-none lg:h-full object-contain rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500 z-20"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección adicional (opcional) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <svg className="h-10 w-10 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Biblioteca virtual</h3>
            <p className="text-blue-100">
              Accede a miles de títulos desde cualquier dispositivo y en cualquier momento.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <svg className="h-10 w-10 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Reseñas y calificaciones</h3>
            <p className="text-blue-100">
              Descubre qué opinan otros lectores y comparte tus propias experiencias.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <svg className="h-10 w-10 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Compra fácil y segura</h3>
            <p className="text-blue-100">
              Proceso de compra simplificado con múltiples opciones de pago seguras.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer simple */}
      <footer className="py-6 text-center text-white bg-blue-800">
        <p>© 2025 Rotten Papers. Todos los derechos reservados.</p>
      </footer>
      
      {/* Elementos decorativos */}
      <div className="fixed top-0 right-0 -z-10 h-full w-full">
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-2/3 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Access;