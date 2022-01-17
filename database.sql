CREATE DATABASE Prezent;

CREATE TABLE karyawan(
  id SERIAL PRIMARY KEY,
  nama VARCHAR(150),
  nik VARCHAR(15),
  email VARCHAR(50),
  notelp VARCHAR(50),
  tgl_lahir date,
  jenis_kelamin VARCHAR(2),
  company VARCHAR(50),
  profile_pics VARCHAR(255)
);

CREATE TABLE image_files(
    id SERIAL NOT NULL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    filepath TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size BIGINT NOT NULL,
);