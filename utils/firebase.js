var admin = require("firebase-admin");


var serviceAccount = require("../config/firebase-adminsdk.json");


admin.initializeApp({

    credential: admin.credential.cert(serviceAccount)

});
