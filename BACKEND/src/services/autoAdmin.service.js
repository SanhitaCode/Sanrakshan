exports.approveAlert = (severity) => {
  const critical = ["HIGH", "CRITICAL"];
  return critical.includes(severity);
};
