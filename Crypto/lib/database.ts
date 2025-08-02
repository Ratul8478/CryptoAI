
import { openDB, DBSchema } from 'idb';

const DB_NAME = 'AIChainX-DB';
const DB_VERSION = 2; // Incremented version for schema change
const USERS_STORE = 'users';

export interface User {
  email: string;
  fullName: string;
  mobile: string;
  passwordHash: string;
  createdAt: Date;
  isCreator: boolean;
}

interface MyDB extends DBSchema {
  [USERS_STORE]: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
}

const dbPromise = openDB<MyDB>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const store = db.createObjectStore(USERS_STORE, {
            keyPath: 'email',
          });
          store.createIndex('by-email', 'email', { unique: true });
        }
    }
  },
});

export const addUser = async (user: User) => {
  const db = await dbPromise;
  await db.put(USERS_STORE, user);
  console.log('User added to IndexedDB:', user.email);
};

export const getUserData = async (email: string): Promise<User | undefined> => {
  if (!email) return undefined;
  const db = await dbPromise;
  const user = await db.get(USERS_STORE, email);
  console.log('User fetched from IndexedDB:', user);
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
    const db = await dbPromise;
    const users = await db.getAll(USERS_STORE);
    console.log('Fetched all users from IndexedDB');
    return users;
};
