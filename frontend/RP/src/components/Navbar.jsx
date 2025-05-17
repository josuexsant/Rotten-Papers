import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  PencilSquareIcon,
  HomeIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { host } from "../api/api";
import { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";

// Tipado de navegación
const navigation = [
  { name: "Inicio", to: "/", icon: HomeIcon },
  { name: "Favoritos", to: "/favorites", icon: HeartIcon },
  { name: "Carrito", to: "/shoppingCart", icon: ShoppingCartIcon }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated, signout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "Usuario");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [isAuthenticated]);

  const handleSignout = async () => {
    await signout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${host}/delete_user`, {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        
        await signout();
        navigate("/");
      } catch (error) {
        console.error("Error al eliminar cuenta:", error);
      } finally {
        setConfirmDelete(false);
      }
    } else {
      setConfirmDelete(true);
    }
  };

  // Verifica si una ruta está activa
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Modal de confirmación para eliminar cuenta */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">¿Estás seguro?</h3>
            <p className="text-gray-600 mb-6">
              Esta acción eliminará permanentemente tu cuenta y no podrá ser recuperada.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      <Disclosure as="nav" className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Botón del menú móvil */}
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Abrir menú principal</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
                  {/* Logo */}
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                      <BookOpenIcon className="h-8 w-8 text-white" />
                      <span className="text-white font-bold text-xl tracking-wide hidden sm:block">
                        Rotten Papers
                      </span>
                    </Link>
                  </div>
                  
                  {/* Navegación para escritorio */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          isActive(item.to)
                            ? "bg-blue-700 text-white"
                            : "text-white hover:bg-blue-700/50",
                          "rounded-md px-3 py-2 flex items-center space-x-1 text-sm font-medium transition-colors"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    
                    {/* Búsqueda para escritorio */}
                    <div className="relative ml-2">
                      <div 
                        className={classNames(
                          "transition-all duration-300 flex items-center bg-white/10 rounded-full overflow-hidden",
                          isSearchOpen ? "w-64" : "w-10"
                        )}
                      >
                        <form onSubmit={handleSearch} className="flex flex-1">
                          <input
                            type="text"
                            placeholder="Buscar libros..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={classNames(
                              "bg-transparent text-white placeholder-white/70 border-none focus:ring-0 text-sm w-full",
                              isSearchOpen ? "pl-3 pr-8 py-2" : "w-0 p-0"
                            )}
                          />
                        </form>
                        <button
                          type="button"
                          onClick={() => setIsSearchOpen(!isSearchOpen)}
                          className="p-2 text-white flex-shrink-0"
                        >
                          <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acceso a la derecha */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {isAuthenticated ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <MenuButton className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                          <span className="sr-only">Abrir menú de usuario</span>
                          <div className="bg-white/20 text-white rounded-full p-1">
                            <UserCircleIcon className="h-6 w-6" />
                          </div>
                          <span className="hidden md:block ml-2 text-white text-sm truncate max-w-[100px]">
                            {username}
                          </span>
                        </MenuButton>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                          <div className="py-1">
                            <MenuItem>
                              {({ active }) => (
                                <Link
                                  to="/editProfile"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'flex items-center px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  <PencilSquareIcon className="h-5 w-5 mr-3 text-gray-500" />
                                  Editar perfil
                                </Link>
                              )}
                            </MenuItem>
                          </div>
                          <div className="py-1">
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  onClick={handleDeleteAccount}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'flex w-full items-center px-4 py-2 text-sm text-red-600'
                                  )}
                                >
                                  <TrashIcon className="h-5 w-5 mr-3" />
                                  Eliminar cuenta
                                </button>
                              )}
                            </MenuItem>
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  onClick={handleSignout}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-gray-500" />
                                  Cerrar sesión
                                </button>
                              )}
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      to="/access"
                      className="flex items-center space-x-1 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Acceder</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Menú móvil */}
            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 px-3 pb-3 pt-2">
                {/* Búsqueda para móvil */}
                <div className="py-2">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Buscar libros..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-blue-700/50 text-white placeholder-white/70 border-none rounded-lg w-full py-2 px-3 focus:ring-1 focus:ring-white"
                    />
                    <button type="submit" className="p-2 text-white -ml-10">
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>

                {/* Navegación para móvil */}
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    to={item.to}
                    className={classNames(
                      isActive(item.to)
                        ? 'bg-blue-700 text-white'
                        : 'text-white hover:bg-blue-700/50',
                      'flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </DisclosureButton>
                ))}

                {!isAuthenticated && (
                  <DisclosureButton
                    as={Link}
                    to="/access"
                    className="flex w-full items-center space-x-2 rounded-md bg-white text-blue-600 px-3 py-2 text-base font-medium mt-4"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Acceder</span>
                  </DisclosureButton>
                )}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default Navbar;