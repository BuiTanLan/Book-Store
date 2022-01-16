const BookModel = require('../models/book.model')

module.exports = {
    getHomePage: async (req, res, next)=>{
        const featuredBooksData = await BookModel.getBooksByOptions({sort: {views: "desc"}});
        const latedBooksData = await  BookModel.getBooksByOptions({sort: {date: "desc"}});
        
        res.render('index', {title: 'Bookland', featuredBooks: featuredBooksData.docs, latedBooks: latedBooksData.docs});
    },
    getLoginPage: (req, res, next) => res.redirect('/users/login'),
    getRegisterPage: (req, res, next) => res.redirect('/users/register'),
    getWrongPage: (req, res, next) => res.render('error', {message: "URL not found!"}),
}