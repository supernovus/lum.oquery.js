"use strict";

const people = require('@lumjs/tests/data/people')({withRecursion: true});

module.exports =
[
  {
    id: 100,
    type: 1,
    person: people[0],
  },
  {
    id: 207,
    type: 1,
    person: people[1],
  },
  {
    id: 399,
    type: 2,
    person: people[2],
  },
  {
    id: 404,
    type: 3,
    person: people[3],
  },
];
