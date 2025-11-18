// src/services/recordService.ts
import { db } from '../firebaseConfig'; // Adjust path as needed
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp, // For server-side timestamps
  query, // For querying
  where, // For where clauses
  orderBy, // For ordering
  Timestamp,
  QueryConstraint ,
  setDoc  
} from 'firebase/firestore';
import { Person, RecordSearchFilters, BlockLayout } from '../pages/records/records.types.ts';

const PERSON_COLLECTION = 'personRecords'; // Define your collection name

// CREATE: Add a new record
export const addRecord = async (recordData: Omit<Person, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PERSON_COLLECTION), {
      ...recordData,
      createdAt: serverTimestamp(), // Let Firestore set the timestamp
    });
    return docRef.id; // Return the ID of the newly created document
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getRecords = async (): Promise<Person[]> => {
  try {
    const personCollectionRef = collection(db, PERSON_COLLECTION);
    // Example: Assuming you might want to order by a field, e.g., lastName
    // If you had a 'createdAt' field on Person and an index for it:
    // const q = query(personCollectionRef, orderBy("createdAt", "desc"));
    const q = query(personCollectionRef, orderBy("lastName", "asc")); // Example ordering
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        // --- Convert Timestamp to Date ---
        birth: data.birth,
        death: data.death,
        // --- End Conversion ---
        block: data.block,
        lot: data.lot,
        sect: data.pos,
        plot: data.plot,
        userId: data.userId, // If you added userId to your Person type
      } as Person; // Cast to Person, ensure all fields align with your Person type
    });
  } catch (error) {
    console.error("Error getting all documents: ", error);
    throw error;
  }
};

// READ: Get records for a specific user
export const getRecord = async (userId: string): Promise<Person[]> => {
  try {
    const personCollectionRef = collection(db, PERSON_COLLECTION);
    const q = query(personCollectionRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Person));
  } catch (error) {
    console.error("Error getting Persons: ", error);
    throw error;
  }
};


// READ: Get a single record by ID
export const getRecordById = async (recordId: string): Promise<Person | null> => {
  try {
    const recordDocRef = doc(db, PERSON_COLLECTION, recordId);
    const docSnap = await getDoc(recordDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Person;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document by ID: ", error);
    throw error;
  }
};

// UPDATE: Update an existing record
export const updateRecordOld = async (recordId: string, updates: Partial<Person>): Promise<void> => {
  try {
    const recordDocRef = doc(db, PERSON_COLLECTION, recordId);
    await updateDoc(recordDocRef, updates);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const updateRecord = async (record: Person) => {
  if (!record.id) {
    throw new Error("Record must have an ID to be updated.");
  }
  // The collection name here is 'persons', update if yours is different
  const recordRef = doc(db, PERSON_COLLECTION, record.id);
  
  // Create a copy to avoid potential issues with state mutation
  const dataToUpdate = { ...record };
  // The document ID should not be part of the data being written
  // delete dataToUpdate.id;

  await updateDoc(recordRef, dataToUpdate);
};

// DELETE: Delete a record
export const deleteRecord = async (recordId: string): Promise<void> => {
  try {
    const recordDocRef = doc(db, PERSON_COLLECTION, recordId);
    await deleteDoc(recordDocRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Helper to convert YYYY-MM-DD string to start-of-day Date object (UTC based for Firestore)
// Or handle this conversion before passing to service if preferred
const convertFilterDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    // This creates a date at UTC midnight. If you need local midnight, use T00:00:00
    // But for querying a Firestore Timestamp (which is UTC), aiming for UTC boundaries is often simpler.
    const date = new Date(dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) return null; // Invalid date string
    return date;
}

// Modified to accept filters
export const getAllRecords = async (filters?: RecordSearchFilters): Promise<Person[]> => {
  try {
    const personCollectionRef = collection(db, PERSON_COLLECTION);
    const queryConstraints: QueryConstraint[] = [];

    // Apply filters - IMPORTANT: Firestore requires composite indexes for many compound queries
    if (filters?.firstName) {
      // For "starts with" type queries (more complex):
      // queryConstraints.push(where("firstName", ">=", filters.firstName));
      // queryConstraints.push(where("firstName", "<=", filters.firstName + '\uf8ff'));
      // For exact match (case-sensitive):
      queryConstraints.push(where("firstName", "==", filters.firstName.trim()));
    }
    if (filters?.lastName) {
      queryConstraints.push(where("lastName", "==", filters.lastName.trim()));
    }
    if (filters?.birthDate) {
      const birth = convertFilterDate(filters.birthDate);
      if (birth) {
        // To query for a specific day, you need a range (start of day to end of day)
        const birthStart = birth;
        const birthEnd = new Date(birth);
        birthEnd.setUTCDate(birth.getUTCDate() + 1); // Start of next day (exclusive)
        queryConstraints.push(where("birth", ">=", Timestamp.fromDate(birthStart)));
        queryConstraints.push(where("birth", "<", Timestamp.fromDate(birthEnd)));
      }
    }
    if (filters?.deathDate) {
      const death = convertFilterDate(filters.deathDate);
      if (death) {
        const deathStart = death;
        const deathEnd = new Date(death);
        deathEnd.setUTCDate(death.getUTCDate() + 1);
        queryConstraints.push(where("death", ">=", Timestamp.fromDate(deathStart)));
        queryConstraints.push(where("death", "<", Timestamp.fromDate(deathEnd)));
      }
    }

    // Always add an orderBy, even if it's just the document ID or a primary field
    // If you have multiple inequality filters, orderBy must start with those fields.
    // Default order or order by a primary field if no other order is specified
    queryConstraints.push(orderBy("lastName", "asc")); // Example default order

    const q = query(personCollectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        birth: data.birth,
        death: data.death,
      } as Person;
    });
  } catch (error) {
    console.error("Error getting all records with filters: ", error);
    throw error;
  }
};

// Modified to accept filters (similar logic to getAllRecords)
export const getRecordsByUserId = async (userId: string, filters?: RecordSearchFilters): Promise<Person[]> => {
  try {
    const personCollectionRef = collection(db, PERSON_COLLECTION);
    const queryConstraints: QueryConstraint[] = [where("userId", "==", userId)]; // Base filter

    // Apply additional filters
    if (filters?.firstName) {
      queryConstraints.push(where("firstName", "==", filters.firstName.trim()));
    }
    if (filters?.lastName) {
      queryConstraints.push(where("lastName", "==", filters.lastName.trim()));
    }
     if (filters?.birthDate) {
      const birth = convertFilterDate(filters.birthDate);
      if (birth) {
        const birthStart = birth;
        const birthEnd = new Date(birth);
        birthEnd.setUTCDate(birth.getUTCDate() + 1);
        queryConstraints.push(where("birth", ">=", Timestamp.fromDate(birthStart)));
        queryConstraints.push(where("birth", "<", Timestamp.fromDate(birthEnd)));
      }
    }
    if (filters?.deathDate) {
      const death = convertFilterDate(filters.deathDate);
      if (death) {
        const deathStart = death;
        const deathEnd = new Date(death);
        deathEnd.setUTCDate(death.getUTCDate() + 1);
        queryConstraints.push(where("death", ">=", Timestamp.fromDate(deathStart)));
        queryConstraints.push(where("death", "<", Timestamp.fromDate(deathEnd)));
      }
    }
    queryConstraints.push(orderBy("lastName", "asc")); // Ensure consistent ordering

    const q = query(personCollectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        birth: data.birth,
        death: data.death,
      } as Person;
    });
  } catch (error) {
    console.error("Error getting user records with filters: ", error);
    throw error;
  }
};