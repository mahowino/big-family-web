import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase.config";

export type UserRole = "admin" | "super-admin" | "user" | ""; // Define your roles
export interface User {
  uid: string;
  email?: string;
  role?: UserRole;
}

export function monitorAuthState(
  callback: (user: User | null, userRole: UserRole | "") => void
) {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userRole = (userDoc.data()?.role as UserRole) || "";
      callback(
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? "",
          role: userRole,
        },
        userRole
      );
    } else {
      callback(null, "");
    }
  });
}
