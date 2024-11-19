import { Navbar } from "../components/Navbar";
import { getAllbooks } from "../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { host } from "../api/api";

export const Landing = () => {
  const navigate = useNavigate();
  const [Books, setBooks] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [message, setMessage] = useState("Descubre más...");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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

  useEffect(() => {
    if (username && username !== "null") {
      setMessage(`Bienvenido ${username}`);
    } else {
      setMessage("Descubre más...");
    }
  }, [username]);

  useEffect(() => {
    async function loadBooks() {
      const res = await getAllbooks();
      setBooks(res.data);
    }
    loadBooks();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="text-center text-lg font-semibold mt-4">{message}</div>

        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="rounded-lg shadow-lg p-3 bg-gray-800">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {Books.map((book) => (
                <div key={book.book_id} className="group flex flex-col" onClick={() => navigate(`/reviews/${book.book_id}`)} // Redirige al hacer clic
>
                  <div className="flex flex-row overflow-hidden h-64">
                    <div className="w-1/2">
                      <img
                        alt={"book"}
                        src={book.cover}
                        className="h-full w-full object-cover object-center group-hover:opacity-75 rounded-lg"
                      />
                    </div>
                    <div className="p-4 w-1/2 flex flex-col justify-between">
                      <div>
                        <p className="mt-1 text-lg font-medium text-gray-100">
                          {book.title}
                        </p>
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
                      </div>
                      <div className="mt-4 flex-1 overflow-hidden">
                        <p className="text-sm text-gray-300 max-h-16 overflow-hidden group-hover:max-h-full group-hover:overflow-auto transition-all duration-300 ease-in-out">
                          {book.synopsis}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <button onClick={() => handleLike(book.book_id)}>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;