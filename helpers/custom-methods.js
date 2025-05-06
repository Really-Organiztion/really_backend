const stripTimezone = (dateString) => {
  const [full, y, m, d, h = "00", min = "00", s = "00", ms = "000"] =
    dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?/
    ) || [];
  return new Date(`${y}-${m}-${d}T${h}:${min}:${s}.${ms}Z`);
}

module.exports = {
  stripTimezone,
};
