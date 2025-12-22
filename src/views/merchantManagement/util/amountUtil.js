export function formatAmount(value) {
  const v = value;
  const n = typeof v === "number" ? v : parseFloat(v);
  if (isNaN(n)) return "0.00";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const fixed = abs.toFixed(2);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + parts.join(".");
}
