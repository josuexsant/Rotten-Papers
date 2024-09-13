
DROP TABLE IF EXISTS usuarios;
CREATE TABLE `usuarios`(
    `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `lastname1` VARCHAR(255) NOT NULL,
    `lastname2` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS genero;
CREATE TABLE `genero`(
    `genre_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `genre` VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS preferencias;
CREATE TABLE `preferencias`(
    `preference_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `genre_id` INT NOT NULL,
    CONSTRAINT `preferencias_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`user_id`),
    CONSTRAINT `preferencias_genre_id_foreign` FOREIGN KEY (`genre_id`) REFERENCES `genero`(`genre_id`)
);

DROP TABLE IF EXISTS autores;
CREATE TABLE `autores`(
    `author_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `lastname1` VARCHAR(255) NOT NULL,
    `lastname2` VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS libros;
CREATE TABLE `libros`(
    `book_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `author_id` INT NOT NULL,
    `synopsis` VARCHAR(255) NOT NULL,
    `genre_id` INT NOT NULL,
    `cover` VARCHAR(255) NOT NULL,
    `rating` FLOAT(53) NOT NULL,
    CONSTRAINT `libros_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `autores`(`author_id`)
);

DROP TABLE IF EXISTS libro_genero;
CREATE TABLE `libro_genero`(
    `genreB_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `genre_id` INT NOT NULL,
    `book_id` INT NOT NULL,
    CONSTRAINT `libro_genero_genre_id_foreign` FOREIGN KEY (`genre_id`) REFERENCES `genero`(`genre_id`),
    CONSTRAINT `libro_genero_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `libros`(`book_id`)
);

DROP TABLE IF EXISTS reseña;
CREATE TABLE `reseña`(
    `review_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `book_id` INT NOT NULL,
    `rating` INT NOT NULL,
    `review` LONGTEXT NOT NULL,
    CONSTRAINT `reseña_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `libros`(`book_id`),
    CONSTRAINT `reseña_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`user_id`)
);

DROP TABLE IF EXISTS favoritos;
CREATE TABLE `favoritos`(
    `favorite_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `book_id` INT NOT NULL,
    CONSTRAINT `favoritos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`user_id`),
    CONSTRAINT `favoritos_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `libros`(`book_id`)
);

-- Insert data into the tables
INSERT INTO usuarios (name, lastname1, lastname2, email, password, photo) VALUES 
('Josue','Santamaria','Morales','josue@gmail.com','1234','C:Pictures/foto.jpg');

INSERT INTO genero (genre) VALUES 
('Novela de caballerías'), ('Satírica'), ('Aventuras'), ('Gótico'), 
('Filosófico'), ('Romántico'), ('Drama social'), ('Fábula'), 
('Infantil'), ('Existencialista'), ('Distópico'), ('Moderno'), 
('Tragedia'), ('Épica'), ('Mitología'), ('Novela de iniciación'), 
('Drama psicológico'), ('Histórico'), ('Fantasía');

INSERT INTO preferencias (user_id, genre_id) VALUES 
(1, 1);

INSERT INTO autores (name, lastname1, lastname2) VALUES 
('Miguel', 'de Cervantes', null), ('Oscar', 'Wilde', null), 
('León', 'Tolstói', null), ('Antoine', 'de Saint-Exupéry', null), 
('Franz', 'Kafka', null), ('William', 'Faulkner', null), 
('William', 'Shakespeare', null), ('Margaret', 'Mitchell', null), 
('Homero', null, null), ('John', 'Steinbeck', null), 
('J. D.', 'Salinger', null), ('Emily', 'Brontë', null), 
('F. Scott', 'Fitzgerald', null), ('Khaled', 'Hosseini', null), 
('Lewis', 'Carroll', null), ('George', 'Orwell', null), 
('Ken', 'Follett', null);

INSERT INTO libros (title, author_id, synopsis, genre_id, cover, rating) VALUES 
('Don Quijote de la Mancha', 1, 'Aventuras de un caballero idealista que busca revivir la caballería andante.', 3, 'cover1.jpg', 0),
('El retrato de Dorian Gray', 2, 'Un hombre cuya juventud eterna esconde su corrupción moral.', 4, 'cover2.jpg', 0),
('Ana Karenina', 3, 'Una mujer noble atrapada en una red de relaciones amorosas conflictivas.', 6, 'cover3.jpg', 0),
('El Principito', 4, 'Un pequeño príncipe viaja por varios planetas aprendiendo lecciones de vida.', 8, 'cover4.jpg', 0),
('El proceso', 5, 'Un hombre es arrestado por un delito que desconoce y nunca llega a saber su culpa.', 10, 'cover5.jpg', 0),
('El ruido y la furia', 6, 'Relato de una familia sureña caída en desgracia.', 12, 'cover6.jpg', 0),
('Hamlet', 7, 'Hamlet obligado a esclarecer los motivos que llevaron a la muerte de su padre.', 13, 'cover7.jpg', 0),
('Lo que el viento se llevó', 8, 'Una mujer lucha por sobrevivir en medio de la Guerra Civil estadounidense.', 18, 'cover8.jpg', 0),
('La Odisea', 9, 'El héroe Odiseo enfrenta múltiples desafíos en su viaje de regreso a casa.', 15, 'cover9.jpg', 0),
('Las uvas de la ira', 10, 'Una familia de campesinos lucha por sobrevivir en la Gran Depresión.', 18, 'cover10.jpg', 0),
('El guardián entre el centeno', 11, 'Un joven rebelde atraviesa la confusión de la adolescencia.', 17, 'cover11.jpg', 0),
('Cumbres borrascosas', 12, 'Un amor destructivo entre dos almas apasionadas.', 5, 'cover12.jpg', 0),
('El gran Gatsby', 13, 'Un millonario intenta recuperar el amor de su juventud, pero encuentra la tragedia.', 6, 'cover13.jpg', 0),
('Mil soles espléndidos', 14, 'Dos mujeres afganas encuentran fortaleza en su amistad en medio de la guerra.', 18, 'cover14.jpg', 0),
('Alicia en el país de las maravillas', 15, 'Una niña se adentra en un mundo lleno de fantasía y absurdos.', 19, 'cover15.jpg', 0),
('Rebelión en la granja', 16, 'Los animales de una granja se rebelan contra sus humanos opresores.', 11, 'cover16.jpg', 0),
('Los pilares de la tierra', 17, 'La construcción de una catedral en la Inglaterra medieval entrelaza la vida de varios personajes.', 18, 'cover17.jpg', 0);

INSERT INTO libro_genero (genre_id, book_id) VALUES 
(1, 1), (2, 1), (3, 1), (4, 2), (5, 2), (6, 3), (7, 3), 
(8, 4), (9, 4), (10, 5), (11, 5), (12, 6), (13, 7), 
(14, 9), (15, 9), (16, 11), (17, 11), (18, 10), (19, 15);