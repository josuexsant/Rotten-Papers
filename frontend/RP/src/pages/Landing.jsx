import {Navbar } from '../components/Navbar';
const products = [
  {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
    {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
    {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
    {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
    {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
    {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
    {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
    {
    id: 1,
    name: 'Gabriel García Márquez',
    href: '#',
    price: '100 Años de Soledad',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Cien_a%C3%B1os_de_soledad.png',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
]

export const Landing = () => {
  return (
    <>
    <Navbar />
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a key={product.id} href={product.href} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className="h-5 w-5 text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, maiores adipisci consequuntur ratione voluptatibus in minus eos natus necessitatibus dolorum at velit fugiat laborum repudiandae error facilis, vel quia atque!</p>
            </a>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default Landing;