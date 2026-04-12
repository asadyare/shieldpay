export function formatMoney(cents, currency = "USD") {
  const n = Number(cents) / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(n);
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
