const crypto = require('crypto');

function hashPassword(password) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    console.log(`Hash for "${password}": ${hash}`);
}

// Replace string below with your desired password
hashPassword("password@123");
