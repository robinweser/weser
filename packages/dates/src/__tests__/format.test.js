import test from 'ava'

import format from '../../dist/format.js'

const formatWithLocale = (date, pattern) =>
  format(date, pattern, {
    locale: 'en-GB',
  })

test('formatting dates should work properly', (t) => {
  t.is(formatWithLocale(new Date('03/03/2021'), 'dd-MM-yyyy'), '03-03-2021')
  t.is(
    formatWithLocale(new Date('03/03/2021'), 'DD dd-MM-yyyy'),
    'Wed 03-03-2021'
  )
  t.is(
    formatWithLocale(new Date('03/03/2021'), 'DDD dd-MM-yyyy'),
    'Wednesday 03-03-2021'
  )
  t.is(formatWithLocale(new Date('03/03/2021'), 'MMMM d'), 'March 3')
  t.is(formatWithLocale(new Date('03/03/2021'), 'dd-0MM-yyyy'), '03-003-2021')
  t.is(formatWithLocale(new Date('03/03/2021'), 'dd-MMM-yyyy'), '03-Mar-2021')
  t.is(
    formatWithLocale(new Date('03/03/2021 11:45:21'), 'hh:mm:ss a'),
    '11:45:21 am'
  )
  t.is(formatWithLocale(new Date('03/03/2021 11:45:21 PM'), 'hh:mm'), '11:45')
  t.is(formatWithLocale(new Date('03/03/2021 11:45:21 PM'), 'HH:mm'), '23:45')
  t.is(
    formatWithLocale(new Date('03/03/2021 11:45:21'), 'dd-MM-yyyy hh:mm:ss'),
    '03-03-2021 11:45:21'
  )
  t.is(
    formatWithLocale(new Date('03/03/2021 11:05:05'), 'dd-MM-yyyy h:m:s'),
    '03-03-2021 11:5:5'
  )
  t.is(
    formatWithLocale(
      new Date(2021, 3, 3, 11, 45, 21, 23),
      'dd-MM-yyyy hh:mm:ss.SSS'
    ),
    '03-04-2021 11:45:21.023'
  )
})

test('formatting dates should correctly format special cases', (t) => {
  t.is(formatWithLocale(new Date(2020, 3, 3, 9, 9, 9), 'hh:mm:ss'), '09:09:09')
})

test('formatting dates should correctly keep non-pattern text', (t) => {
  t.is(
    formatWithLocale(
      new Date('03/03/2021'),
      '"Today is" MMMM "the" dd. "in year" y'
    ),
    'Today is March the 03. in year 2021'
  )
})

test('formatting dates should correctly apply the locale', (t) => {
  t.is(
    formatWithLocale(new Date('03/03/2021'), 'DDD dd MMMM yyyy'),
    'Wednesday 03 March 2021'
  )
  t.is(
    format(new Date('03/03/2021'), 'DDD dd MMMM yyyy', { locale: 'sv-SE' }),
    'onsdag 03 mars 2021'
  )
  t.is(
    format(new Date(2021, 3, 3, 9, 9, 9), 'hh:mm:ss a', { locale: 'sv-SE' }),
    '09:09:09 fm'
  )
})

test('formatting dates should support both HH and hh', (t) => {
  t.is(
    format(new Date('2022-11-16T15:03:00.000Z'), 'HH', {
      locale: 'sv-SE',
      timeZone: 'Europe/Stockholm',
    }),
    '16'
  )
  t.is(
    format(new Date('2022-11-16T15:03:00.000Z'), 'hh', {
      locale: 'sv-SE',
      timeZone: 'Europe/Stockholm',
    }),
    '04'
  )
})

test('formatting dates should care about timezone', (t) => {
  t.is(
    format(new Date('2022-11-16T22:20:00.000Z'), 'yyyy-MM-dd HH:mm', {
      locale: 'sv-SE',
      timeZone: 'Europe/Stockholm',
    }),
    '2022-11-16 23:20'
  )
  t.is(
    format(new Date('2022-11-16T22:20:00.000Z'), 'yyyy-MM-dd HH:mm', {
      locale: 'ka-GE',
      timeZone: 'Asia/Tbilisi',
    }),
    '2022-11-17 02:20'
  )
  t.is(
    format(new Date('2022-11-16T22:20:00.000Z'), 'yyyy-MM-dd HH:mm', {
      locale: 'en-CA',
      timeZone: 'America/St_Johns',
    }),
    '2022-11-16 18:50'
  )
})
