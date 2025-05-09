import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { host } from "../api/api";
import { useState } from "react";
import { set } from "react-hook-form";

const navigation = [
  { name: "Mis favoritos", to: "/favorites", current: false},
  { name: <ShoppingCartIcon  className="h-6 w-6"/>, to: "/shoppingCart", current: false}
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, signout } = useAuth();
  const [tokenTemp, setTokenTemp] = useState(0);

  const handleSignout = async () => {
    await signout();
    navigate("/");
  };

  const eliminarCuenta = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      const token = localStorage.getItem("token");
      setTokenTemp(token);
      signout();
      try {
        const response = await fetch(`${host}/delete_user`, {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
        window.location.reload();
        console.log("Cuenta eliminada con éxito");
        setTokenTemp(0);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Eliminación de cuenta cancelada");
    }
  };

  return (
    <Disclosure as="nav" className="bg-custom-blue">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-custom-light-blue hover:bg-custom-dark-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-white font-fredoka ont-bold text-xl">
                Rotten Papers
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-8 items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-custom-light-blue hover:bg-custom-dark-blue transition-all duration-300 ease-in-out hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Icono de lupa con barra de búsqueda desplegable */}
                <div className="relative group flex items-center">
                  {/* Barra de búsqueda que se despliega al hacer hover */}
                  <div className="w-0 group-hover:w-64 transition-all duration-500 ease-in-out overflow-hidden">
                    <form>
                      <input
                        id="search"
                        name="search"
                        className="block  w-full pr-10 py-1 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-custom-blue-2 focus:border-custom-blue-2 sm:text-sx"
                        placeholder="Buscar"
                        type="search"
                      />
                    </form>
                  </div>
                  <button
                    type="button"
                    className="text-custom-light-blue hover:text-white focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {isAuthenticated ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://www.svgrepo.com/show/81103/avatar.svg"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      href="/editProfile"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    >
                      Editar perfil
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                      onClick={eliminarCuenta}
                    >
                      Eliminar cuenta
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100"
                      onClick={handleSignout}
                    >
                      Cerrar sesión
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          ) : (
            <div className="hidden sm:ml-6 sm:block">
              <Link
                to="/access"
                className="bg-white text-custom-blue hover:bg-custom-dark-blue hover:text-white transition-all duration-300 ease-in-out px-3 py-2 rounded-md text-sm font-medium"
              >
                Acceder
              </Link>
            </div>
          )}
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}

          {!isAuthenticated && (
            <DisclosureButton
              as={Link}
              to="/access"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Acceder
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
