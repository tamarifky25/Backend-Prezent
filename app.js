const express = require('express');
//const { Pool } = require('pg');
const app = express();
const pool = require("./db");
const {v4: uuidv4} = require('uuid');
const multer = require('multer');
const dateformat = require('dateformat');

app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, dateformat(new Date(), 'dddd-mm-yyyy hh.MM.ss') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null. false);
  }
  
};

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 30
}});

app.use(express.json()) // => req.body

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
})
//ROUTES//

//get all todo

//get a Prezent

app.get("/karyawan", async (req, res) => {
  try {
    const newTodo = await pool.query(
      "SELECT id, nama,nik,email,notelp,tgl_lahir,jenis_kelamin,alamat FROM karyawan"
      
    );

    return res.json(newTodo);
  } catch (err) {
    res.json(err.message);
  }
});


//create a Prezent

app.put("/karyawan", async (req, res) => {

  console.log('\nbody', req.body)
   
    const {id,nama,nik,email,notelp,tgl_lahir,jenis_kelamin,alamat } = req.body;
    pool.query(
      `UPDATE karyawan
        SET
          nama = ($1), 
          nik = ($2),
          email = ($3),
          notelp = ($4),
          tgl_lahir = ($5),
          jenis_kelamin = ($6),
          alamat = ($7)
        WHERE id = ($8)
        RETURNING *`,
      [nama,nik,email,notelp,tgl_lahir,jenis_kelamin,alamat,id]
    ) .then(result => {
      console.log ('admin', result.rows)
      const karyawan = result.rows;

      
      return res.json(karyawan);

  
  
    }).catch(err => {
      console.error(err.message);
    })

});

//update a Prezent

// Create Register

app.post('/register', async (req, res) => {
  
  console.log('\nbody',req.body)
  const {nama,email,password,id} = req.body;
  // Cek Account Available
  pool.query(
    "SELECT * FROM karyawan WHERE email = ($1)", [email]
  ).then(result => {
    console.log ('user', result.rows)
    const karyawan = result.rows;
    const id = uuidv4();

    if(karyawan.length !== 0){
      return res.status(400).json({error: 'Email/password sudah digunakan'})

    }
      pool.query(
        "INSERT INTO karyawan (id, nama, email, password) VALUES (($1), ($2), ($3), ($4)) RETURNING nama,email", 
        [id,nama,email,password]
      ).then(result => {
        console.log ('karyawan', result.rows)
        const karyawan = result.rows;

      if(karyawan.length !== 0){
        return res.json(karyawan);
      }
  
  
    }).catch(err => {
      console.error(err.message);
    })   

  }).catch(err => {
    console.error(err.message);
  })

});

//delete a Prezent

// Create Camera
app.post("/camera", upload.single('foto'), (req, res, next) => {
  console.log(req.file);
  const {tanggal,keterangan,masuk,keluar,foto,lokasi} = req.body;
  pool.query(
    "INSERT INTO informasi (tanggal,keterangan,masuk,keluar,foto,lokasi) VALUES (($1), ($2), ($3), ($4), ($5), ($6))",
    [tanggal,keterangan,masuk,keluar,req.file.path,lokasi]
    ).then(result => {
      console.log ('tabel_kehadiran', result.rows)
      const tabel_kehadiran = result.rows;
      return res.json(tabel_kehadiran);
    }).catch(err => {
      console.error(err.message);
    })  
  
});


// Create Tabel Kehadiran
app.post("/tabel_kehadiran", upload.single('foto'), (req, res, next) => {
  console.log(req.file);
  const {tanggal,keterangan,masuk,keluar,foto,lokasi} = req.body;
  pool.query(
    "INSERT INTO informasi (tanggal,keterangan,masuk,keluar,foto,lokasi) VALUES (($1), ($2), ($3), ($4), ($5), ($6))",
    [tanggal,keterangan,masuk,keluar,req.file.path,lokasi]
    ).then(result => {
      console.log ('tabel_kehadiran', result.rows)
      const tabel_kehadiran = result.rows;
      return res.json(tabel_kehadiran);
    }).catch(err => {
      console.error(err.message);
    })  
  
});

