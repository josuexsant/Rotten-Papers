from django.db import models
from django.contrib.auth.hashers import make_password
from django.core.validators import EmailValidator

class Usuarios(models.Model):
    user_id = models.AutoField(primary_key=True)  # ID automático
    name = models.CharField(max_length=50)  
    lastname1 = models.CharField(max_length=50)  
    lastname2 = models.CharField(max_length=50, blank=True, null=True)  
    email = models.EmailField(max_length=100, unique=True, validators=[EmailValidator()])  # Email único con validación
    password = models.CharField(max_length=255)  # Contraseña encriptada
    photo = models.CharField(max_length= 255,  blank=True, null=True)  # Foto del usuario (opcional)

    # Guardar la contraseña encriptada
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):  
            self.password = make_password(self.password)
        super(Usuarios, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} {self.lastname1}' 
    
    class Meta:
        db_table = 'Usuarios'
