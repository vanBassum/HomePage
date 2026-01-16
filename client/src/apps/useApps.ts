import { useCallback, useEffect, useRef, useState } from "react";
import type { AppRecord } from "homepage-shared";
import type { CreateAppRequest } from "@/api/AppsApi";
import { useApi } from "@/api/useApi";

export function useApps() {
  const api = useApi();

  const [items, setItems] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.apps.getAll();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [api]);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateAppRequest) => {
      const created = await api.apps.create(input);
      setItems((prev) => [created, ...prev]);
      return created;
    },
    [api]
  );

  const update = useCallback(
    async (app: AppRecord) => {
      const { id, ...payload } = app;
      await api.apps.update(id, payload);
      setItems((prev) => prev.map((x) => (x.id === id ? app : x)));
    },
    [api]
  );

  const remove = useCallback(
    async (id: number) => {
      await api.apps.delete(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    },
    [api]
  );

  return { items, loading, error, refresh, create, update, remove };
}
