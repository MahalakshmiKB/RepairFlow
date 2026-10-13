/**
 * Currency Formatter Utility for RepairFlow
 * Formats monetary amounts in Indian Rupees (₹) using the Indian numbering system.
 * Example: 1500 -> "₹1,500.00", 125000 -> "₹1,25,000.00"
 */

export function formatINR(amount) {
  if (amount === null || amount === undefined || amount === '' || isNaN(amount)) {
    return '—';
  }
  const numericAmount = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
}

export default formatINR;
