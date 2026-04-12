const base = "";

export async function fetchJson(path, options) {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}
