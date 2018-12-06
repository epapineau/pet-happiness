-- login from CLI with 
-- psql -U postgres
-- Connect db
-- \c pethappiness

CREATE TABLE pet_id (
    pet_id SERIAL PRIMARY KEY,
    pet_type VARCHAR(100) UNIQUE
);

INSERT INTO pet_id(pet_type) VALUES ('dog');
INSERT INTO pet_id(pet_type) VALUES ('cat');
INSERT INTO pet_id(pet_type) VALUES ('bird');
INSERT INTO pet_id(pet_type) VALUES ('fish');

CREATE TABLE country_id (
    country_id SERIAL PRIMARY KEY,
    world_bank_code VARCHAR(3) UNIQUE,
    country VARCHAR(100) UNIQUE
);

CREATE TABLE pet_population (
    pet_id INT REFERENCES pet_id(pet_id),
    country_id INT REFERENCES country_id(country_id),
    pet_population INT
);

CREATE TABLE world_bank_2017 (
    country_id INT REFERENCES country_id(country_id),
    population BIGINT,
    per_capita_GDP BIGINT,
    percent_urban_pop NUMERIC,
    life_expectancy NUMERIC
);

CREATE TABLE happiness_data (
    country_id INT REFERENCES country_id(country_id), 
    happiness_rank INT,
    hapiness_score NUMERIC
);

CREATE TABLE pet_survey (
    pet_id INT REFERENCES pet_id(pet_id),
    pet_name VARCHAR(100),
    country_id INT REFERENCES country_id(country_id),
    city VARCHAR(100),
    latitude NUMERIC,
    longitude NUMERIC
);