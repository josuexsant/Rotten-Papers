USE rotten_papers;

DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS book_genre;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;

CREATE TABLE `users`(
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `lastname1` VARCHAR(255) NOT NULL,
    `lastname2` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(255) NOT NULL
);

CREATE TABLE `genres`(
    `genre_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `genre` VARCHAR(255) NOT NULL
);

CREATE TABLE `preferences`(
    `preference_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `genre_id` INT UNSIGNED NOT NULL,
    CONSTRAINT `preferences_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
    CONSTRAINT `preferences_genre_id_foreign` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`)
);

CREATE TABLE `authors`(
    `author_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `lastname1` VARCHAR(255),
    `lastname2` VARCHAR(255)
);

CREATE TABLE `books`(
    `book_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `author_id` INT UNSIGNED NOT NULL,
    `synopsis` VARCHAR(255) NOT NULL,
    `genre_id` INT UNSIGNED NOT NULL,
    `cover` VARCHAR(255) NOT NULL,
    `rating` FLOAT(53) NOT NULL,
    CONSTRAINT `books_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `authors`(`author_id`),
    CONSTRAINT `books_genre_id_foreign` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`)
);

CREATE TABLE `book_genre`(
    `genreB_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `genre_id` INT UNSIGNED NOT NULL,
    `book_id` INT UNSIGNED NOT NULL,
    CONSTRAINT `book_genre_genre_id_foreign` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`),
    CONSTRAINT `book_genre_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`)
);

CREATE TABLE `reviews`(
    `review_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `book_id` INT UNSIGNED NOT NULL,
    `rating` INT NOT NULL,
    `review` LONGTEXT NOT NULL,
    CONSTRAINT `reviews_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`),
    CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

CREATE TABLE `favorites`(
    `favorite_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `book_id` INT UNSIGNED NOT NULL,
    CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
    CONSTRAINT `favorites_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`)
);


INSERT INTO users (name,lastname1,lastname2,email,password,photo) VALUES 
('Josue','Santamaria','Morales','josue@gmail.com','1234','C:Pictures\foto.jpg');


INSERT INTO users(name, lastname1, lastname2, email, password,photo) VALUES
('Viridiana','Benitez','Gonzalez', 'viri@gmail.com', '1234','C:Pictures\foto.jpg'),
('Mariel','Cervantes','Hernandez', 'mariel@gmail.com', '1234','C:Pictures\foto.jpg'),
('Fernando','Quiroz','Castillo', 'fer@gmail.com', '1234','C:Pictures\foto.jpg'),
('Gabriel','Romero','Luna', 'gabriel@gmail.com', '1234','C:Pictures\foto.jpg'),
('Jennifer','Hidalgo','Castro', 'jenni@gmail.com', '1234','C:Pictures\foto.jpg');






INSERT INTO genres (genre) VALUES 
('Novela de caballerías'),
('Satírica'),
('Aventuras'),
('Gótico'),
('Filosófico'),
('Romántico'),
('Drama social'),
('Fábula'),
('Infantil'),
('Existencialista'),
('Distópico'),
('Moderno'),
('Tragedia'),
('Épica'),
('Mitología'),
('Novela de iniciación'),
('Drama psicológico'),
('Histórico'),
('Fantasía');

INSERT INTO preferences (user_id,genre_id) VALUES 
(1,1);

INSERT INTO authors (name,lastname1,lastname2) VALUES 
('Miguel', 'de Cervantes', null),
('Oscar', 'Wilde', null),
('León', 'Tolstói', null),
('Antoine', 'de Saint-Exupéry', null),
('Franz', 'Kafka', null),
('William', 'Faulkner', null),
('William', 'Shakespeare', null),
('Margaret', 'Mitchell', null),
('Homero', null, null),
('John', 'Steinbeck', null),
('J. D.', 'Salinger', null),
('Emily', 'Brontë', null),
('F. Scott', 'Fitzgerald', null),
('Khaled', 'Hosseini', null),
('Lewis', 'Carroll', null),
('George', 'Orwell', null),
('Ken', 'Follett', null);

INSERT INTO books (title,author_id,synopsis,genre_id,cover,rating) VALUES 
('Don Quijote de la Mancha', 1, 'Aventuras de un caballero idealista que busca revivir la caballería andante.', 3, 'cover1.jpg', 0),
('El retrato de Dorian Gray', 2, 'Un hombre cuya juventud eterna esconde su corrupción moral.', 4, 'cover2.jpg', 0),
('Ana Karenina', 3, 'Una mujer noble atrapada en una red de relaciones amorosas conflictivas.', 6, 'cover3.jpg', 0),
('El Principito', 4, 'Un pequeño príncipe viaja por varios planetas aprendiendo lecciones de vida.', 8, 'cover4.jpg', 0),
('El proceso', 5, 'Un hombre es arrestado por un delito que desconoce y nunca llega a saber su culpa.', 10, 'cover5.jpg', 0),
('El ruido y la furia', 6, 'Relato de una familia sureña caída en desgracia.', 11, 'cover6.jpg', 0),
('Hamlet', 7, 'Hamlet obligado a esclarecer los motivos que llevaron a la muerte de su padre.', 13, 'cover7.jpg', 0),
('Lo que el viento se llevó', 8, 'Una mujer lucha por sobrevivir en medio de la Guerra Civil estadounidense.', 18, 'cover8.jpg',0),
('La Odisea', 9, 'El héroe Odiseo enfrenta múltiples desafíos en su viaje de regreso a casa.', 15, 'cover9.jpg', 0),
('Las uvas de la ira', 10, 'Una familia de campesinos lucha por sobrevivir en la Gran Depresión.', 18, 'cover10.jpg', 0),
('El guardián entre el centeno', 11, 'Un joven rebelde atraviesa la confusión de la adolescencia.', 17, 'cover11.jpg', 0),
('Cumbres borrascosas', 12, 'Un amor destructivo entre dos almas apasionadas.', 5, 'cover12.jpg', 0),
('El gran Gatsby', 13, 'Un millonario intenta recuperar el amor de su juventud, pero encuentra la tragedia.', 6, 'cover13.jpg', 0),
('Mil soles espléndidos', 14, 'Dos mujeres afganas encuentran fortaleza en su amistad en medio de la guerra.', 18, 'cover14.jpg', 0),
('Alicia en el país de las maravillas', 15, 'Una niña se adentra en un mundo lleno de fantasía y absurdos.', 19, 'cover15.jpg', 0),
('Rebelión en la granja', 16, 'Los animales de una granja se rebelan contra sus humanos opresores.', 11, 'cover16.jpg', 0),
('Los pilares de la tierra', 17, 'La construcción de una catedral en la Inglaterra medieval entrelaza la vida de varios personajes.', 18, 'cover17.jpg', 0);

 
INSERT INTO book_genre (genre_id, book_id) VALUES 
(1, 1),  
(2, 1),  
(3, 1),  
(4, 2),  
(5, 2),  
(6, 3),  
(7, 3),  
(8, 4),  
(9, 4),  
(10, 5), 
(11, 5), 
(12, 6), 
(13, 7), 
(14, 9), 
(15, 9), 
(16, 11), 
(17, 11), 
(18, 10), 
(19, 15); 

INSERT INTO favorites(user_id,book_id) VALUES
(1,1),(1,2),(1,3),(1,4),(2,5),(2,6),(2,7),(2,8),(3,9),(3,10),(3,11),(3,12),(4,13),(4,14),(4,15),(4,16),(5,17),(5,1),(5,2),(5,3),(6,4),(6,5),(6,6),(6,7);