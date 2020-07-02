import * as functions from 'firebase-functions';
const universal = require(`${process.cwd()}/dist/enlink/server/main`).app();

export const ssr_dev = functions.https.onRequest(universal);
export const ssr = functions.https.onRequest(universal);