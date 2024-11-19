import { Navbar } from '../components/Navbar';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { host } from '../api/api';

export function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    console.log('Datos enviados al backend:', data); // Agregar esta línea para verificar
    if (!data.username) {
      console.error('El nombre de usuario es requerido');
      return; // Detener el envío si el campo username está vacío
    }

    // Obtener el token desde el localStorage
    const token = localStorage.getItem('token');
    console.log('Token recuperado:', token); // Verificar si el token está presente

    if (!token || token === 'null') {
      console.error('No se encontró el token de autenticación.');
      toast.error('No se encontró el token de autenticación.');
      return; // Detener el proceso si no se encuentra el token
    }

    try {
      const response = await fetch(`${host}/editProfile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, // Usar el token en el encabezado de la solicitud
        },
        body: JSON.stringify(data), // Enviar los datos aquí
      });

      if (!response.ok) {
        throw new Error('Error al llamar al API: ' + response.statusText);
      }

      const result = await response.json();
      console.log('Perfil actualizado correctamente:', result);

      toast.success('Perfil actualizado correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      toast.error('Error al actualizar el perfil');
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
                Editar Perfil
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                ¿Deseas cambiar tu nombre de usuario?
              </p>
            </div>

            <div className="mt-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre de usuario
                  </label>
                  <div className="mt-1">
                    <input
                      placeholder="Nuevo nombre de usuario"
                      type="text"
                      {...register('username', {
                        required: 'El nombre de usuario es obligatorio',
                        minLength: {
                          value: 3,
                          message:
                            'El nombre de usuario debe tener al menos 3 caracteres',
                        },
                      })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sm"
                    />
                  </div>
                  {errors.username && (
                    <span className="text-sm text-red-500">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-blue hover:bg-custom-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
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

export default EditProfile;
