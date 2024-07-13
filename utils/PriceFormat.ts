const PriceFormat = (amount: number | null) => {
  if (!amount) return "NA";
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount / 100);
  return formattedAmount;
};

export default PriceFormat;
