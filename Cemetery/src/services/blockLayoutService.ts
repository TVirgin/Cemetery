// src/services/recordService.ts
import { db } from '../firebaseConfig'; // Adjust path as needed
import {
  getDoc,
  doc,
  setDoc  
} from 'firebase/firestore';
import { BlockLayout } from '../pages/records/records.types.ts';

const LAYOUT_COLLECTION = 'cemeteryLayout';

export const getBlockLayout = async (blockId: string): Promise<BlockLayout | null> => {
  try {
    const layoutDocRef = doc(db, LAYOUT_COLLECTION, blockId);
    const docSnap = await getDoc(layoutDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BlockLayout;
    } else {
      console.warn(`No layout document found for block: ${blockId}`);
      return null;
    }
  } catch (error) {
    console.error("Error getting block layout: ", error);
    throw error;
  }
};

export const setBlockLayout = async (blockId: string, layoutData: Omit<BlockLayout, 'id' | 'blockName'>): Promise<void> => {
  try {
    const layoutDocRef = doc(db, LAYOUT_COLLECTION, blockId);
    // setDoc will create the document if it doesn't exist, or overwrite it if it does.
    // We add blockName here for consistency, deriving it from the ID.
    await setDoc(layoutDocRef, { ...layoutData, blockName: `Ward ${blockId}` });
  } catch (error) {
    console.error("Error setting block layout: ", error);
    throw error;
  }
};