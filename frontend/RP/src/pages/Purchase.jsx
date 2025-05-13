import { Navbar } from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Purchase() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para almacenar los datos que vienen del componente Payment
  const [orderData, setOrderData] = useState({
    orderId: "ORD-" + Math.floor(10000 + Math.random() * 90000), // Genera un ID aleatorio
    date: new Date().toLocaleDateString(),
    books: [],
    shippingAddress: {
      fullName: "",
      street: "",
      postalCode: "",
      country: "",
    },
    paymentInfo: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
    },
  });

  // Efecto para procesar los datos que vienen del componente Payment
  useEffect(() => {
    // Verificar si hay datos en location.state
    if (location.state && location.state.formData && location.state.books) {
      const { formData, books } = location.state;
      
      // Formatear los datos para mostrarlos
      setOrderData({
        orderId: "ORD-" + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleDateString(),
        books: books,
        shippingAddress: {
          fullName: formData.fullName || "",
          street: formData.street || "",
          postalCode: formData.postalCode || "",
          country: formData.country || "",
          phoneNumber: formData.phoneNumber || "",
          specialInstructions: formData.specialInstructions || "",
        },
        paymentInfo: {
          // Mostrar solo los últimos 4 dígitos de la tarjeta
          cardNumber: formData.cardNumber ? 
            "•••• •••• •••• " + formData.cardNumber.slice(-4) : 
            "•••• •••• •••• ****",
          cardName: formData.cardName || "",
          // Formatear la fecha de expiración a MM/YYYY si existe
          expiryDate: formData.expiryDate ? 
            `${formData.expiryDate.split('-')[1]}/${formData.expiryDate.split('-')[0]}` : 
            "",
        },
      });
    } else {
      // Si no hay datos en location.state, usar datos por defecto
      // Esto es útil para pruebas o si el usuario accede directamente a esta ruta
      setOrderData({
        orderId: "ORD-" + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleDateString(),
        books: [
          {
            id: 1,
            title: "The Design of Everyday Things",
            price: 19.99,
            quantity: 1,
          },
          {
            id: 2,
            title: "Atomic Habits",
            price: 16.9,
            quantity: 2,
          },
          {
            id: 3,
            title: "The Alchemist",
            price: 12.99,
            quantity: 1,
          },
        ],
        shippingAddress: {
          fullName: "Juan Pérez",
          street: "Av. Reforma 123",
          postalCode: "72000",
          country: "México",
        },
        paymentInfo: {
          cardNumber: "•••• •••• •••• 4589",
          cardName: "Juan Pérez",
        },
      });
    }
  }, [location.state]);

  const subtotal = orderData.books.reduce(
    (total, book) => total + book.price * book.quantity,
    0
  );

  const shipping = 4.99;
  const total = subtotal + shipping;

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto my-8 px-4">
        {/* Cabecera de confirmación */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* Icono de check usando SVG nativo */}
            <svg
              className="w-10 h-10 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-gray-600 mt-2">
            Tu pedido ha sido confirmado y está siendo procesado
          </p>
        </div>

        {/* Ticket de compra */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {/* Encabezado del ticket */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Número de pedido
                </p>
                <p className="font-semibold">{orderData.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Fecha</p>
                <p className="font-semibold">{orderData.date}</p>
              </div>
            </div>
          </div>

          {/* Contenido del ticket */}
          <div className="p-6">
            {/* Productos */}
            <h2 className="text-xl font-semibold flex items-center mb-4">
              {/* Icono de libro usando SVG nativo */}
              <svg
                className="w-5 h-5 mr-2 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Detalles del Pedido
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              {orderData.books.map((book) => (
                <div
                  key={book.id}
                  className="flex justify-between py-3 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {book.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(book.price * book.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Resumen de costos */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Envío</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Información de envío */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center mb-3">
                {/* Icono de ubicación usando SVG nativo */}
                <svg
                  className="w-5 h-5 mr-2 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Dirección de Envío
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">
                  {orderData.shippingAddress.fullName}
                </p>
                <p className="text-gray-600">
                  {orderData.shippingAddress.street}
                </p>
                <p className="text-gray-600">
                  {orderData.shippingAddress.postalCode},{" "}
                  {orderData.shippingAddress.country}
                </p>
                {orderData.shippingAddress.phoneNumber && (
                  <p className="text-gray-600 mt-2">
                    Tel: {orderData.shippingAddress.phoneNumber}
                  </p>
                )}
                {orderData.shippingAddress.specialInstructions && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium">Instrucciones especiales:</p>
                    <p className="text-gray-600 italic">
                      {orderData.shippingAddress.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de pago */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center mb-3">
                {/* Icono de tarjeta de crédito usando SVG nativo */}
                <svg
                  className="w-5 h-5 mr-2 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Método de Pago
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">
                  Tarjeta: {orderData.paymentInfo.cardNumber}
                </p>
                <p className="text-gray-600">
                  Titular: {orderData.paymentInfo.cardName}
                </p>
                {orderData.paymentInfo.expiryDate && (
                  <p className="text-gray-600">
                    Expira: {orderData.paymentInfo.expiryDate}
                  </p>
                )}
              </div>
            </div>

            {/* Botón para seguir comprando */}
            <button
              onClick={handleContinueShopping}
              className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <span>Continuar comprando</span>
              {/* Icono de flecha usando SVG nativo */}
              <svg
                className="w-5 h-5 ml-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Pie del ticket */}
          <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Recibirás un correo electrónico con los detalles de tu compra.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ¡Gracias por confiar en nosotros!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}