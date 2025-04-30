-- SQLBook: Code
USE rotten_papers;

DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS book_genre;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;
-- nuevas tablas 
DROP TABLE IF EXISTS shopping_car;
DROP TABLE IF EXISTS shopping_car_books;
DROP TABLE IF EXISTS cards; 
DROP TABLE IF EXISTS tickets; 
DROP TABLE IF EXISTS purchases; 
DROP TABLE IF EXISTS discounts; 



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

-- Se modifico esta tabla agregando stock y price 
CREATE TABLE `books`(
    `book_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `author_id` INT UNSIGNED NOT NULL,
    `synopsis` VARCHAR(255) NOT NULL,
    `genre_id` INT UNSIGNED NOT NULL,
    `cover` VARCHAR(255) NOT NULL,
    `rating` FLOAT(53) NOT NULL,
    `stock` BIGINT NOT NULL,
    `price` FLOAT NOT NULL,
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

-- Creación de nuevas tablas 
CREATE TABLE `shopping_car`(
    `shopping_car_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    CONSTRAINT `shopping_car_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
); 

CREATE TABLE `shopping_car_books`(
    `shopping_car_books_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `shopping_car_id` INT UNSIGNED NOT NULL, 
    `book_id` INT UNSIGNED NOT NULL,
    CONSTRAINT `shopping_car_id_foreign` FOREIGN KEY (`shopping_car_id`) REFERENCES `shopping_car`(`shopping_car_id`),
    CONSTRAINT `book_id_shopping_car_books_foreign` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`)
);


CREATE TABLE `discounts`(
    `discount_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `book_id` INT UNSIGNED NOT NULL, 
    `expiration_date` DATETIME NOT NULL,
    `amount` BIGINT UNSIGNED NOT NULL, 
    CONSTRAINT `discount_book_foreign` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`)
);

CREATE TABLE `cards`(
    `card_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `card_number` VARCHAR(255) NOT NULL,
    `bank` VARCHAR(255) NOT NULL,
    `owner` VARCHAR(255) NOT NULL,
    `cvv` VARCHAR(255) NOT NULL,
    `expiration_date` DATE NOT NULL, 
    CONSTRAINT `card_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
); 

CREATE TABLE `tickets`(
    `ticket_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `date` DATETIME NOT NULL,
    `total` FLOAT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    CONSTRAINT `ticket_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);  

CREATE TABLE `purchases`(
    `purchase_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` INT UNSIGNED NOT NULL,
    `book_id` INT UNSIGNED NOT NULL,
    `discount_applied` BIGINT NOT NULL,
    CONSTRAINT `ticket_purchase_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`ticket_id`),
    CONSTRAINT `book_purchase_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`)
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


-- se modifico el insert de acuerdo a os nuevo camposs en la tabla 
INSERT INTO books (title, author_id, synopsis, genre_id, cover, rating, stock, price) VALUES 
('Don Quijote de la Mancha', 1, 'Aventuras de un caballero idealista que busca revivir la caballería andante.', 3, 'cover1.jpg', 5, 10, 299.00),
('El retrato de Dorian Gray', 2, 'Un hombre cuya juventud eterna esconde su corrupción moral.', 4, 'cover2.jpg', 4, 15, 189.00),
('Ana Karenina', 3, 'Una mujer noble atrapada en una red de relaciones amorosas conflictivas.', 6, 'cover3.jpg', 4, 8, 349.00),
('El Principito', 4, 'Un pequeño príncipe viaja por varios planetas aprendiendo lecciones de vida.', 8, 'cover4.jpg', 5, 20, 150.00),
('El proceso', 5, 'Un hombre es arrestado por un delito que desconoce y nunca llega a saber su culpa.', 10, 'cover5.jpg', 3, 12, 220.00),
('El ruido y la furia', 6, 'Relato de una familia sureña caída en desgracia.', 11, 'cover6.jpg', 1, 6, 280.00),
('Hamlet', 7, 'Hamlet obligado a esclarecer los motivos que llevaron a la muerte de su padre.', 13, 'cover7.jpg', 2, 9, 175.00),
('Lo que el viento se llevó', 8, 'Una mujer lucha por sobrevivir en medio de la Guerra Civil estadounidense.', 18, 'cover8.jpg', 5, 5, 399.00),
('La Odisea', 9, 'El héroe Odiseo enfrenta múltiples desafíos en su viaje de regreso a casa.', 15, 'cover9.jpg', 3, 14, 249.00),
('Las uvas de la ira', 10, 'Una familia de campesinos lucha por sobrevivir en la Gran Depresión.', 18, 'cover10.jpg', 4, 7, 310.00),
('El guardián entre el centeno', 11, 'Un joven rebelde atraviesa la confusión de la adolescencia.', 17, 'cover11.jpg', 5, 18, 199.00),
('Cumbres borrascosas', 12, 'Un amor destructivo entre dos almas apasionadas.', 5, 'cover12.jpg', 2, 10, 275.00),
('El gran Gatsby', 13, 'Un millonario intenta recuperar el amor de su juventud, pero encuentra la tragedia.', 6, 'cover13.jpg', 1, 11, 290.00),
('Mil soles espléndidos', 14, 'Dos mujeres afganas encuentran fortaleza en su amistad en medio de la guerra.', 18, 'cover14.jpg', 1, 8, 330.00),
('Alicia en el país de las maravillas', 15, 'Una niña se adentra en un mundo lleno de fantasía y absurdos.', 19, 'cover15.jpg', 5, 25, 160.00),
('Rebelión en la granja', 16, 'Los animales de una granja se rebelan contra sus humanos opresores.', 11, 'cover16.jpg', 2, 13, 210.00),
('Los pilares de la tierra', 17, 'La construcción de una catedral en la Inglaterra medieval entrelaza la vida de varios personajes.', 18, 'cover17.jpg', 3, 9, 450.00);


 
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

