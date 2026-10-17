import type { Veiculo, HistoricoManutencao, OrdemServico, SyncQueueItem } from '../types';
import type { User } from '../providers/interfaces';
import { MOCK_USERS, MOCK_VEHICLES, MOCK_HISTORICO, MOCK_SERVICE_ORDERS } from '../data/mockData';

const DB_NAME = 'tractus_app_db';
const DB_VERSION = 1;

const STORES = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  HISTORICO: 'historico',
  SERVICE_ORDERS: 'service_orders',
  SYNC_QUEUE: 'sync_queue',
} as const;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB não suportado neste ambiente.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        db.createObjectStore(STORES.USERS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.VEHICLES)) {
        db.createObjectStore(STORES.VEHICLES, { keyPath: 'placa' });
      }
      if (!db.objectStoreNames.contains(STORES.HISTORICO)) {
        db.createObjectStore(STORES.HISTORICO, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SERVICE_ORDERS)) {
        db.createObjectStore(STORES.SERVICE_ORDERS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as T[]) ?? []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

async function putAllInStore<T>(storeName: string, items: T[]): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback silencioso caso IndexedDB esteja bloqueado
  }
}

export interface PersistedAppState {
  users: User[];
  vehicles: Veiculo[];
  historico: HistoricoManutencao[];
  serviceOrders: OrdemServico[];
  syncQueue: SyncQueueItem[];
}

export async function loadInitialStateFromIDB(): Promise<PersistedAppState> {
  const [users, vehicles, historico, serviceOrders, syncQueue] = await Promise.all([
    getAllFromStore<User>(STORES.USERS),
    getAllFromStore<Veiculo>(STORES.VEHICLES),
    getAllFromStore<HistoricoManutencao>(STORES.HISTORICO),
    getAllFromStore<OrdemServico>(STORES.SERVICE_ORDERS),
    getAllFromStore<SyncQueueItem>(STORES.SYNC_QUEUE),
  ]);

  const finalUsers = users.length > 0 ? users : MOCK_USERS;
  const finalVehicles = vehicles.length > 0 ? vehicles : MOCK_VEHICLES;
  const finalHistorico = historico.length > 0 ? historico : MOCK_HISTORICO;
  const finalOrders =
    serviceOrders.length > 0
      ? serviceOrders.sort((a, b) => b.id - a.id)
      : MOCK_SERVICE_ORDERS;

  if (users.length === 0) await putAllInStore(STORES.USERS, finalUsers);
  if (vehicles.length === 0) await putAllInStore(STORES.VEHICLES, finalVehicles);
  if (historico.length === 0) await putAllInStore(STORES.HISTORICO, finalHistorico);
  if (serviceOrders.length === 0) await putAllInStore(STORES.SERVICE_ORDERS, finalOrders);

  return {
    users: finalUsers,
    vehicles: finalVehicles,
    historico: finalHistorico,
    serviceOrders: finalOrders,
    syncQueue,
  };
}

export async function saveUsersToIDB(users: User[]): Promise<void> {
  await putAllInStore(STORES.USERS, users);
}

export async function saveVehiclesToIDB(vehicles: Veiculo[]): Promise<void> {
  await putAllInStore(STORES.VEHICLES, vehicles);
}

export async function saveHistoricoToIDB(historico: HistoricoManutencao[]): Promise<void> {
  await putAllInStore(STORES.HISTORICO, historico);
}

export async function saveServiceOrdersToIDB(orders: OrdemServico[]): Promise<void> {
  await putAllInStore(STORES.SERVICE_ORDERS, orders);
}

export async function saveSyncQueueToIDB(queue: SyncQueueItem[]): Promise<void> {
  await putAllInStore(STORES.SYNC_QUEUE, queue);
}

export async function resetIDBToDefaults(): Promise<PersistedAppState> {
  await Promise.all([
    putAllInStore(STORES.USERS, MOCK_USERS),
    putAllInStore(STORES.VEHICLES, MOCK_VEHICLES),
    putAllInStore(STORES.HISTORICO, MOCK_HISTORICO),
    putAllInStore(STORES.SERVICE_ORDERS, MOCK_SERVICE_ORDERS),
    putAllInStore(STORES.SYNC_QUEUE, []),
  ]);

  return {
    users: [...MOCK_USERS],
    vehicles: JSON.parse(JSON.stringify(MOCK_VEHICLES)) as Veiculo[],
    historico: [...MOCK_HISTORICO],
    serviceOrders: [...MOCK_SERVICE_ORDERS],
    syncQueue: [],
  };
}
