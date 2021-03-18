const { format_date, format_plural, shorten_url, format_possessive } = require('../utils/helpers');

test('format_date() returns a date string M/D/YYYY', () => {
  const date = new Date('2020-03-20 16:12:03');
  
  expect(format_date(date)).toBe('3/20/20');
});

test('format_plural() return the correct word form', () => {
  expect(format_plural('lion', 1)).toBe("lion");
  expect(format_plural('tiger', 0)).toBe("tigers");
  expect(format_plural('tiger', 3)).toBe("tigers");
});

test('shorten_url returns base url only xyz.com', () => {
  const url1 = shorten_url('http://test.com/page/2');
  const url2 = shorten_url('https://www.funstuff.com/xyz');
  const url3 = shorten_url('http://www.google.com?q=hello');
  const url4 = shorten_url('www.hello.com?q=hello');
  const url5 = shorten_url('hi.io/one/two/three');

  expect(url1).toBe('test.com');
  expect(url2).toBe('funstuff.com');
  expect(url3).toBe('google.com');
  expect(url4).toBe('hello.com');
  expect(url5).toBe('hi.io');
});

test(`format_possessive adds 's or '`, () => {
  expect(format_possessive('matt gross')).toBe("matt gross'");
  expect(format_possessive('allie tiger')).toBe("allie tiger's")
});