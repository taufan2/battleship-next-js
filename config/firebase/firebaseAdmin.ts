import admin from "firebase-admin";

const serviceAccount = require("./battleship-game-b0add-firebase-adminsdk-4rsj8-7bba52468c.json");


function app() {
    try {
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (e) {
        return admin.app();
    }
}


export const myFirestoreAdmin = app().firestore();
