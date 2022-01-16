const Author = require('../databases/author');

module.exports = {
    addNewAuthor: async (authorData)=>{
        const authorRes = await Author.create(authorData);
        return authorRes;
    },
    getAllAuthor: async ()=>{
        const authors =await Author.find({show: true}).exec();
        console.log("author list: ", authors);
        return authors;
    }
}