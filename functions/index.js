
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");



//Initialization of firebase
admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(serviceAccount),
    projectId: 'ur-project-id',
});


//########################################################################################################################################################################
//########################################################################################################################################################################
//########################################################################################################################################################################
//                                                                              SAT RANK
//                                                                         The Code Starts Here
//########################################################################################################################################################################
//########################################################################################################################################################################
//########################################################################################################################################################################



//add score to database
exports.addScore = functions.https.onRequest(async (request, response) => {


    const name = request.body.name;
    const score = request.body.score;

    //locate the document
    const scoreDocPath = admin.firestore().collection("SCORES").doc(name);
    const scoresDocRef = await scoreDocPath.get();


    if (scoresDocRef.exists) {
        response.status(510).send("Student Mark Already Exists");
        return;
    }

    const percentage = (parseInt(score) / 1600) * 100;
    let passed = false;

    if (percentage > 30) {
        passed = true;
    }


    await admin.firestore().collection("SCORES").doc(name).create(
        {
            "name": name,
            "address": request.body.address,
            "city": request.body.city,
            "country": request.body.country,
            "pinCode": request.body.pinCode,
            "score": parseInt(score),
            "passed": passed,
        }
    ).then(() => {
        response.status(210).send("Score Added Successfully");
        return;
    }).catch((e) => {
        response.status(511).send(e);
        return;
    });


});

//update score in database
exports.updateScore = functions.https.onRequest(async (request, response) => {

    const name = request.query.name || null;

    if (name == null) {
        response.status(512).send("Invalid query id");
        return;
    }

    //locate the document
    const scoreDocPath = admin.firestore().collection("SCORES").doc(name.toString());
    const scoresDocRef = await scoreDocPath.get();


    if (!scoresDocRef.exists) {
        response.status(513).send("Student Mark Does Not Exists");
        return;
    }

    const score = request.body.score;

    const percentage = (parseInt(score) / 1600) * 100;
    let passed = false;

    if (percentage > 30) {
        passed = true;
    }


    await admin.firestore().collection("SCORES").doc(name.toString()).update(
        {
            "address": request.body.address,
            "city": request.body.city,
            "country": request.body.country,
            "pinCode": request.body.pinCode,
            "score": parseInt(score),
            "passed": passed,
        }
    ).then(() => {
        response.status(210).send("Score Updated Successfully");
        return;
    }).catch((e) => {
        response.status(511).send(e);
        return;
    });


});

//delete score in database
exports.deleteScore = functions.https.onRequest(async (request, response) => {


    const name = request.body.name;

    //locate the document
    const scoreDocPath = admin.firestore().collection("SCORES").doc(name);
    const scoresDocRef = await scoreDocPath.get();


    if (!scoresDocRef.exists) {
        response.status(513).send("Student Mark Does Not Exists");
        return;
    }

    await admin.firestore().collection("SCORES").doc(name).delete().then(() => {
        response.status(210).send("Score Deleted Successfully");
        return;
    }).catch((e) => {
        response.status(511).send(e);
        return;
    });


});

//get score from database
exports.getScore = functions.https.onRequest(async (request, response) => {


    const name = request.query.name || null;

    if (name == null) {
        response.status(512).send("Invalid query id");
        return;
    }

    //locate the document
    const scoreDocPath = admin.firestore().collection("SCORES").doc(name.toString());
    const scoresDocRef = await scoreDocPath.get();


    if (!scoresDocRef.exists) {
        response.status(513).send("Student Mark Does Not Exists");
        return;
    }

    response.json(scoresDocRef.data());
    return;

});

//get score from database
exports.getAllScore = functions.https.onRequest(async (request, response) => {

    //locate the document
    const scoreColPath = admin.firestore().collection("SCORES");


    scoreColPath.get()
        .then((snapshot) => {

            const documents = [];

            snapshot.forEach((doc) => {
                documents.push(doc.data());
            });

            response.json(documents);
        })
        .catch((error) => {
            response.status(514).send(error);
        });


    return;

});

//get rank from database
exports.getRank = functions.https.onRequest(async (request, response) => {

    const name = request.query.name?.toString() || null;
    const score = request.query.score?.toString() || null;

    console.log(name + " -- " + score);

    if (name == null || score == null) {
        response.status(512).send("Invalid query id");
        return;
    }

    //locate the document
    try {
        const scoreColPath = admin.firestore().collection("SCORES");
        const query = scoreColPath.where('score', '<', parseInt(score));

        const snapshot = await query.get();
        const rank = snapshot.size + 1;
        console.log(rank);
        const msg = "rank|"+rank;
        response.status(212).send(msg);

    } catch (error) {
        response.status(515).send("There was a error");
    }

    return;

});


//########################################################################################################################################################################
//########################################################################################################################################################################
//########################################################################################################################################################################
//                                                                              SAT RANK
//                                                                         The Code Ends Here
//########################################################################################################################################################################
//########################################################################################################################################################################
//########################################################################################################################################################################







