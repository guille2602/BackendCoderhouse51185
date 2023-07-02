import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

//Configuraciones de path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

//Configuraciones de bcrypt
export const createHash = ( password ) => bcrypt.hashSync( password , bcrypt.genSaltSync(10) );
export const validatePassword = ( user , password ) => bcrypt.compareSync( password , user.password );
