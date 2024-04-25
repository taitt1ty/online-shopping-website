CREATE TABLE sections (
	id int PRIMARY KEY AUTO_INCREMENT, 
    image text,
    title varchar(255),
    content text
);

create table feedbacks (
	id int PRIMARY KEY AUTO_INCREMENT, 
    name varchar(255),
    note varchar(255),
    content text
);

create table Setting (
	id int PRIMARY KEY AUTO_INCREMENT, 
    name varchar(255),
    title varchar(255),
    content text
);

insert into sections(image,title,content)
values ("https://i.imgur.com/xWHoqnV.png",
"Welcome To Our <br> Gift Shop",
"Sequi perspiciatis nulla reiciendis, rem, tenetur impedit, eveniet non necessitatibus error distinctio mollitia suscipit. Nostrum fugit doloribus consequatur distinctio esse, possimus maiores aliquid repellat beatae cum, perspiciatis enim, accusantium perferendis."),
("https://i.imgur.com/xWHoqnV.png",
"Welcome To Our <br> Gift Shop",
"Sequi perspiciatis nulla reiciendis, rem, tenetur impedit, eveniet non necessitatibus error distinctio mollitia suscipit. Nostrum fugit doloribus consequatur distinctio esse, possimus maiores aliquid repellat beatae cum, perspiciatis enim, accusantium perferendis."),
("https://i.imgur.com/xWHoqnV.png",
"Welcome To Our <br> Gift Shop",
"Sequi perspiciatis nulla reiciendis, rem, tenetur impedit, eveniet non necessitatibus error distinctio mollitia suscipit. Nostrum fugit doloribus consequatur distinctio esse, possimus maiores aliquid repellat beatae cum, perspiciatis enim, accusantium perferendis."),
("https://i.imgur.com/qe8PRu0.png",
"BEST SAVING ON <br> NEW ARRIVALS",
"Sequi perspiciatis nulla reiciendis, rem, tenetur impedit, eveniet non necessitatibus error distinctio mollitia suscipit. Nostrum fugit doloribus consequatur distinctio esse, possimus maiores aliquid repellat beatae cum, perspiciatis enim, accusantium perferendis."),
("https://i.imgur.com/r5U6YRe.png",
"GIFTS FOR YOUR <br> LOVED ONES",
"Sequi perspiciatis nulla reiciendis, rem, tenetur impedit, eveniet non necessitatibus error distinctio mollitia suscipit. Nostrum fugit doloribus consequatur distinctio esse, possimus maiores aliquid repellat beatae cum, perspiciatis enim, accusantium perferendis.");
 
insert into feedbacks (name, note, content) 
values ("Morijorch","Default model text","editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Variouseditors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Variouseditors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various"),
("Brad Johns","Default model text","Variouseditors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy, editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Variouseditors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various"),
("Rochak","Default model text","editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Variouseditors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Variouseditors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.");

insert into Setting (name, title, content)
values ("about","ABOUT US","Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,"),
("help","NEED HELP","Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,"),
("contact","CONTACT US","Gb road 123 London UK"),
("contact","CONTACT US","+01 12345678901"),
("contact","CONTACT US","demo@gmail.com");


