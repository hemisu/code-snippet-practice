import sha256 from 'crypto-js/sha256';
const abc = '123'
export default abc

 
const hashDigest = sha256('hello world');
console.log(hashDigest);