const admin = require('firebase-admin');
//const serviceAccount = require('../path/to/your-firebase-adminsdk.json'); // کلید JSON که از Firebase Console دریافت کردید

admin.initializeApp({
    //credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;