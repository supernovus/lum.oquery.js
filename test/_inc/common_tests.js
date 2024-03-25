"use strict";

const NNUL = ' returned a valid non-null object';
const CNUM = ' returned correct number of values';
const COBJ = ' returned correct object';
const CVAL = ' returned correct values';
const CPOS = ' returned correct index position';

const Q_TYPE_1 = {type: 1};
const Q_DEEP_P = {person:{parents:{name: 'Lisa'}}};

const CommonQueries =
{
  findBasic:    Q_TYPE_1,
  findSing:     {id: 207},
  findFunc:     {type(k) { return k % 2 === 0; }},
  findNestSing: {person:{name: 'Bob'}},
  findNestFunc: {person:{age(a) { return a < 20; }}},
  findDeep1:    {person:{kids:{name: 'Sarah'}}},
  findDeep2:    Q_DEEP_P,
  findId:       207,
  getBasic:     {id: 404},
  posBasic:     {id: 399},
  indBasic:     Q_TYPE_1,
  indDeep:      Q_DEEP_P,
};

class CommonTests
{
  constructor(testInstance)
  {
    this.test = testInstance;
  }

  findBasic(found)
  {
    const name = 'find:basic';
    this.test.is(found.length, 2,  name+CNUM);
    this.test.is(found[0].id, 100, name+COBJ);
  }

  findSing(found)
  {
    const name = 'find:single';
    this.test.ok((found !== null),          name+NNUL);
    this.test.is(found.person.name, 'Lisa', name+COBJ);
  }

  findFunc(found)
  {
    const name = 'find:function';
    this.test.is(found.length, 1,  name+CNUM);
    this.test.is(found[0].id, 399, name+COBJ);
  }

  findNestSing(found)
  {
    const name = 'find:nested:single';
    this.test.ok((found !== null), name+NNUL); 
    this.test.is(found.id, 100,    name+COBJ);
  }

  findNestFunc(found)
  {
    const name = 'find:nested:function';
    this.test.is(found.length, 2,  name+CNUM);
    this.test.is(found[1].id, 404, name+COBJ);
  }

  findDeep1(found)
  {
    const name = 'find:deep[1]';
    this.test.is(found.length, 2,  name+CNUM);
    this.test.is(found[0].id, 100, name+COBJ+' #1');
    this.test.is(found[1].id, 207, name+COBJ+' #2');
  }

  findDeep2(found)
  {
    const name = 'find:deep[2]';
    this.test.is(found.length, 1,  name+CNUM);
    this.test.is(found[0].id, 404, name+COBJ);
  }

  findId(found)
  {
    const name = 'find:id<number>';
    this.test.ok((found !== null),          name+NNUL);
    this.test.is(found.person.name, 'Lisa', name+COBJ);
  }

  getBasic(found)
  {
    const name = 'get()';
    this.test.ok((found !== null),           name+NNUL);
    this.test.is(found.person.name, 'Sarah', name+COBJ);
  }

  posBasic(found)
  {
    const name = 'pos()';
    this.test.is(found, '2', name+CPOS);
  }

  indBasic(found)
  {
    const name = 'indexes:basic';
    this.test.isJSON(found, ['0','1'], name+CVAL);
  }

  indDeep(found)
  {
    const name = 'indexes:deep';
    this.test.isJSON(found, ['3'], name+CVAL);
  }

  static new(test)
  {
    return new this(test);
  }

} // CommonTests class

CommonTests.Q = CommonQueries;
CommonTests.prototype.Q = CommonQueries;

module.exports = CommonTests;
