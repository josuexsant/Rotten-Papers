import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  CreditCardIcon,
  TruckIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { getCartBooks } from "../api/api"; // Ajusta la ruta según tu estructura

// Calcular subtotal
const subtotal = (books) =>
  books.reduce((total, book) => total + book.price * (book.quantity || 1), 0);

export function Payment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: "",
    fullName: "",
    street: "",
    postalCode: "",
    phoneNumber: "",
    specialInstructions: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({
    country: "",
    fullName: "",
    street: "",
    postalCode: "",
    phoneNumber: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener libros del carrito al cargar el componente
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCartBooks();
        // Inicializar cada libro con quantity: 1
        const booksWithQuantity = response.data.map((book) => ({
          ...book,
          quantity: 1,
        }));
        setBooks(booksWithQuantity);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el carrito. Inténtalo de nuevo.");
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      }
    };

    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (isSubmitted) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "country":
        errorMessage = value ? "" : "Selecciona un país";
        break;
      case "fullName":
        errorMessage =
          value.trim().length >= 3
            ? ""
            : "El nombre debe tener al menos 3 caracteres";
        break;
      case "street":
        errorMessage =
          value.trim().length >= 5
            ? ""
            : "La dirección debe tener al menos 5 caracteres";
        break;
      case "postalCode":
        errorMessage = /^\d{5}$/.test(value)
          ? ""
          : "El código postal debe tener 5 dígitos";
        break;
      case "phoneNumber":
        errorMessage = /^\d{10,}$/.test(value.replace(/\D/g, ""))
          ? ""
          : "El número de teléfono debe tener al menos 10 dígitos";
        break;
      case "cardNumber":
        errorMessage = /^\d{15,16}$/.test(value.replace(/\D/g, ""))
          ? ""
          : "El número de tarjeta debe tener entre 15 y 16 dígitos";
        break;
      case "cardName":
        errorMessage =
          value.trim().length >= 3
            ? ""
            : "El nombre en la tarjeta debe tener al menos 3 caracteres";
        break;
      case "expiryDate":
        if (!value) {
          errorMessage = "La fecha de expiración es obligatoria";
        } else {
          const [year, month] = value.split("-");
          const expiryDate = new Date(year, month - 1);
          const currentDate = new Date();
          expiryDate.setDate(1);
          currentDate.setDate(1);
          errorMessage =
            expiryDate >= currentDate
              ? ""
              : "La fecha de expiración no puede estar en el pasado";
        }
        break;
      case "cvv":
        errorMessage = /^\d{3,4}$/.test(value)
          ? ""
          : "El CVV debe tener 3 o 4 dígitos";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return errorMessage === "";
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...errors };

    Object.keys(formData).forEach((field) => {
      if (field !== "specialInstructions") {
        const isFieldValid = validateField(field, formData[field]);
        isValid = isValid && isFieldValid;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      console.log("Datos enviados:", formData);
      navigate("/confirmation", {
        state: { formData, books },
      });
    } else {
      const firstErrorField = Object.keys(errors).find(
        (key) => errors[key] !== ""
      );
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Cargando datos del carrito...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-lg font-medium text-red-500">{error}</p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <CreditCardIcon className="h-8 w-8 text-blue-600" />
            Finalizar Compra
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Formulario de Envío */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                  Detalles de Envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      País o región
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Seleccione un país</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Brasil">Brasil</option>
                      <option value="Chile">Chile</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="España">España</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Honduras">Honduras</option>
                      <option value="México">México</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Panamá">Panamá</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Perú">Perú</option>
                      <option value="Puerto Rico">Puerto Rico</option>
                      <option value="República Dominicana">
                        República Dominicana
                      </option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Venezuela">Venezuela</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Nombre y Apellido"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Calle y número
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      placeholder="Calle, número ext e int"
                      value={formData.street}
                      onChange={handleChange}
                      className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.street ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Código postal
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        placeholder="12345"
                        value={formData.postalCode}
                        onChange={handleChange}
                        maxLength={5}
                        className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.postalCode ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Número de teléfono
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="5512345678"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="specialInstructions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Instrucciones especiales (opcional)
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      placeholder="Ejemplo: Dejar en la puerta"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" />
                  Detalles de Pago
                </h2>
                <div className="flex space-x-4 mb-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                    alt="Visa"
                    className="h-6"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                    className="h-6"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png"
                    alt="American Express"
                    className="h-6"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      maxLength={16}
                      className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.cardNumber ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cardName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="Nombre y Apellido"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.cardName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.cardName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Fecha de expiración
                      </label>
                      <input
                        type="month"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.expiryDate ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        maxLength={4}
                        className={`mt-1 block w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.cvv ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Compra */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Resumen de Compra
                </h2>
                {books.length === 0 ? (
                  <p className="text-gray-500">Tu carrito está vacío.</p>
                ) : (
                  <>
                    {books.map((book) => (
                      <div
                        key={book.book_id}
                        className="flex justify-between py-3 border-b border-gray-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Cantidad: {book.quantity || 1}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          ${(book.price * (book.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold text-lg mt-4">
                      <span>Total</span>
                      <span>${subtotal(books).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  disabled={books.length === 0}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  Confirmar Pago
                </button>
                {isSubmitted &&
                  Object.values(errors).some((error) => error) && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                      <ExclamationCircleIcon className="h-5 w-5" />
                      <p className="text-sm">
                        Corrige los errores en el formulario antes de continuar.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Payment;