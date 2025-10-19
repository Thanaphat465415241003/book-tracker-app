import admin from 'firebase-admin';
// ตรวจสอบให้แน่ใจว่าคุณได้ดาวน์โหลด serviceAccountKey.json มาไว้ในโฟลเดอร์นี้แล้ว
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

export { admin, db };