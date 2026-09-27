import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";


import {
    getFirestore,
    collection,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// ========================================
// Firebase設定
// ========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBrsFoQdQTiNrS5OcaBhWf9UGSH77Iv7OU",

    authDomain:
        "cleair-lab.firebaseapp.com",

    projectId:
        "cleair-lab",

    storageBucket:
        "cleair-lab.firebasestorage.app",

    messagingSenderId:
        "692128366961",

    appId:
        "1:692128366961:web:75a8c5d40ba1656d3476d0",

    measurementId:
        "G-JB5Q29PE15"

};


// ========================================
// Firebase初期化
// ========================================

const app =
    initializeApp(
        firebaseConfig
    );


// ========================================
// Firestore
// ========================================

const db =
    getFirestore(app);


// ========================================
// Authentication
// ========================================

const auth =
    getAuth(app);


// ========================================
// ユーザー配下のCollection取得
//
// users/{uid}/{name}
// ========================================

function userCollection(name) {

    if (!auth.currentUser) {

        throw new Error(
            "ログインしてください"
        );

    }

    return collection(
        db,
        "users",
        auth.currentUser.uid,
        name
    );
}


// ========================================
// ユーザー配下のDocument取得
//
// users/{uid}/{name}/{id}
// ========================================

function userDoc(name, id) {

    if (!auth.currentUser) {

        throw new Error(
            "ログインしてください"
        );

    }

    return doc(
        db,
        "users",
        auth.currentUser.uid,
        name,
        id
    );
}


// ========================================
// ログインユーザー取得待ち
// ========================================

function waitForUser() {

    return new Promise(
        (resolve, reject) => {

            // --------------------------------
            // すでにログイン済み
            // --------------------------------

            if (auth.currentUser) {

                resolve(
                    auth.currentUser
                );

                return;
            }


            // --------------------------------
            // Firebase Authの状態監視
            // --------------------------------

            const unsubscribe =
                onAuthStateChanged(
                    auth,
                    user => {

                        // 一度だけ使用
                        unsubscribe();


                        if (user) {

                            resolve(user);

                        } else {

                            reject(
                                new Error(
                                    "ログインしてください"
                                )
                            );

                        }

                    }
                );

        }
    );

}


// ========================================
// 外部へ公開
// ========================================

export {

    db,

    auth,

    userCollection,

    userDoc,

    waitForUser

};