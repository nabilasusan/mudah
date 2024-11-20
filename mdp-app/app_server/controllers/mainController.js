const index = (req, res) => {
    const berita =[
        {
            judul: "berita 1",
            isi: "isi berita 1"
            
        },
        {
            judul: "berita 2",
            isi: "isi berita 2"
        }
    ];
    res.render('home',{title: 'halaman home',berita, layout:'main'});
}

const about = (req, res) => {
    res.render('about',{title: 'halaman about', layout:'main'});
}

const contact = (req, res) => {
    res.render('contact',{title: 'halaman contact', layout:'main'});
};

const use = ("/",(req, res)=>{
    res.send("<h1>404 Not Found</h1>");
});
module.exports = {index,about,contact,use}