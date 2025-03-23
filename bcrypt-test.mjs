// bcrypt-test.mjs
import bcrypt from 'bcryptjs';

const hash = '$2b$10$gFFAfPtQsLT2Hrod0o86g.z1Mdx/JsfPhzMKYGOsHzp7cRf2HVl4y'; // <-- jeho heslo
const plain = '1111xY11'; // <-- sem daj, čo si skúšal

const match = await bcrypt.compare(plain, hash);
console.log('Password match:', match);

