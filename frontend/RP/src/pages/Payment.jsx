import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const subtotal = (books) =>
  books.reduce((total, book) => total + book.price * book.quantity, 0);

export function Payment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: '',
    fullName: '',
    street: '',
    postalCode: '',
    phoneNumber: '',
    specialInstructions: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    navigate('/confirmation');
  };

  const [books] = useState([
    {
      id: 1,
      title: 'The Design of Everyday Things',
      price: 19.99,
      quantity: 1,
    },
    {
      id: 2,
      title: 'Atomic Habits',
      price: 16.99,
      quantity: 2,
    },
    {
      id: 3,
      title: 'The Alchemist',
      price: 12.99,
      quantity: 1,
    },
  ]);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 p-8">
        {/* Formulario de Envío */}
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Detalles de Envío</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="country" className="block font-medium">
              País:
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
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
            </label>

            <label className="block font-medium">
              Nombre Completo:
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </label>

            <label className="block font-medium">
              Calle y Número:
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </label>

            <label className="block font-medium">
              Código Postal:
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </label>

            <label className="block font-medium">
              Número de Teléfono:
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </label>

            <label className="block font-medium">
              Instrucciones Especiales:
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              ></textarea>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Confirmar dirección
            </button>
          </form>
        </div>

        {/* Sección derecha */}
        <div className="w-1/2 flex flex-col space-y-4 pl-6">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block font-medium">
                Número de Tarjeta:
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block font-medium">
                Nombre en la Tarjeta:
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </label>

              <div className="flex space-x-4">
                <label className="block font-medium w-1/2">
                  Fecha de Expiración:
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </label>
                <label className="block font-medium w-1/2">
                  CVV:
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Confirmar Pago
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
