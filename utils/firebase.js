const admin = require('firebase-admin');
const serviceAccount = require('./classeh-test-firebase-adminsdk-glwqq-55b0437eb1.json'); // کلید JSON که از Firebase Console دریافت کردید

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;