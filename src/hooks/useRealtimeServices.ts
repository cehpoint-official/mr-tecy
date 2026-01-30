import { useState, useEffect } from "react";
import { serviceService } from "@/services/service.service";
import { Service } from "@/types";

interface UseRealtimeServicesOptions {
    onlyActive?: boolean;
    enabled?: boolean;
}

interface UseRealtimeServicesReturn {
    services: Service[];
    loading: boolean;
    error: Error | null;
}

export function useRealtimeServices(
    options: UseRealtimeServicesOptions = {}
): UseRealtimeServicesReturn {
    const { onlyActive = false, enabled = true } = options;
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Subscribe to real-time updates
        const unsubscribe = serviceService.subscribeToServices(
            (data) => {
                setServices(data);
                setLoading(false);
            },
            onlyActive,
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [onlyActive, enabled]);

    return { services, loading, error };
}
