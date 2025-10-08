interface SecurityConfig {
  key: string;
  type: string;
  client: string;
  isOn: boolean;
}

export function checkSecurity(
  configs: SecurityConfig[],
  origin?: string
): boolean {
  // 1. If we're on the client (browser), use window.location.origin
  if (typeof window !== "undefined") {
    origin = window.location.origin;
  }

  // 2. If SSR provided origin manually, use that
  if (origin) {
    const found = configs.find((cfg) => cfg.client === origin);
    return found?.isOn ?? false;
  }

  // 3. If nothing available (pure server, no origin), default to false
  return false;
}