update books set cover = 'https://www.marcialpons.es/media/img/portadas/2023/4/18/9788408270881jfif' where author_id = 1;
update books set cover = 'https://www.udllibros.com/imagenes/9788494/978849490630.JPG' where author_id = 2;
update books set cover = 'https://1.bp.blogspot.com/-fnWJBX6WwF0/VKeVYB6C3xI/AAAAAAAAB5Y/u7KVFfL5cDE/s1600/portada-anna-karenina.jpg' where author_id = 3;
update books set cover = 'https://www.planetadelibros.com.pe/usuaris/libros/fotos/252/original/portada_el-principito_antoine-de-saint-exupery_201703281853.jpg' where author_id = 4;
update books set cover = 'https://m.media-amazon.com/images/I/516hWPJbM4L.jpg' where author_id = 5;
update books set cover = 'https://imagessl8.casadellibro.com/a/l/t7/88/9788490628188.jpg' where author_id = 6;
update books set cover = 'https://i0.wp.com/www.epubgratis.org/wp-content/uploads/2015/02/Hamlet-William-Shakespeare-portada.jpg?fit=683%2C1024&ssl=1' where author_id = 7;
update books set cover = 'https://imagessl0.casadellibro.com/a/l/t0/50/9788496778450.jpg' where author_id = 8;
update books set cover = 'https://1.bp.blogspot.com/-Zcm4iTwFe1E/X8Eg053VhmI/AAAAAAAAAJw/fHaw95b8uis8HsS-MOj4jOqAfZv2maA0gCNcBGAsYHQ/s1500/LA%2BODISEA.jpg' where author_id = 9;
update books set cover = 'https://tse1.mm.bing.net/th?id=OIP.zIQEKVs0PRt67CIU0xoMsAHaLN&pid=Api' where author_id = 10;
update books set cover = 'https://i.pinimg.com/736x/5e/59/4a/5e594a4ebc8154796dcfc0167dc00f02.jpg' where author_id = 11;
update books set cover = 'https://mestasediciones.com/wp-content/uploads/2020/06/C61-Cumbres-borrascosas.jpg' where author_id = 12;
update books set cover = 'https://imagessl7.casadellibro.com/a/l/t0/77/9788420689777.jpg' where author_id = 13;
update books set cover = 'http://2.bp.blogspot.com/-pw1GPhWhKPI/UZDzbpsQQ_I/AAAAAAAAA4k/IkYw54JcZSU/s1600/mil+soles.jpg' where author_id = 14;
update books set cover = 'https://2.bp.blogspot.com/-dH0ax_YE0Iw/WWkTgb-RnYI/AAAAAAAAC6Q/71_ywbeDmEEya0E2-qM00WVnmTyakfuKgCLcBGAs/s1600/978-987-718-482-2_1.png' where author_id = 15;
update books set cover = 'https://pendulo.com/imagenes_grandes/9788466/978846634635.GIF' where author_id = 16;
update books set cover = 'https://tse4.mm.bing.net/th?id=OIP.G_tS6cMXzR0JgkQPu6xEjQAAAA&pid=Api' where author_id = 17;

-- Nuevos inserts 

INSERT INTO shopping_car (user_id) VALUES 
(1),
(2),
(3),
(4),
(5);

INSERT INTO shopping_car_books (shopping_car_id, book_id) VALUES
(1, 1), 
(1, 3),
(2, 2),
(2, 4),
(3, 5),
(4, 6),
(5, 7);

INSERT INTO discounts (book_id, expiration_date, amount) VALUES
(1, '2025-12-31 23:59:59', 20),
(2, '2025-11-30 23:59:59', 15),
(3, '2025-10-15 23:59:59', 10),
(4, '2025-09-30 23:59:59', 25),
(5, '2025-08-31 23:59:59', 30);

INSERT INTO cards (user_id, card_number, bank, owner, cvv, expiration_date) VALUES
(1, '1234567890123456', 'Banorte', 'Josue Santamaria', '123', '2026-08-15'),
(2, '9876543210987654', 'BBVA', 'Viridiana Benitez', '456', '2027-05-20'),
(3, '1122334455667788', 'Santander', 'Mariel Cervantes', '789', '2026-11-30'),
(4, '2233445566778899', 'HSBC', 'Fernando Quiroz', '012', '2025-10-12'),
(5, '3344556677889900', 'Scotiabank', 'Gabriel Romero', '345', '2027-01-05');

INSERT INTO tickets (user_id, date, total, address) VALUES
(1, '2025-03-01 10:15:00', 598.00, 'Calle Ficticia 123'),
(2, '2025-03-02 14:25:00', 457.50, 'Avenida Real 456'),
(3, '2025-03-03 16:40:00', 715.00, 'Bulevar Principal 789'),
(4, '2025-03-04 11:50:00', 305.00, 'Calle Libertad 101'),
(5, '2025-03-05 19:00:00', 420.00, 'Calle Reforma 202');

INSERT INTO purchases (ticket_id, book_id, discount_applied) VALUES
(1, 1, 20),
(1, 3, 15),
(2, 2, 10),
(2, 4, 25),
(3, 5, 30),
(4, 6, 10),
(5, 7, 15);
