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

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  productid SERIAL PRIMARY KEY,
  totalreviews int,
  ratings1 int,
  ratings2 int,
  ratings3 int,
  ratings4 int,
  ratings5 int,
  recommendfalse int,
  recommendtrue int
);

DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  productid int,
  ratings int,
  date bigint,
  summary text,
  body text,
  recommend boolean,
  reported boolean,
  reviewername text,
  revieweremail text,
  response text,
  helpfulness int,
  FOREIGN KEY (productid) REFERENCES products (productid)
);

DROP TABLE IF EXISTS photos CASCADE;
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  reviewid int,
  url text,
  FOREIGN KEY (reviewid) REFERENCES reviews (id)
);

DROP TABLE IF EXISTS characteristics CASCADE;
CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  productid int,
  name text,
  rating numeric,
  FOREIGN KEY (productid) REFERENCES products (productid)
);

DROP TABLE IF EXISTS characteristicsreviews CASCADE;
CREATE TABLE characteristicsreviews (
  id SERIAL PRIMARY KEY,
  characteristicid int,
  reviewid int,
  value int,
  FOREIGN KEY (characteristicid) REFERENCES characteristics (id),
  FOREIGN KEY (reviewid) REFERENCES reviews (id)
);

CREATE INDEX products_id_index ON products (productid);
CREATE INDEX reviews_id_index ON reviews (id);
CREATE INDEX reviews_productid_index ON reviews (productid);
CREATE INDEX photos_reviewid_index ON photos (reviewid);
CREATE INDEX characteristics_id_index ON characteristics (id);
CREATE INDEX characteristics_productid_index ON characteristics (productid);
CREATE INDEX characteristicsreviews_characteristicid_index ON characteristicsreviews (characteristicid);