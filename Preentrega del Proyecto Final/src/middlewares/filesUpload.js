import multer from 'multer'
import __dirname from '../utils.js';
import path from 'path'


export const validateFields = (body) => {
    const { first_name, email, password } = body;
    if (!first_name || !email || !password ){
        return false;
    } else {
        return true;
    }
}

const multerFilterProfile = (req, file, cb) => {
    const isValid = validateFields(req.body);
    isValid ? cb(null, true) : cb(null, false);
};


const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, path.join(__dirname,"/multer/users/images"))
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-profile-${file.originalname}`)
    }
})

export const profileUploader = multer({storage: profileStorage, fileFilter: multerFilterProfile})

const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, path.join(__dirname,"/multer/users/documents"))
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-document-${file.originalname}`)
    }
})

export const documentsUploader = multer({storage: documentStorage})

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, path.join(__dirname,"/multer/products/images"))
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.code}-image-${file.originalname}`)
    }
})

export const productPhotoUploader = multer({storage: productStorage})