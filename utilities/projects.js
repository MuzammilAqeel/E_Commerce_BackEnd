const fs = require('fs')
// path.resolve("./")

exports.shapeProject = (body, files) => {
    var gallery = [];
    files.forEach(file => {
        gallery.push(`/files/${file.filename}`);
    });
    body.fileData = gallery;
    return body;
};

exports.deleteFiles = (files) =>{
    // console.log(global.__basedir = __dirname;)
    files.map((item) => {
        fs.unlinkSync(`./public${item}`)
    })
}