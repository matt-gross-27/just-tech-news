module.exports = {
  format_date: date => {
    return `${new Date(date).getMonth() + 1}/`
      +    `${new Date(date).getDate()}/`
      +       new Date(date).getFullYear().toString().substr(2,2);
  },
  format_plural: (string, num) => {
    return (num === 1 ? string : `${string}s`);
  },
  shorten_url: url => {
    return url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split('/')[0]
      .split('?')[0];
  }
}