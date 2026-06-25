-- Crea una base de datos separada para la suite de tests del backend, para
-- que `pytest` (que hace create_all/drop_all) nunca toque los datos de la
-- base de datos de desarrollo/producción.
CREATE DATABASE canis_test;
