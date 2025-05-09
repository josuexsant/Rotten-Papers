import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const Access = () => {
  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl sm:px-6 sm:py-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-custom-blue-3 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            >
              <circle
                r={512}
                cx={512}
                cy={512}
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Rotten Papers
              </h2>

              <br />
              <h2 className="text-3xl font-sans tracking-tight text-white sm:text-4xl">
                Abre un libro, abre tu mente
              </h2>
              <p className="mt-6 text-lg leading-8 text-custom-blue-4">
                Descubre y lee más
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-y-4 lg:justify-center">
                <Link
                  to="/login"
                  className="w-48 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-center"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/signin"
                  className="w-48 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-center"
                >
                  Registrarse
                </Link>
              </div>
            </div>
            <div className="relative my-16 flex justify-center items-center h-auto lg:mt-8">
              <img
                alt="Portada de libros"
                src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149320038.jpg?t=st=1727840060~exp=1727843660~hmac=9e69c3dfb1e1b705aa07202ab017ea9b515a2ded9a155173a6c874fa70b60616&w=1380"
                className="w-[80%] max-w-[60rem] h-auto rounded-md bg-white/5 ring-1 ring-white/10" // Ajusta el tamaño con `w-[80%]` y `max-w-[60rem]`
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Access;