//Get Data Tabel Kehadiran
app.get('/tabel_kehadiran', (req, res, next) => {

  pool.query(
    "SELECT * FROM tabel_kehadiran"
  ).then(result => {
    console.log ('tabel_kehadiran', result.rows)
    const tabel_kehadiran = result.rows;
    res.status(200).json(tabel_kehadiran);


  }).catch(err => {
    console.error(err.message);
  })  
  
});


// Create Pengajuan
app.post("/pengajuan", upload.single('unggah_bukti,bukti_lain'), (req, res, next) => {
  console.log(req.file);
  const {tgl_izin,sampai_tgl,keterangan,deskripsi,unggah_bukti,bukti_lain,tanggal,status,total_absen,dokumen} = req.body;
  pool.query(
    "INSERT INTO pengajuan (tgl_izin, sampai_tgl, keterangan, deskripsi, unggah_bukti, bukti_lain, tanggal, status, total_absen, dokumen) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9))",
    [tgl_izin,sampai_tgl,keterangan,deskripsi,req.file.path,tanggal,status,total_absen,dokumen]
  ).then(result => {
    console.log ('pengajuan', result.rows)
    const pengajuan = result.rows;
    res.status(200).json({success: 'Pengajuan berhasil dimasukkan'})
  })

})

// Get Data Pengajuan
app.get('/pengajuan', (req, res, next) => {

  pool.query(
    "SELECT * FROM pengajuan"
  ).then(result => {
    console.log ('pengajuan', result.rows)
    const pengajuan = result.rows;
    res.status(200).json(pengajuan);


  }).catch(err => {
    console.error(err.message);
  })  
  
});

// Create Informasi
app.post("/informasi", upload.single('unggah_foto'), (req, res, next) => {
  console.log(req.file);
  const {judul_informasi,deskripsi,unggah_foto} = req.body;
  pool.query(
    "INSERT INTO informasi (judul_informasi, deskripsi, unggah_foto) VALUES (($1), ($2), ($3))",
    [judul_informasi,deskripsi,req.file.path]
    ).then(result => {
      console.log ('informasi', result.rows)
      const informasi = result.rows;
      res.status(200).json({success: 'Informasi berhasil dimasukkan'})

    }).catch(err => {
      console.error(err.message);
    })  
  
});

// Get Data Informasi
app.get('/informasi', (req, res, next) => {

  pool.query(
    "SELECT * FROM informasi"
  ).then(result => {
    console.log ('informasi', result.rows)
    const informasi = result.rows;
    res.status(200).json(informasi);


  }).catch(err => {
    console.error(err.message);
  })  
  
});

// Create Login

app.post("/login", async (req, res) => {

  console.log('\nbody',req.body)
  const {email,password} = req.body;
  // try{
  //   const user = await
  pool.query(
    "SELECT * FROM karyawan WHERE email = ($1)", [email]
  ).then(result => {
    console.log ('user', result.rows)
    const karyawan = result.rows;

    if(karyawan.length !== 0){
      if(password === karyawan[0].password){
        return res.json({email: karyawan[0].email})
      }
      return res.status(400).json({error: 'Email/password tidak sesuai'})

    }
    
      // get admin
      pool.query(
        "SELECT * FROM admin WHERE email = ($1)", [email]
      ).then(result => {
        console.log ('admin', result.rows)
        const admin = result.rows;

        if(admin.length !== 0){
          if (password === admin [0].password) return res.json({email: admin [0].email})
          return res.status(400).json({error: 'Email/password tidak sesuai'});

        }
    
    
      }).catch(err => {
        console.error(err.message);
      })



  }).catch(err => {
    console.error(err.message);
  })
});


app.listen(5000, () => { 
  console.log("server is listening on port 5000"); 
});