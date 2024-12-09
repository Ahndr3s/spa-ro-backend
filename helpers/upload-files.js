const path = require ('path')
const { v4: uuidv4 } = require('uuid');

const uploadFileHelper = (files, allowedExtentions = ["png", "jpg", "jpeg", "gif"], folder='') => {
  return new Promise((resolve, reject) => {
    const { uploadFiles } = files;
    const maimed = uploadFiles.name.split(".");
    const extention = maimed[maimed.length - 1];

    // console.log(files)
    //   VALIDATE EXTENTION
    if (!allowedExtentions.includes(extention)) {
      return reject("The provided file is invalid!!!")
    }

    const tempName = uuidv4() + "." + extention;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);
    

    uploadFiles.mv(uploadPath, (err) => {
      if (err) {return reject( err );}
      resolve(tempName);
    });
  });
};

module.exports = {
    uploadFileHelper,
};
