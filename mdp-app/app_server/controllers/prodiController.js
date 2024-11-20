const prodi = (req, res) => {
    const programstudi =[
        {NamaProdi: "Sistem Informasi", Fakultas: "FIKR", Singkatan: "SI"},
        {NamaProdi: "Informatika", Fakultas: "FIKR", Singkatan: "IF"},
        {NamaProdi: "Teknik Elektro", Fakultas: "FIKR", Singkatan: "TE"},
        {NamaProdi: "Manajemen Informatika", Fakultas: "FIKR",Singkatan: "MI"},
        {NamaProdi: "Manajemen", Fakultas: "FEB", Singkatan: "MJ"},
        {NamaProdi: "Akuntasi", Fakultas: "FEB", Singkatan: "AK"}
    ];
    res.render('prodi',{title: 'halaman prodi',programstudi,layout:'main'});
};

module.exports = {prodi}