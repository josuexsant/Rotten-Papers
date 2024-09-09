export const SignIn = () => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get('name'),
      lastName1: form.get('lastName'),
      lastName2: form.get('secondLastName'),
      email: form.get('email'),
      password: form.get('password'),
    };
    console.log(data);
  };

  // [] TODO: Hacer funcion para validar las dos contraseñas
  // [] TODO: Hacer funcion para validar seguridad de contraseña
  // [] TODO: Hacer funcion para validar correo electrónico
  // [] TODO: Poner estilos

  return (
    <div>
      <h1 className="bg-red-700">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre(s)</label> <br />
        <input type="text" name="name" placeholder="Nombre(s)" /> <br />
        <label htmlFor="lastName">Apellido Paterno</label> <br />
        <input type="text" name="lastName" placeholder="Apellido Paterno" /> <br />
        <label htmlFor="secondLastName">Apellido Materno</label> <br />
        <input type="text" name="secondLastName" placeholder="Apellido Materno" /> <br />
        <label htmlFor="email">Correo electrónico</label> <br />
        <input type="email" name="email" placeholder="Correo electrónico" /> <br />
        <label htmlFor="password">Contraseña</label> <br />
        <input type="password" name="password" placeholder="Contraseña" /> <br />
        <label htmlFor="confirmPassword">Confirma tu contraseña</label> <br />
        <input type="password" name="confirmPassword" placeholder="Confirma tu contraseña" /> <br />
        <button>Registrarse</button>
      </form>
    </div>
  );
};

export default SignIn;
