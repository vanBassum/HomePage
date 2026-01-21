import { useEffect, useState } from "react";
import { VersionApi, VersionInfo } from "./api/generated";



export default function App() {
  const [data, setData] = useState<VersionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const versionApi = new VersionApi();
        const result = await versionApi.getVersion();

        if (cancelled) return;

        if (result.status !== 200) {
          setError(result.statusText);
          return;
        }

        setData(result.data ?? null);
      } catch (e) {
        if (cancelled) return;
        setError(String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, Segoe UI, Roboto, Arial", margin: "2rem" }}>
      <h1>HomePage</h1>
      <p>
        Client calls <code>/api/version</code> and displays the result.
      </p>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!error && !data && <p>Loading…</p>}

      {data && (
        <pre style={{ background: "#f6f8fa", padding: "1rem", borderRadius: 8, overflowX: "auto" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      <p>
        API endpoint: <a href="/api/version">/api/version</a>
      </p>
    </div>
  );
}
