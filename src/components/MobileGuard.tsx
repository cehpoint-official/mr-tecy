"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function MobileGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkDevice = () => {
            if (pathname.startsWith('/api')) return;

            const userAgent = navigator.userAgent;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            const isSmallScreen = window.innerWidth <= 1024; // Tablet/Mobile breakpoint
            const isMobileView = isMobile || isSmallScreen;

            if (pathname === '/desktop-only') {
                if (isMobileView) {
                    router.push("/");
                }
                return;
            }

            if (!isMobileView) {
                router.push("/desktop-only");
            }
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);

        return () => window.removeEventListener("resize", checkDevice);
    }, [pathname, router]);

    return <>{children}</>;
}
