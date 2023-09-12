import multer from 'multer'
import __dirname from '../utils.js';
import path from 'path'
import userModel from '../dao/models/user.model.js';


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
        cb (null, path.join(__dirname,"/multer/users/profiles"))
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-profile-${file.originalname}`)
    }
})

export const profileUploader = multer({storage: profileStorage})

const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, path.join(__dirname,"/multer/users/documents"))
    },
    filename: function (req, file, cb) {
        cb(null, `${req.email}-document-${file.originalname}`)
    }
})

const multerFilterDocuments = async (req, file, cb) => {
    const userEmail = await userModel.findOne({_id:req.params.uid});
    req.email = userEmail.email;
    if (!req.email) {
        return cb(new Error('email not found'), false);
    } else return cb(null, true);
}

export const documentsUploader = multer({storage: documentStorage, fileFilter: multerFilterDocuments})

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb (null, path.join(__dirname,"/multer/products/images"))
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.code}-image-${file.originalname}`)
    }
})

export const productPhotoUploader = multer({storage: productStorage})