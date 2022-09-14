/* Second attempt at improving ETL process using direct csv imports into pg
To run script: psql -U superuser -d sdcratingsnreviews -a -f productsETL.sql
 */
\timing

/* product table ETL */
CREATE temporary table a (id int, productid int, ratings int, date bigint, summary text, body text, recommend boolean, reported boolean, reviewername text, revieweremail text, response text, helpfulness text);

COPY a (id, productid, ratings, date, summary, body, recommend, reported, reviewername, revieweremail, response, helpfulness)
FROM '/Users/geneyang/Documents/HackReactor/RPP/2022_08_01-SDC/ProjectSDC/rpp36-gene-ratings-and-reviews/data/legacy/reviews.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO products(productid)
SELECT productid
from a
ON CONFLICT DO NOTHING;

/* review table ETL */
COPY reviews
FROM '/Users/geneyang/Documents/HackReactor/RPP/2022_08_01-SDC/ProjectSDC/rpp36-gene-ratings-and-reviews/data/legacy/reviews.csv'
DELIMITER ','
CSV HEADER;

/* photos table ETL */
COPY photos
FROM '/Users/geneyang/Documents/HackReactor/RPP/2022_08_01-SDC/ProjectSDC/rpp36-gene-ratings-and-reviews/data/legacy/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

/* characteristics table ETL */
CREATE temporary table b (id int, productid int, name text);

COPY b (id, productid, name)
FROM '/Users/geneyang/Documents/HackReactor/RPP/2022_08_01-SDC/ProjectSDC/rpp36-gene-ratings-and-reviews/data/legacy/characteristics.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO characteristics(id, productid, name)
SELECT id, productid, name
from b WHERE EXISTS(SELECT 1 FROM products WHERE productid = b.productid);

/* characteristicsreviews table ETL */
COPY characteristicsreviews
FROM '/Users/geneyang/Documents/HackReactor/RPP/2022_08_01-SDC/ProjectSDC/rpp36-gene-ratings-and-reviews/data/legacy/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

