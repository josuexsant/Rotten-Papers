import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const subtotal = (books) =>
  books.reduce((total, book) => total + book.price * book.quantity, 0);

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

  // Estado para manejar errores de validación
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

  // Estado para saber si el formulario ha sido enviado
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Si el usuario está corrigiendo un campo después de un intento de envío,
    // validamos inmediatamente ese campo
    if (isSubmitted) {
      validateField(name, value);
    }
  };

  // Función para validar un campo específico
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "country":
        errorMessage = value ? "" : "Selecciona un país";
        break;
      case "fullName":
        errorMessage = value.trim().length >= 3 
          ? "" 
          : "El nombre debe tener al menos 3 caracteres";
        break;
      case "street":
        errorMessage = value.trim().length >= 5 
          ? "" 
          : "La dirección debe tener al menos 5 caracteres";
        break;
      case "postalCode":
        // Validar que el código postal tenga exactamente 5 dígitos
        errorMessage = /^\d{5}$/.test(value) 
          ? "" 
          : "El código postal debe tener 5 dígitos";
        break;
      case "phoneNumber":
        // Validar que el teléfono tenga al menos 10 dígitos
        errorMessage = /^\d{10,}$/.test(value.replace(/\D/g, '')) 
          ? "" 
          : "El número de teléfono debe tener al menos 10 dígitos";
        break;
      case "cardNumber":
        // Validar que el número de tarjeta tenga entre 15-16 dígitos (para la mayoría de tarjetas)
        errorMessage = /^\d{15,16}$/.test(value.replace(/\D/g, '')) 
          ? "" 
          : "El número de tarjeta debe tener entre 15 y 16 dígitos";
        break;
      case "cardName":
        errorMessage = value.trim().length >= 3 
          ? "" 
          : "El nombre en la tarjeta debe tener al menos 3 caracteres";
        break;
      case "expiryDate":
        if (!value) {
          errorMessage = "La fecha de expiración es obligatoria";
        } else {
          // Validar que la fecha no esté en el pasado
          const [year, month] = value.split('-');
          const expiryDate = new Date(year, month - 1);
          const currentDate = new Date();
          
          // Establecer el día al 1 para ambas fechas para comparar solo mes y año
          expiryDate.setDate(1);
          currentDate.setDate(1);
          
          errorMessage = expiryDate >= currentDate 
            ? "" 
            : "La fecha de expiración no puede estar en el pasado";
        }
        break;
      case "cvv":
        // Validar que el CVV tenga 3 o 4 dígitos
        errorMessage = /^\d{3,4}$/.test(value) 
          ? "" 
          : "El CVV debe tener 3 o 4 dígitos";
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    return errorMessage === "";
  };

  // Función para validar todo el formulario
  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...errors };

    // Validar cada campo
    Object.keys(formData).forEach(field => {
      // No validamos las instrucciones especiales porque son opcionales
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
    
    // Validar todo el formulario antes de enviar
    if (validateForm()) {
      console.log("Datos enviados:", formData);
      
      // Navegar a la página de confirmación y pasar los datos como estado
      navigate("/confirmation", { 
        state: { 
          formData, 
          books // Pasar los libros junto con los datos del formulario
        } 
      });
    } else {
      // Hacer scroll al primer error
      const firstErrorField = Object.keys(errors).find(key => errors[key] !== "");
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const [books] = useState([
    {
      id: 1,
      title: "The Design of Everyday Things",
      price: 199.90,
      quantity: 1,
    },
    {
      id: 2,
      title: "Atomic Habits",
      price: 399.90,
      quantity: 2,
    },
    {
      id: 3,
      title: "The Alchemist",
      price: 259.90,
      quantity: 1,
    },
  ]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-4 md:p-8">
        {/* Formulario completo (envío y pago) */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Formulario de Envío */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Detalles de Envío</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="country" className="block font-medium">
                    País o región:
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className={`w-full border p-2 rounded ${errors.country ? 'border-red-500' : ''}`}
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
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nombre y Apellido"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={`w-full border p-2 rounded ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    Calle y Número:
                  </label>
                  <input
                    type="text"
                    name="street"
                    placeholder="Calle, número ext e int"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className={`w-full border p-2 rounded ${errors.street ? 'border-red-500' : ''}`}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    Código Postal:
                  </label>
                  <input
                    type="text" // Cambiado a text para mejor control de validación
                    name="postalCode"
                    placeholder="Por ejemplo: 12345"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    maxLength={5}
                    className={`w-full border p-2 rounded ${errors.postalCode ? 'border-red-500' : ''}`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    Número de Teléfono:
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Por ejemplo: 5512345678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className={`w-full border p-2 rounded ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    Instrucciones Especiales:
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    (Opcional) Ejemplo: "Dejar en la puerta" o "Entregar a vecino".
                  </p>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Sección derecha */}
            <div className="w-full md:w-1/2 flex flex-col space-y-4">
              {/* Resumen de compra */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Resumen de Compra</h2>
                {books.map((book) => (
                  <div key={book.id} className="flex justify-between border-b py-2">
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-gray-500">Cantidad: {book.quantity}</p>
                    </div>
                    <p className="text-lg font-medium">
                      ${(book.price * book.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-xl mt-4">
                  <span>Total:</span>
                  <span>${subtotal(books).toFixed(2)}</span>
                </div>
              </div>

              {/* Formulario de Pago */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Detalles de Pago</h2>
                <div className="flex space-x-4 mb-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                    alt="Visa"
                    className="h-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                    className="h-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png"
                    alt="American Express"
                    className="h-8"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">
                      Número de Tarjeta:
                    </label>
                    <input
                      type="text" // Cambiado a text para mejor control de validación
                      placeholder="XXXX XXXX XXXX XXXX"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      maxLength={16}
                      className={`w-full border p-2 rounded ${errors.cardNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">
                      Nombre en la Tarjeta:
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Nombre y Apellido"
                      value={formData.cardName}
                      onChange={handleChange}
                      required
                      className={`w-full border p-2 rounded ${errors.cardName ? 'border-red-500' : ''}`}
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                      <label className="block font-medium">
                        Fecha de Expiración:
                      </label>
                      <input
                        type="month"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                        className={`w-full border p-2 rounded ${errors.expiryDate ? 'border-red-500' : ''}`}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                      )}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="block font-medium">
                        CVV:
                      </label>
                      <input
                        type="text" // Cambiado a text para mejor control de validación
                        placeholder="XXX"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        maxLength={4}
                        className={`w-full border p-2 rounded ${errors.cvv ? 'border-red-500' : ''}`}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Confirmar Pago
                  </button>
                  
                  {/* Mensaje de error general */}
                  {isSubmitted && Object.values(errors).some(error => error) && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      <p className="font-medium">Por favor, corrige los errores en el formulario antes de continuar.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}