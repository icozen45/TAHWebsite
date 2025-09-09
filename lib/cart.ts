export const CartAPI = {
  get: () => fetch("/api/assignments").then(r => r.json()),

  add: (items: any[]) => fetch("/api/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignments: items }),
  }).then(r => r.json()),

  delete: (id: string) => fetch(`/api/assignments?id=${id}`, { method: "DELETE" }).then(r => r.json()),

  clear: () => fetch(`/api/assignments?clear=true`, { method: "DELETE" }).then(r => r.json()),

  checkout: () => fetch("/api/checkout", { method: "POST" })
    .then(r => r.json())
    .then(({ url }) => window.location.href = url),
};
