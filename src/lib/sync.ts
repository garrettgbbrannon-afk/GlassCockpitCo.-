import { getFirebaseDb, isCloudSyncConfigured } from "./firebase";
import { getState, importProgress, setProgressChangeListener, type ProgressState } from "./storage";

const SYNC_DEBOUNCE_MS = 1500;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let syncingUid: string | null = null;

async function pushLocalProgress(uid: string, state: ProgressState) {
  try {
    const [{ doc, serverTimestamp, setDoc }, db] = await Promise.all([
      import("firebase/firestore"),
      getFirebaseDb(),
    ]);
    await setDoc(doc(db, "users", uid), { ...state, updatedAt: serverTimestamp() });
  } catch {
    // Offline or transient failure — local data is still safe, next change will retry.
  }
}

/** Pulls the pilot's cloud progress (if any) and merges it into local storage, then reconciles the merge back up. */
async function pullAndMerge(uid: string) {
  try {
    const [{ doc, getDoc }, db] = await Promise.all([import("firebase/firestore"), getFirebaseDb()]);
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      importProgress(JSON.stringify(snap.data()), "merge");
    }
  } catch {
    // No network / no existing doc yet — proceed with local-only state.
  }
  await pushLocalProgress(uid, getState());
}

/** Starts syncing local progress to this signed-in pilot's cloud document. Call once per sign-in. */
export async function startAutoSync(uid: string) {
  if (!isCloudSyncConfigured) return;
  syncingUid = uid;
  await pullAndMerge(uid);

  setProgressChangeListener((state) => {
    if (syncingUid !== uid) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => pushLocalProgress(uid, state), SYNC_DEBOUNCE_MS);
  });
}

/** Stops syncing (call on sign-out). Local progress is left untouched. */
export function stopAutoSync() {
  syncingUid = null;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  setProgressChangeListener(null);
}
