import {
  getAllDocument,
} from '@/services/firebaseService';

/* 
 * Get
 */

// サークル内の全てのドローを取得する
export const getDrawAll = async (cid) => {
  const collection_id = 'circle-' + cid;
  const docsRef = await getAllDocument(collection_id);
  const drawAll = [];

  docsRef.docs.forEach((obj, i) => {
    // サークル情報は追加しない
    if (obj.id !== 'info') {
      const drawFormat = {did: '', data: '' };
      drawFormat.did = obj.id;
      drawFormat.data = obj.data();
      drawAll[i] = drawFormat;
    }
  });

  return drawAll;
};
