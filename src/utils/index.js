let formatDate = (date) => {
  if (date !== undefined && date !== "") {
    var myDate = new Date(date);
    var month = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ][myDate.getMonth()];
    var str = myDate.getDate() + " " + month + " " + myDate.getFullYear();
    return str;
  }
  return "";
};

module.exports = {
  formatDate: formatDate,
};
