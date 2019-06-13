-- Halls

INSERT INTO Halls (name, address, picture_url, description) VALUES ('Velika sportska dvorana', 'Potočka Ul. 27',
'http://www.gradonacelnik.hr/Media/Default/Krizevci/Novi%20parket4%20(1).jpg', 'neki opis sportska dvorana');

INSERT INTO Halls (name, address, picture_url, description) VALUES ('Dvorana Hrvatskog doma', 'Ul. Antuna Gustava Matoša 4', 
'https://www.pou-krizevci.hr/wp-content/uploads/2011/05/velika_01.jpg', 'neki opis hrvatski dom');

INSERT INTO Halls (name, address, picture_url, description) VALUES ('Dvorana Gradske knjižnice', 'Trg Svetog Florijana 14', 
'https://www.krizevci.info/wp-content/uploads/2017/02/Gradska_knjiznica_Franjo_Markovic_izvana.jpg', 'neki opis gradska knjiznica');

INSERT INTO Halls (name, address, picture_url, description) VALUES ('Dvorana TIC (Turistički dom)', 'Trg Josipa Jurja Strossmayera 5', 
'https://www.krizevci.info/wp-content/uploads/2014/09/Bella_Fly_Facebook_sinagoga_obnovljena_dom_mladih_turisticki_informativni_centar.jpg', 'neki opis turisticki dom');

INSERT INTO Halls (name, address, picture_url, description) VALUES ('Konferencijske dvorane RCTP (Razvojni centar i tehnološki park)', 
'Franje Tuđmana 20', 'https://rctp.hr/wp-content/uploads/2018/11/konf-dvorana-2.jpg', 'neki opis tehnoloski centar');

-- Reservations

INSERT INTO Reservations (hall_fk, reservation_title, reservation_description, reservation_status, reservation_date, 
reservation_start_time, reservation_end_time, citizen_full_name, citizen_organization, citizen_email, citizen_phone_number) 
VALUES (5, 'Re-volt party', 'Igranje najkul igrice ikad', '2019-06-15', '19:30', '23:30', 'Matija Jaić', 
'Udruga za najkul igre', 'jaicmatija@gmail.com', '097...');

-- Admins

INSERT INTO Admins (user_name, hashed_password) VALUES ('Ivan Ivanovic', '$2b$10$Qq1kUt5I9iny8EmM2PAbx.NIawSomcr3ejXCh2la00oj.lK2N9uOm');
