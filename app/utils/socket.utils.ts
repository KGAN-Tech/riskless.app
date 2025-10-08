interface SocketConfig {
  key: string;
  type: string;
  client: string;
  socket: string;
}

export function getSOCKET(configs: SocketConfig[]): string | undefined {
  const currentURL = window.location.origin; // e.g. http://localhost:5173
  const found = configs.find((cfg) => cfg.client === currentURL);
  return found?.socket;
}
