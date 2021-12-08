import {
  getAllDocument,
  deleteDocument,
} from '@/services/firebaseService';

/* 
 * Get
 */

// サークル内の全てのドローを取得する
export const getDrawAll = async (cid) => {
  const collection_id = 'circle-' + cid;
  const docsRef = await getAllDocument(collection_id);
  const drawAll = [];

  docsRef.docs.forEach((obj) => {
    // サークル情報は追加しない
    if (obj.id !== 'info') {
      const drawFormat = {did: '', data: '' };
      drawFormat.did = obj.id;
      drawFormat.data = obj.data();
      drawAll.push(drawFormat);
    }
  });

  return drawAll;
};

/*
 * Delete
 */

// ドローを削除する
export const deleteDraw = async (cid, did) => {
  const col_id = 'circle-' + cid;
  await deleteDocument(col_id, did);
};
