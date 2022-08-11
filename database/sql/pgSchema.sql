/*
in order to run this .sql file in cli,
  1. first create sdcratingsnreviews database if not created already
  2. navigate to dir and run the following:
    psql -U me -d sdcratingsnreviews -a -f pgSchema.sql
  3. to check datatables, connect to the db:
    psql -d sdcratingsnreviews -U me
    \dt
    \d products
    \dreviews (etc...)
*/

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id int NOT NULL PRIMARY KEY,
  totalreviews int,
  ratings int,
  ratings1 int,
  ratings2 int,
  ratings3 int,
  ratings4 int,
  ratings5 int,
  recommendfalse int,
  recommendtrue int
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id int NOT NULL PRIMARY KEY,
  productid int,
  ratings int,
  summary text,
  recommend boolean,
  response text,
  body text,
  date date,
  reviewername text,
  helpfulness int,
  photos int,
  FOREIGN KEY (productid) REFERENCES products (id)
);

DROP TABLE IF EXISTS photos;
CREATE TABLE photos (
  id int NOT NULL PRIMARY KEY,
  reviewid int,
  url text,
  FOREIGN KEY (reviewid) REFERENCES reviews (id)
);

DROP TABLE IF EXISTS characteristics;
CREATE TABLE characteristics (
  id int NOT NULL PRIMARY KEY,
  productid int,
  name text,
  rating numeric,
  FOREIGN KEY (productid) REFERENCES products (id)
);

DROP TABLE IF EXISTS characteristicsreviews;
CREATE TABLE characteristicsreviews (
  id int NOT NULL PRIMARY KEY,
  characteristicid int,
  reviewid int,
  value int,
  FOREIGN KEY (characteristicid) REFERENCES characteristics (id),
  FOREIGN KEY (reviewid) REFERENCES reviews (id)
);