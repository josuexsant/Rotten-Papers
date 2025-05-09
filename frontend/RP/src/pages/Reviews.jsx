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
  const [isEditing, setIsEditing] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newFav, setNewFav] = useState(false);
  const [likedBooks, setLikedBook] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${host}/favorites/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to like book");
        }

        const data = await response.json();
        setLikedBook(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFavorites();
  }, [newFav]);

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
  }, [params.id]);

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

  const handleRemove = async (bookId) => {
    fetch(`${host}/favorites/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ book_id: bookId }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          setNewFav(!newFav);
        } else {
          console.error("Error al eliminar el libro");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLike = async (book_id) => {
    try {
      const response = await fetch(`${host}/favorites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ book_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to like book");
      }
      setNewFav(!newFav);
      console.log("Book liked");
    } catch (error) {
      console.error("Error:", error);
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

  return (
    <>
      <Navbar showAccessButton={false} />
      <div className=" container mx-auto my-6 px-4 max-w-8x1">
        <div className="flex flex-col md:flex-row  rounded-lg overflow-hidden">
          {/* Columna izquierda: Imagen, estrellas, botones etc*/}
          <div className="w-full md:w-1/3 p-4 flex flex-col items-center md:items-center  bg-slate-50 rounded-xl shadow-md">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full object-cover mb-2 rounded-lg"
            />

            {/* Botón Favoritos */}

            <div>
              {likedBooks.map((book) => book.book_id).includes(book.book_id) ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(book.book_id);
                  }}
                >
                  <div className="flex flex-row items-center align-middle justify-between my-4">
                    <p className="mx-1 text-xl">¡Te gusta!</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#EA3323"
                    >
                      <path d="m 480 -120 l -58 -52 q -101 -91 -167 -157 T 150 -447.5 Q 111 -500 95.5 -544 T 80 -634 q 0 -94 63 -157 t 157 -63 q 52 0 99 22 t 81 62 q 34 -40 81 -62 t 99 -22 q 94 0 157 63 t 63 157 q 0 46 -15.5 90 T 810 -447.5 Q 771 -395 705 -329 T 538 -172 l -58 52 Z Z Z" />
                    </svg>
                  </div>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated) {
                      handleLike(book.book_id);
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  <div className="flex flex-row items-center align-middle justify-between my-4">
                    <p className="mx-1 text-xl">¡Dale me gusta!</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="30px"
                      viewBox="0 -960 960 960"
                      width="30px"
                      fill="#EA3323"
                    >
                      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                    </svg>
                  </div>
                </button>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <div className="bg-white w-full flex rounded-xl p-4 flex-col align-middle items-center">
                  <p className="font-fredoka italic mb-2 text-2xl text-gray-600">
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
                </div>
              </>
            ) : (
              <p className="ml-3">
                Necesitas iniciar sesión para crear una reseña
              </p>
            )}

            {/* Botón Añadir Reseña */}
          </div>

          {/* Columna derecha: Detalles del libro */}
          <div className="w-full md:w-2/3 p-4 flex flex-col justify-start ">
            <h2 className="text-3xl font-bold m-1 text-gray-600">
              {book.title}
            </h2>
            <p className="m-1 text-xl font-serif italic text-gray-400">
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
            <div className="h-80 bg-slate-50 rounded-xl p-3">
              <h2 className="text-xl font-bold text-gray-600 mb-2">Resumen:</h2>
              <hr />
              <p className="text-gray-700 font-serif mb-40 group flex flex-col ">
                {book.synopsis}
              </p>
            </div>
            <div>
              {/* TODO:Falta hacerlo dinámico*/}
              <p className="m-2 text-gray-400">
                Generos: | Accion | Ficción | Aventura | Pasión | Romance |
              </p>
              <hr className="border-gray-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold m-1 text-gray-600 my-6">
                Calificación y reseñas
              </h2>

              {/** Seccion de mis reseñas */}
              <div>
                <h3 className="text-xl font-bold m-1 text-gray-500 m-3">
                  Mis reseñas
                </h3>
              </div>

              {isAuthenticated ? (
                <>
                  <div>
                    {/* Verifica si hay reseñas */}
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <div
                          key={review.review_id}
                          className="flex bg-slate-50 rounded-3xl p-3 mb-6 flex-col md:flex-row align-middle items-center"
                        >
                          <div className="w-1/4 flex flex-col items-center">
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
                            <div>
                              {/*Aqui falta hacerlo dinámico*/}
                              {isEditing === review.review_id ? (
                                <>
                                  <div className="flex items-center mb-2">
                                    {[...Array(5)].map((_, index) => (
                                      <svg
                                        key={index}
                                        onClick={() => setNewRating(index + 1)}
                                        className={`h-8 w-7 cursor-pointer ${
                                          index < newRating
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
                                    <p className="text-gray-700 ml-3 text-2xl top-3">
                                      <strong> {newRating} </strong>
                                    </p>
                                  </div>
                                  <form
                                    action=""
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      console.log("Editando reseña...");
                                      const reviewText =
                                        e.target.elements["review-text"].value;
                                      const reviewData = {
                                        review_id: review.review_id,
                                        review: reviewText,
                                        rating: newRating,
                                      };
                                      console.log(reviewData);
                                      const response = fetch(
                                        `${host}/reviews/`,
                                        {
                                          method: "PUT",
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Token ${localStorage.getItem(
                                              "token"
                                            )}`,
                                          },
                                          body: JSON.stringify(reviewData),
                                        }
                                      )
                                        .then((response) => {
                                          if (!response.ok) {
                                            throw new Error(
                                              "Error updating review"
                                            );
                                          }
                                          return response.json();
                                        })
                                        .then((data) => {
                                          const updatedReviews = reviews.map(
                                            (r) =>
                                              r.review_id === review.review_id
                                                ? data
                                                : r
                                          );
                                          setReviews(updatedReviews);
                                          setFilteredReviews(updatedReviews);
                                        })
                                        .catch((error) => {
                                          console.error("Error:", error);
                                        });
                                      // Add logic to handle review update here
                                      setIsEditing(0); // Reset editing state
                                      setNewRating(0); // Reset new rating state
                                    }}
                                  >
                                    <textarea
                                      id="review-text"
                                      name="review-text"
                                      rows="4"
                                      className="p-2 border border-gray-300 bg-white rounded-lg w-max"
                                      defaultValue={review.review}
                                    ></textarea>
                                    <div className="flex">
                                      <button
                                        type="submit"
                                        className="rounded-xl mb-1 p-2 flex mx-3 justify-center bg-white hover:bg-gray-300"
                                      >
                                        Guardar
                                      </button>
                                      <button
                                        className="rounded-xl mb-1 p-2 flex mx-3 justify-center bg-white hover:bg-gray-300"
                                        onClick={() => {
                                          setNewRating(0);
                                          setIsEditing(0);
                                        }}
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </form>
                                </>
                              ) : (
                                <>
                                  <div className="flex flex-row justify-between">
                                    <div className="flex flex-col w-max justify-between">
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
                                      <p className="text-gray-700">
                                        {review.review}
                                      </p>
                                      {/* Fecha de publicación (puedes actualizarla con el campo de fecha real si lo tienes) */}
                                      <div className="w-1/6 text-right"></div>
                                    </div>
                                    <div>
                                      {/* Botón para editar reseña */}
                                      <button
                                        className="rounded-full mb-1 px-2 py-2 flex mt-4 justify-center bg-white text-black hover:bg-gray-300 w-40 "
                                        onClick={() =>
                                          setIsEditing(review.review_id)
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
                                        className="rounded-full mb-1 px-2 py-2 flex mt-4 justify-center bg-white text-black hover:bg-gray-300 w-40 "
                                        onClick={() =>
                                          handleRemoveReview(review.review_id)
                                        }
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
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
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
                <h3 className="text-xl font-bold m-1 text-gray-500 m-3">
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
