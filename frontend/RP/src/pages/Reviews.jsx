import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { host } from "../api/api";
import { 
  StarIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  HeartIcon as HeartIconSolid 
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";

export const Reviews = () => {
  const { isAuthenticated } = useAuth();
  const [username] = useState(localStorage.getItem("username"));
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [filteredAllReviews, setFilteredAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [isEditing, setIsEditing] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newFav, setNewFav] = useState(false);
  const [likedBooks, setLikedBook] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState(null);

  // Función para obtener la fecha formateada
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await fetch(`${host}/favorites/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setLikedBook(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [newFav, isAuthenticated]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      if (!params.id) return;

      try {
        // Obtener detalles del libro
        const response = await fetch(`${host}/book/?book_id=${params.id}`);
        if (!response.ok) {
          throw new Error("Error fetching book details");
        }
        const data = await response.json();
        setBook(data);

        // Obtener el autor
        const authorResponse = await fetch(
          `${host}/author/?author_id=${data.author}`
        );
        if (!authorResponse.ok) {
          throw new Error("Error fetching author details");
        }
        const authorData = await authorResponse.json();
        setAuthor(authorData);

        // Si el usuario está autenticado, obtener sus reseñas
        if (isAuthenticated) {
          const reviewsResponse = await fetch(
            `${host}/user_reviews/?book_id=${params.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );
          
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
            setFilteredReviews(reviewsData);
          }
        }

        // Obtener todas las reseñas
        const allReviewsResponse = await fetch(
          `${host}/reviews/?book_id=${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(isAuthenticated && { Authorization: `Token ${localStorage.getItem("token")}` }),
            },
          }
        );
        
        if (allReviewsResponse.ok) {
          const reviewsDataAll = await allReviewsResponse.json();
          setAllReviews(reviewsDataAll);
          setFilteredAllReviews(reviewsDataAll);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Error al cargar los datos. Por favor, inténtalo de nuevo.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [params.id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${host}/favorites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ book_id: params.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to like book");
      }
      setNewFav(!newFav);
    } catch (error) {
      console.error("Error liking book:", error);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const response = await fetch(`${host}/favorites/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ book_id: params.id }),
      });

      if (response.ok) {
        setNewFav(!newFav);
      } else {
        console.error("Error al eliminar de favoritos");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRemoveReview = (reviewId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      return;
    }

    fetch(`${host}/reviews/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ review_id: reviewId }),
    })
      .then((response) => {
        if (response.ok) {
          const updatedReviews = reviews.filter(
            (review) => review.review_id !== reviewId
          );
          setReviews(updatedReviews);
          setFilteredReviews(updatedReviews);
        } else {
          throw new Error("Error al eliminar la reseña");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Por favor, selecciona una calificación");
      return;
    }

    const reviewData = {
      book_id: params.id,
      review: reviewText,
      rating: rating,
    };

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
        setReviewText("");
        setRating(0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdateReview = (reviewId, newReviewText, newRating) => {
    const reviewData = {
      review_id: reviewId,
      review: newReviewText,
      rating: newRating,
    };

    fetch(`${host}/reviews/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating review");
        }
        return response.json();
      })
      .then((data) => {
        const updatedReviews = reviews.map((r) =>
          r.review_id === reviewId ? data : r
        );
        setReviews(updatedReviews);
        setFilteredReviews(updatedReviews);
        setIsEditing(0);
        setNewRating(0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const StarRating = ({ rating, setRating, size = "sm", interactive = false }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          } ${
            size === "sm" ? "h-5 w-5" : "h-7 w-7"
          } ${
            interactive ? "cursor-pointer" : ""
          }`}
          onClick={() => interactive && setRating(star)}
        />
      ))}
      {rating > 0 && <span className="ml-2 font-medium">{rating}</span>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-lg font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!book || !author) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-lg">No se encontró información del libro</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const isBookLiked = likedBooks.some(likedBook => likedBook.book_id === book.book_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Información del libro */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Columna izquierda: Imagen y acciones */}
            <div className="md:w-1/3 p-6 bg-white">
              <div className="flex flex-col items-center">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full max-w-xs object-cover rounded-lg shadow-md mb-6"
                />
                
                {/* Botón de favoritos */}
                <div className="w-full">
                  <button
                    onClick={isBookLiked ? handleRemoveFavorite : handleLike}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors
                      ${isBookLiked 
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700"
                      }`}
                  >
                    {isBookLiked ? (
                      <>
                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                        <span className="font-medium">En mis favoritos</span>
                      </>
                    ) : (
                      <>
                        <HeartIconOutline className="h-6 w-6" />
                        <span className="font-medium">Añadir a favoritos</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Columna derecha: Información del libro */}
            <div className="md:w-2/3 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">
                {author.name} {author.lastname1} {author.lastname2}
              </p>
              
              <div className="flex items-center mb-5">
                <StarRating rating={Math.round(book.rating)} setRating={() => {}} />
                <span className="ml-2 text-gray-600 font-medium">
                  {book.rating.toFixed(1)} / 5
                </span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Sinopsis</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{book.synopsis}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Géneros</h2>
                <div className="flex flex-wrap gap-2">
                  {["Acción", "Ficción", "Aventura", "Pasión", "Romance"].map((genre) => (
                    <span 
                      key={genre} 
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de reseñas */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Calificaciones y reseñas</h2>
            
            {/* Formulario de reseña */}
            {isAuthenticated ? (
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Escribe tu reseña</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Tu calificación</label>
                    <StarRating 
                      rating={rating} 
                      setRating={setRating} 
                      size="md" 
                      interactive={true} 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="review-text" className="block text-gray-700 mb-2">
                      Tu opinión
                    </label>
                    <textarea
                      id="review-text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition"
                      placeholder="Comparte tu experiencia con este libro..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Publicar reseña
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
                <p className="text-gray-700 mb-4">
                  Necesitas iniciar sesión para dejar una reseña
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Iniciar sesión
                </button>
              </div>
            )}
            
            {/* Mis reseñas */}
            {isAuthenticated && (
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-6">
                  Mis reseñas
                </h3>
                
                {filteredReviews.length > 0 ? (
                  <div className="space-y-6">
                    {filteredReviews.map((review) => (
                      <div 
                        key={review.review_id} 
                        className="bg-gray-50 rounded-lg p-6"
                      >
                        {isEditing === review.review_id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-gray-700 mb-2">Tu calificación</label>
                              <StarRating 
                                rating={newRating || review.rating} 
                                setRating={setNewRating} 
                                size="md" 
                                interactive={true} 
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="edit-review-text" className="block text-gray-700 mb-2">
                                Tu opinión
                              </label>
                              <textarea
                                id="edit-review-text"
                                defaultValue={review.review}
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition"
                              ></textarea>
                            </div>
                            
                            <div className="flex space-x-3">
                              <button
                                onClick={() => {
                                  const textArea = document.getElementById("edit-review-text");
                                  handleUpdateReview(
                                    review.review_id, 
                                    textArea.value, 
                                    newRating || review.rating
                                  );
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                Guardar cambios
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(0);
                                  setNewRating(0);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <img
                                  src="https://www.svgrepo.com/show/81103/avatar.svg"
                                  alt="Avatar"
                                  className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">{username}</p>
                                  <p className="text-gray-500 text-sm">
                                    {formatDate(review.created_at)}
                                  </p>
                                </div>
                              </div>
                              <StarRating rating={review.rating} setRating={() => {}} />
                            </div>
                            
                            <p className="text-gray-700 mb-4">{review.review}</p>
                            
                            <div className="flex space-x-3">
                              <button
                                onClick={() => {
                                  setIsEditing(review.review_id);
                                  setNewRating(review.rating);
                                }}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <PencilSquareIcon className="h-5 w-5 mr-1" />
                                Editar
                              </button>
                              <button
                                onClick={() => handleRemoveReview(review.review_id)}
                                className="flex items-center text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5 mr-1" />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aún no has escrito ninguna reseña para este libro</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Reseñas de la comunidad */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-6">
                Reseñas de la comunidad
              </h3>
              
              {filteredAllReviews.length > 0 ? (
                <div className="space-y-6">
                  {filteredAllReviews.map((review) => (
                    <div 
                      key={review.review_id} 
                      className="bg-gray-50 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <img
                            src="https://www.svgrepo.com/show/81103/avatar.svg"
                            alt="Avatar"
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{review.user}</p>
                            <p className="text-gray-500 text-sm">
                              {formatDate(review.created_at)}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} setRating={() => {}} />
                      </div>
                      
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay reseñas de la comunidad para este libro</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;