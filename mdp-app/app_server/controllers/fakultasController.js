const axios = require("axios");

const index = async (req, res) => {
    try {
        // mendapatkan data fakultas dari API eksternal
        const response = await axios.get(
            "http://localhost:3000/api/fakultas"
        );

        const fakultas = response.data;

        res.render("fakultas", {
            title: "Halaman Fakultas",
            fakultas,
            layout: "main",
        });
    }catch (error)  {
        console.error(error.mesage);
        res.status(500).send("Gagal mendapatkan data fakultas dari api");
    }
};

const store = async (req, res) => {
    const { nama, singkatan } = req.body;
    try {
      const response = await fetch(
            "http://localhost:3000/api/fakultas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nama, singkatan }),
        }
      );
  
      if (response.ok) {
        res.redirect("/fakultas"); // Redirect ke halaman fakultas setelah berhasil menambah
      } else {
        res.status(500).send("Gagal menambahkan data fakultas.");
      }
    } catch (error) {
      res.status(500).send("Error menambahkan data fakultas");
    }
  };

module.exports = {index, store};