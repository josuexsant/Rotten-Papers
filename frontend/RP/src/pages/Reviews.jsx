import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Reviews = () => {
  const username = useState(localStorage.getItem("username"));
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [Books, setBooks] = useState([]);
  const params = useParams(); //Para visualizar urls
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (params.id) {
        //console.log(params.id);  Id obtenido de libro en pagina Landing
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/book/?book_id=${params.id}`
          );
          if (!response.ok) {
            throw new Error("Error fetching book details");
          }
          const data = await response.json();
          setBook(data);

          // Obtener el autor usando author_id
          const authorResponse = await fetch(
            `http://127.0.0.1:8000/author/?author_id=${data.author}`
          );
          if (!authorResponse.ok) {
            throw new Error("Error fetching author details");
          }
          const authorData = await authorResponse.json();
          setAuthor(authorData);

          //Obtener reviewes
          const Reviewsresponse = await fetch(
            `http://localhost:8000/reviews/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!Reviewsresponse.ok) {
            throw new Error("Error fetching book details");
          }
          const reviewsData = await Reviewsresponse.json();
          setReviews(reviewsData);
          setFilteredReviews(reviewsData);
        } catch (error) {
          console.error("Error fetching book details:", error);
        }
      }
    };
    fetchBookDetails();
  }, [params.id]);

  if (!book || !author || !reviews) {
    return <div className="">Loading...</div>; // Mientras los datos del libro y el autor se cargan
  }

  const handleLike = (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const confirmed = window.confirm(
      "¿Estás seguro de que quieres agregar este libro a favoritos?"
    );
    if (confirmed) {
      fetch(`http://localhost:8000/favorites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            const updatedBooks = Books.map((book) =>
              book.book_id === bookId ? { ...book, favorite: true } : book
            );
            setBooks(updatedBooks);
          } else {
            console.error("Error al agregar el libro a favoritos");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      <Navbar showAccessButton={false} />

      <div className="bg-gray-800 py-2 text-center">
        <h1 className="text-2xl font-semibold text-white">
          Reseñas {username}
        </h1>
      </div>

      <div className="container mx-auto my-10 px-4 max-w-8x1">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Columna izquierda: Imagen, estrellas, botones etc*/}
          <div className="w-full md:w-1/3 p-4 flex flex-col items-center md:items-center">
            <img
              src={book.cover}
              alt={book.title}
              className="w-2/3 object-cover mb-2 rounded-lg"
            />

            {/* Botón Favoritos */}
            <button
              onClick={() => handleLike(book.book_id)}
              className="rounded-full mb-1 py-2 flex mt-4 justify-center bg-gray-700 text-white  hover:bg-gray-900 w-2/4 "
            >
              <p className="flex items-start mr-2 font-fredoka">Favoritos</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6 text-white hover:fill-white transition-all duration-300 ease-in-out"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>

            {/* Estrellas de calificación Pero no es dinamico aún*/}
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`h-8 w-7 ${
                    index < book.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ))}
              <p className="text-gray-700 ml-3 text-2xl top-3">
                <strong> {book.rating} </strong>
              </p>
            </div>
            <p className="font-fredoka italic mb-4 text-lg">
              ¡Califica este libro!
            </p>

            {/* Botón Añadir Reseña */}
            <button
              onClick={() => navigate(`/`)}
              className="rounded-full mb-1 px-2 py-2 flex mt-4 justify-center bg-white text-black hover:bg-gray-300 w-2/4 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6 text-black hover:fill-white transition-all duration-300 ease-in-out"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.392 19.32a4.5 4.5 0 0 1-1.89 1.13l-3.034.91a.75.75 0 0 1-.926-.926l.91-3.035a4.5 4.5 0 0 1 1.13-1.89L16.862 3.487zM15.11 5.239l3.182 3.182"
                />
              </svg>
              {/*Falta crear botón para crear reseña*/}
              <p className="ml-3">Crea una reseña</p>
            </button>
          </div>

          {/* Columna derecha: Detalles del libro */}
          <div className="w-full md:w-2/3 p-4 flex flex-col justify-start">
            <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-700 mb-2 font-serif italic">
              {author.name} {author.lastname1} {author.lastname2}
            </p>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`h-5 w-5 ${
                    index < book.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ))}
              <p className="text-gray-700 ml-2 ">
                <strong> {book.rating} / 5 </strong>
              </p>
            </div>
            <p className="text-gray-700 font-serif mb-40">{book.synopsis}</p>
            <div>
              {/*Falta hacerlo dinámico*/}
              <p className="mb-4">
                Generos: | Accion | Ficción | Aventura | Pasión | Romance |
              </p>
              <hr className="border-gray-300 mb-10" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Calificación y reseñas
              </h2>
              <div>
                <h3 className="font-medium ml-5">Mis reseñas</h3>
              </div>
              <div>
                {filteredReviews.map((review) => (
                  <div
                    key={review.review_id}
                    className="flex bg-white shadow-lg rounded-3xl p-3 mb-6"
                  >
                    <div className="w-1/4 flex flex-col items-center">
                      <img
                        /*Aquí obvio se cambia la dirección de la imagen*/
                        src="data:image/jpeg;base64,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"
                        alt="Foto del usuario"
                        className="w-20 h-30 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {username}
                        </p>
                      </div>
                    </div>

                    {/* Reseña y calificación */}
                    <div className="w-4/6">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`h-5 w-5 ${
                              index < book.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                          </svg>
                        ))}
                        <p className="text-gray-700 ml-2 ">
                          <strong> {book.rating}</strong>
                        </p>
                      </div>
                      <div>
                        <div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fecha de publicación, pero no tenemos campo de fecha asi que solo queda hacerlo así*/}
                    <div className="w-1/6 text-right">
                      <p className="text-gray-500 text-sm">22/10/23</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {/*Falta agregar esta parte...*/}
                <h3 className="font-medium ml-5">Todas las reseñas</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;
