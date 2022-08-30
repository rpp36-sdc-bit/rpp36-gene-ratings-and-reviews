/*
  Use this script to delete all added review entries created since initial legacy dataset.
  To run, navigate to dir and run the following:
    psql -U me -d sdcratingsnreviews -a -f testdelete.sql
*/

DELETE from photos where id > 2742540;
DELETE from characteristicsreviews where id > 19327575;
DELETE from reviews where id > 5774952;
ALTER SEQUENCE review_serial RESTART with 5774953;
ALTER SEQUENCE photos_serial RESTART with 2742541;
ALTER SEQUENCE characteristicsreviews_serial RESTART with 19327576;