module.exports = {
  format_date: date => {
    return `${new Date(date).getMonth() + 1}/`
      +    `${new Date(date).getDate()}/`
      +       new Date(date).getFullYear().toString().substr(2,2);
  },
  format_plural: (str, num) => {
    return (num === 1 ? str : `${str}s`);
  },
  shorten_url: url => {
    return url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split('/')[0]
      .split('?')[0];
  },
  format_possessive: str => {
    return (str.slice(-1).toLowerCase() === 's' ? `${str}'` : `${str}'s`)
  }
}