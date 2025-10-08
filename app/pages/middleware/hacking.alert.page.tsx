import { useEffect, useState } from "react";

type IpResponse = { ip?: string };

export default function SecurityAlertPage() {
  const [ip, setIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reported, setReported] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function getIp() {
      try {
        // Prefer a server-side endpoint if you have one (more reliable / not CORS-limited)
        // fallback to a public IP service if server endpoint is not available
        const endpoints = ["https://api.ipify.org?format=json"];

        for (const url of endpoints) {
          if (cancelled) return;
          try {
            const res = await fetch(url, {
              method: "GET",
              signal: controller.signal,
              headers: { Accept: "application/json" },
            });

            if (!res.ok) {
              // Try next endpoint
              continue;
            }

            // Some endpoints return { ip: 'x.x.x.x' }, others plain text — handle both
            const contentType = res.headers.get("content-type") || "";
            let fj: IpResponse = {};
            if (contentType.includes("application/json")) {
              fj = await res.json();
            } else {
              const text = await res.text();
              fj = { ip: text.trim() };
            }

            if (!cancelled) {
              setIp(fj.ip ?? null);
              setError(null);
            }
            return;
          } catch (innerErr) {
            // try next endpoint
            if (controller.signal.aborted) return;
            // continue to next
          }
        }

        if (!cancelled) {
          setError("Unable to determine IP");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to determine IP");
        }
      }
    }

    getIp();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  //   useEffect(() => {
  //     if (!ip || reported) return;

  //     let mounted = true;

  //     (async () => {
  //       try {
  //         // Only POST once per fetch to avoid spam
  //         // const payload = {
  //         //   ip,
  //         //   userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
  //         //   reason: "suspicious-activity-detected",
  //         //   detectedAt: new Date().toISOString(),
  //         // };

  //         // await fetch("/api/report-hack", {
  //         //   method: "POST",
  //         //   headers: { "Content-Type": "application/json" },
  //         //   body: JSON.stringify(payload),
  //         // });

  //         if (mounted) setReported(true);
  //       } catch (e) {
  //         // non-fatal — we don't want to block UI
  //       }
  //     })();

  //     return () => {
  //       mounted = false;
  //     };
  //   }, [ip, reported]);

  const copyIp = async () => {
    try {
      if (!ip) return;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(ip);
        // Optionally show a toast / small feedback here
      } else {
        // fallback: create temporary textarea
        const ta = document.createElement("textarea");
        ta.value = ip;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f17",
        color: "#fff",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 920,
          width: "100%",
          borderRadius: 12,
          padding: 28,
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          background:
            "linear-gradient(180deg, rgba(40,8,20,0.85), rgba(10,10,25,0.95))",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.02em" }}>
          Security Alert — Suspicious activity detected
        </h1>
        <p style={{ color: "#cbd5e1", marginTop: 8 }}>
          We detected potentially malicious activity. Below is the captured
          connection information.
        </p>

        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>IP Address</strong>
            <span>{ip ?? (error ? "Unknown" : "Fetching...")}</span>
          </div>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>Browser</strong>
            <span style={{ maxWidth: "70%", overflowWrap: "anywhere" }}>
              {typeof navigator !== "undefined"
                ? navigator.userAgent
                : "unknown"}
            </span>
          </div>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <strong>Time (UTC)</strong>
            <span>{new Date().toISOString()}</span>
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
          <button
            onClick={copyIp}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Copy IP
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>

          <a
            href={
              ip
                ? `https://ipinfo.io/${encodeURIComponent(ip)}`
                : "https://ipinfo.io"
            }
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Lookup IP
          </a>
        </div>

        <p style={{ marginTop: 18, color: "#94a3b8" }}>
          Note: This page shows the connecting client's IP. For accurate IP
          collection (and to avoid being fooled by proxies), prefer a
          server-side endpoint that reads the IP from <code>req.ip</code> or{" "}
          <code>X-Forwarded-For</code> and logs it securely.
        </p>

        {error && (
          <div style={{ marginTop: 12, color: "#ffb4b4" }}>{error}</div>
        )}
        {reported && (
          <div style={{ marginTop: 8, color: "#86efac" }}>
            Reported to backend
          </div>
        )}
      </div>
    </div>
  );
}
