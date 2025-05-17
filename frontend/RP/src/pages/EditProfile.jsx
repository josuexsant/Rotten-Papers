import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { host } from '../api/api';
import {
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });
  const [userData, setUserData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: userData,
  });

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token || token === 'null') {
        navigate('/login');
        return;
      }
      
      try {
        const response = await fetch(`${host}/user_profile/`, {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener datos del perfil');
        }
        
        const data = await response.json();
        setUserData({
          username: data.username || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
        });
        
        // Establecer valores en el formulario
        setValue('username', data.username || '');
        setValue('first_name', data.first_name || '');
        setValue('last_name', data.last_name || '');
        setValue('email', data.email || '');
      } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar datos del perfil', 'error');
      }
    };
    
    fetchUserData();
  }, [navigate, setValue]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    
    if (!token || token === 'null') {
      showNotification('No se encontró el token de autenticación', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${host}/editProfile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }
      
      const result = await response.json();
      localStorage.setItem('username', data.username);
      showNotification('Perfil actualizado correctamente');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al actualizar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notificación */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircleIcon className="h-6 w-6 mr-2" />
          ) : (
            <ExclamationCircleIcon className="h-6 w-6 mr-2" />
          )}
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification({ show: false, message: '', type: '' })}
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

        <div className="md:flex">
          {/* Columna izquierda */}
          <div className="md:w-1/2 md:pr-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-800">Editar Perfil</h1>
                  <p className="text-gray-600">Actualiza tu información personal</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      type="text"
                      placeholder="Nombre de usuario"
                      {...register('username', {
                        required: 'El nombre de usuario es obligatorio',
                        minLength: {
                          value: 3,
                          message: 'El nombre debe tener al menos 3 caracteres',
                        },
                      })}
                      className={`pl-10 block w-full rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-300'} py-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out`}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdentificationIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="first_name"
                      type="text"
                      placeholder="Tu nombre"
                      {...register('first_name', {
                        required: 'El nombre es obligatorio',
                        minLength: {
                          value: 2,
                          message: 'El nombre debe tener al menos 2 caracteres',
                        },
                      })}
                      className={`pl-10 block w-full rounded-md border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} py-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out`}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

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
                      type="text"
                      placeholder="Tus apellidos"
                      {...register('last_name', {
                        required: 'Los apellidos son obligatorios',
                        minLength: {
                          value: 2,
                          message: 'Los apellidos deben tener al menos 2 caracteres',
                        },
                      })}
                      className={`pl-10 block w-full rounded-md border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} py-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out`}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>

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
                      type="email"
                      placeholder="tu@email.com"
                      {...register('email', {
                        required: 'El correo electrónico es obligatorio',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Introduce un correo electrónico válido',
                        },
                      })}
                      className={`pl-10 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} py-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !isDirty}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${
                      loading || !isDirty
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    } transition-colors`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Actualizando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Columna derecha - Información */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="bg-blue-50 rounded-xl p-6 md:p-8 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información sobre tu perfil</h2>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>¿Por qué es importante mantener tu perfil actualizado?</strong>
                </p>
                <p>
                  Mantener tu información al día nos permite brindarte una mejor experiencia personalizada
                  y asegurar que podamos contactarte cuando sea necesario.
                </p>
                
                <div className="bg-white p-4 rounded-lg border border-blue-100 mt-6">
                  <h3 className="font-medium text-gray-800 mb-2">Recomendaciones</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Usa un nombre de usuario que puedas recordar fácilmente</li>
                    <li>Asegúrate de que tu correo electrónico sea uno que consultes regularmente</li>
                    <li>Tu nombre y apellidos aparecerán en tus reseñas y comentarios</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-4">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    Privacidad
                  </h3>
                  <p className="text-sm mt-2">
                    Tu información personal está segura y nunca la compartiremos con terceros sin tu consentimiento.
                    Para más información, consulta nuestra política de privacidad.
                  </p>
                </div>
              </div>
            </div>
            
            <img
              src="https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Biblioteca"
              className="w-full h-56 object-cover object-center rounded-xl mt-6 shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;