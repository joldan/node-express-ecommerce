exports.controller404 = (req, res, next) =>{
    // res.status(404).send('<h1>Oooops, we found a place where nothing exists</h1>')
    res.status(404).render('404',{pageTitle : "Page not found", path:''});
    }