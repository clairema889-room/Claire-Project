const {
    onRequest
} = require("firebase-functions/v2/https");


const {
    initializeApp
} = require("firebase-admin/app");


const {
    getAuth
} = require("firebase-admin/auth");


const {
    getFirestore,
    FieldValue
} = require("firebase-admin/firestore");


const {
    logger
} = require("firebase-functions");


// ========================================
// Firebase Admin初期化
// ========================================

initializeApp();


const auth =
    getAuth();


const db =
    getFirestore();


// ========================================
// LINE Channel ID
// ========================================

const LINE_CHANNEL_ID =
    "2010798410";


// ========================================
// LINEログインAPI
// ========================================

exports.lineLogin = onRequest(

    {
        region: "asia-northeast1",
        cors: true
    },

    async (req, res) => {

        try {

            // ====================================
            // POST以外は拒否
            // ====================================

            if (req.method !== "POST") {

                return res
                    .status(405)
                    .send(
                        "Method Not Allowed"
                    );
            }


            // ====================================
            // IDトークン取得
            // ====================================

            const idToken =
                req.body &&
                req.body.idToken;


            if (!idToken) {

                return res
                    .status(400)
                    .send(
                        "IDトークンがありません。"
                    );
            }


            // ====================================
            // LINE IDトークン検証
            // ====================================

            const params =
                new URLSearchParams();


            params.append(
                "id_token",
                idToken
            );


            params.append(
                "client_id",
                LINE_CHANNEL_ID
            );


            const verifyResponse =
                await fetch(
                    "https://api.line.me/oauth2/v2.1/verify",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body:
                            params.toString()
                    }
                );


            // ====================================
            // LINE検証失敗
            // ====================================

            if (!verifyResponse.ok) {

                const errorText =
                    await verifyResponse.text();


                logger.error(
                    "LINE IDトークン検証失敗:",
                    errorText
                );


                return res
                    .status(401)
                    .send(
                        "LINE IDトークンの検証に失敗しました。"
                    );
            }


            // ====================================
            // LINEユーザー情報取得
            // ====================================

            const lineUser =
                await verifyResponse.json();


            const lineUserId =
                lineUser.sub;


            if (!lineUserId) {

                return res
                    .status(401)
                    .send(
                        "LINEユーザーIDを取得できませんでした。"
                    );
            }


            // ====================================
            // Firebase UID
            // ====================================

            const firebaseUid =
                "line_" + lineUserId;


            // ====================================
            // Firebaseユーザー取得
            // ====================================

            try {

                await auth.getUser(
                    firebaseUid
                );

            } catch (error) {

                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    // ==================================
                    // 初回ログイン
                    // ==================================

                    await auth.createUser(
                        {
                            uid:
                                firebaseUid
                        }
                    );

                } else {

                    throw error;

                }

            }


            // ====================================
            // Firebase Custom Token発行
            // ====================================

            const customToken =
                await auth.createCustomToken(
                    firebaseUid,
                    {
                        lineUserId:
                            lineUserId
                    }
                );


            // ====================================
            // Firestore保存
            // ====================================

            await db
                .collection("users")
                .doc(firebaseUid)
                .set(
                    {

                        lineUserId:
                            lineUserId,

                        displayName:
                            lineUser.name || "",

                        pictureUrl:
                            lineUser.picture || "",

                        email:
                            lineUser.email || "",

                        updatedAt:
                            FieldValue.serverTimestamp()

                    },
                    {
                        merge: true
                    }
                );


            // ====================================
            // ブラウザへ返す
            // ====================================

            return res.json(
                {

                    success:
                        true,

                    customToken:
                        customToken,

                    lineUserId:
                        lineUserId,

                    displayName:
                        lineUser.name || "",

                    pictureUrl:
                        lineUser.picture || "",

                    email:
                        lineUser.email || ""

                }
            );


        } catch (error) {

            // ====================================
            // エラー処理
            // ====================================

            logger.error(
                "LINEログイン処理エラー:",
                error
            );


            return res
                .status(500)
                .send(
                    "サーバー側でエラーが発生しました。"
                );

        }

    }

);