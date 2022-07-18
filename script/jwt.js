const jwt = require('jsonwebtoken');

const generateToken = (signObject) => {
    let iat = new Date().getTime();
    const secretKey = 'ZuP4JBHntifu6jluKzyO5YBYG8aMPZ6J6W3e';
    let expiresIn = iat + 60 * 60 * 1000 * 24 * 7;
    return jwt.sign(signObject, secretKey, {algorithm: 'HS256', expiresIn});
};

const adminToken = generateToken({id: 1, role: 'ADMIN'});
const userToken = generateToken({id: 2, role: 'USER'});
console.log('userToken', userToken);
console.log('adminToken', adminToken);
