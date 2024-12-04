import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { host } from "../api/api";

export const Reviews = () => {
  const { isAuthenticated } = useAuth();
  const [username] = useState(localStorage.getItem("username"));
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [AllReviews, setAllReviews] = useState([]);
  const [filteredAllReviews, setFilteredAllReviews] = useState([]);
  const [Books, setBooks] = useState([]);
  const params = useParams(); //Para visualizar urls
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (params.id) {
        console.log(params.id);
        const id = params.id;
        try {
          const response = await fetch(`${host}/book/?book_id=${id}`);
          if (!response.ok) {
            throw new Error("Error fetching book details");
          }
          const data = await response.json();
          setBook(data);
          console.log(data);

          // Obtener el autor usando author_id
          const authorResponse = await fetch(
            `${host}/author/?author_id=${data.author}`
          );
          if (!authorResponse.ok) {
            throw new Error("Error fetching author details");
          }
          const authorData = await authorResponse.json();
          setAuthor(authorData);

          //Obtener reviews del usuario logueado
          const Reviewsresponse = await fetch(
            `${host}/user_reviews/?book_id=${params.id}`,
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

          //Obtener reviews de todos los usuarios
          const ReviewsresponseAll = await fetch(
            `${host}/reviews/?book_id=${params.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!ReviewsresponseAll.ok) {
            throw new Error("Error fetching book details");
          }
          const reviewsDataAll = await ReviewsresponseAll.json();
          setAllReviews(reviewsDataAll);
          setFilteredAllReviews(reviewsDataAll);
          console.log(reviewsDataAll);
        } catch (error) {
          console.error("Error fetching all details:", error);
        }
      }
    };
    fetchBookDetails();
  }, [params.id, filteredReviews, filteredAllReviews]);

  if (!book || !author || !reviews || !AllReviews) {
    return <div className="">Loading...</div>; // Mientras los datos del libro y el autor se cargan
  }

  const createReview = (e) => {
    e.preventDefault();
    console.log("Creando reseña...");
    const reviewText = e.target.elements["review-text"].value;
    const reviewData = {
      book_id: params.id,
      review: reviewText,
      rating: rating,
    };

    console.log(reviewData);

    fetch(`${host}/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error creating review");
        }
        return response.json();
      })
      .then((data) => {
        setReviews((prevReviews) => [...prevReviews, data]);
        setFilteredReviews((prevReviews) => [...prevReviews, data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
      fetch(`${host}/favorites/`, {
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

  const handleRemoveReview = (review_id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta reseña?"
    );
    if (confirmed) {
      fetch(`${host}/reviews/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ review_id: review_id }),
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
            const updatedReviews = reviews.filter(
              (review) => review.review_id !== review_id
            );
            setReviews(updatedReviews);
            setFilteredReviews(updatedReviews);
          } else {
            response.text().then((text) => {
              console.error("Error al eliminar la reseña:", text);
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const editReview = (review) => {
    console.log(review.review_id);
    setReviewToEdit(review.review);
    console.log(reviewToEdit);
  };

  return (
    <>
      <Navbar showAccessButton={false} />
      <div className=" container mx-auto my-6 px-4 max-w-8x1">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Columna izquierda: Imagen, estrellas, botones etc*/}
          <div className="w-full md:w-1/3 p-4 flex flex-col items-center md:items-center">
            <img
              src={book.cover}
              alt={book.title}
              className="w-2/3 object-cover mb-2 rounded-lg"
            />

            {/* Botón Favoritos */}

            <div>
              <button
                onClick={() => handleLike(book.book_id)}
                className="rounded-full m-1 p-3 flex justify-center bg-custom-blue text-white  hover:bg-gray-500 "
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
            </div>

            {/* Estrellas de calificación Pero no es dinamico aún*/}

            <p className="font-fredoka italic mb-2 text-lg">
              ¡Califica este libro!
            </p>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  onClick={() => setRating(index + 1)}
                  className={`h-8 w-7 cursor-pointer ${
                    index < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ))}
              <p className="text-gray-700 ml-3 text-2xl top-3">
                <strong> {rating} </strong>
              </p>
            </div>

            {isAuthenticated ? (
              <form action="" onSubmit={createReview}>
                <textarea
                  id="review-text"
                  name="review-text"
                  rows="4"
                  className="p-2 border border-gray-300 bg-slate-50 rounded-lg w-max"
                  placeholder="Escribe tu reseña aquí..."
                ></textarea>
                <button
                  type="submit"
                  className="rounded-full mb-1 p-4 flex mt-4 justify-center bg-custom-blue text-white hover:bg-gray-300"
                >
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
                      d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.392 19.32a4.5 4.5 0 0 1-1.89 1.13l-3.034.91a.75.75 0 0 1-.926-.926l.91-3.035a4.5 4.5 0 0 1 1.13-1.89L16.862 3.487zM15.11 5.239l3.182 3.182"
                    />
                  </svg>
                  {/*Falta crear botón para crear reseña*/}
                  <p className="ml-3">Crea una reseña</p>
                </button>
              </form>
            ) : (
              <p className="ml-3">
                Necesitas iniciar sesión para crear una reseña
              </p>
            )}

            {/* Botón Añadir Reseña */}
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
              {/* TODO:Falta hacerlo dinámico*/}
              <p className="mb-4">
                Generos: | Accion | Ficción | Aventura | Pasión | Romance |
              </p>
              <hr className="border-gray-300 mb-10" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Calificación y reseñas
              </h2>

              {/** Seccion de mis reseñas */}
              <div>
                <h3 className="font-medium ml-5 mb-3">Mis reseñas</h3>
              </div>

              {isAuthenticated ? (
                <>
                  <div>
                    {/* Verifica si hay reseñas */}
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <div
                          key={review.review_id}
                          className="flex bg-slate-50 rounded-3xl p-3 mb-6"
                        >
                          <div className="w-1/4 flex flex-col items-center">
                            <p>{review.review_id}</p>
                            <img
                              /* Aquí obvio se cambia la dirección de la imagen */
                              src="https://www.svgrepo.com/show/81103/avatar.svg"
                              alt="Foto del usuario"
                              className="w-20 h-30 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {/* Aquí deberías agregar la lógica para obtener el nombre de usuario */}
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
                                    index < review.rating
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
                              <p className="text-gray-700 ml-2">
                                <strong>{review.rating}</strong>
                              </p>
                            </div>
                            <div>
                              {/*Aqui falta hacerlo dinámico*/}
                              <p className="text-gray-700">{review.review}</p>
                            </div>
                          </div>

                          {/* Fecha de publicación (puedes actualizarla con el campo de fecha real si lo tienes) */}
                          <div className="w-1/6 text-right">
                            <p className="text-gray-500 text-sm">22/10/23</p>
                          </div>

                          {/* Botón para editar reseña */}
                          <button
                            className="rounded-full mb-1 px-2 py-2 flex mt-4 justify-center bg-white text-black hover:bg-gray-300 w-2/4 "
                            onClick={
                              () => editReview(review)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
                            </svg>
                            <p className="ml-3">Editar reseña</p>
                          </button>

                          {/* Botón para eliminar reseña */}
                          <button
                            className="rounded-full mb-1 px-2 py-2 flex mt-4 justify-center bg-white text-black hover:bg-gray-300 w-2/4 "
                            onClick={() => handleRemoveReview(review.review_id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg>
                            <p className="ml-3">Elimnar reseña</p>
                          </button>
                        </div>
                      ))
                    ) : (
                      // Mensaje cuando no hay reseñas
                      <div className="text-center text-gray-500">
                        <p>Aún no tienes reseñas para este libro.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-700">
                  Necesitas iniciar sesión para ver tus reseñas.
                </p>
              )}

              <hr className="border-gray-300 mb-5" />
              <div>
                {/*Falta agregar esta parte...*/}
                <h3 className="font-medium ml-5 mb-3">
                  Reseñas de la comunidad
                </h3>
              </div>
              <div>
                {/* Verifica si hay reseñas */}
                {filteredAllReviews.length > 0 ? (
                  filteredAllReviews.map((reviews) => (
                    <div
                      key={reviews.review_id}
                      className="flex bg-slate-50 rounded-3xl p-3 mb-6"
                    >
                      <div className="w-1/4 flex flex-col items-center">
                        <img
                          /* Aquí obvio se cambia la dirección de la imagen */
                          src="https://www.svgrepo.com/show/81103/avatar.svg"
                          alt="Foto_user"
                          className="w-20 h-30 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {reviews.user}
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
                                index < reviews.rating
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
                          <p className="text-gray-700 ml-2">
                            <strong>{reviews.rating}</strong>
                          </p>
                        </div>
                        <div>
                          {/*Aqui falta hacerlo dinámico*/}
                          <p className="text-gray-700">{reviews.review}</p>
                        </div>
                      </div>

                      {/* Fecha de publicación (puedes actualizarla con el campo de fecha real si lo tienes) */}
                      <div className="w-1/6 text-right">
                        <p className="text-gray-500 text-sm">22/10/23</p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Mensaje cuando no hay reseñas
                  <div className="text-center text-gray-500">
                    <p>No exiten reseñas para este libro.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;
