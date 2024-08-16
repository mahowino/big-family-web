"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase.config"; // Make sure to import your Firebase config
import LoadingScreen from "@/components/loadingScreen";

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          router.push("/login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [auth, router]);

    if (loading) {
      return<LoadingScreen/> // Or any loading indicator
    }

    if (!authenticated) {
      return null; // Don't render anything if not authenticated
    }

    return <Component {...props} />;
  };
}
