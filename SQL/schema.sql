CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    fullname character varying(100),
    phone character varying(200),
    email character varying(100),
    experience character varying(100),
    datestarted character varying(100),
    adminstatus character varying(100),
    course_id integer REFERENCES yourcourse(id),
    password character varying(500)
);

CREATE TABLE spraychart (
    id SERIAL PRIMARY KEY,
    dateapplied character varying(100),
    employee_id integer REFERENCES employee(id),
    holestreated character varying(1000),
    lengthofcuttreated character varying(1000),
    chemicalsbeingused text,
    rateapplied character varying(100),
    totalgallons character varying(100),
    sprayrig character varying(1000),
    pestordiseasecontrolled character varying(1000)
);

CREATE TABLE yourcourse (
    id SERIAL PRIMARY KEY,
    clubname character varying(200),
    admin character varying(100),
    employees character varying(200),
    city character varying(200),
    state character varying(200)
);

CREATE TABLE jobboard (
    id SERIAL PRIMARY KEY,
    jobtype integer REFERENCES jobtype(id),
    employee integer REFERENCES employee(id),
    comments text,
    date character varying(100)
);
CREATE TABLE jobtype (
    id SERIAL PRIMARY KEY,
    job character varying(200),
    instructions character varying(200)
);


