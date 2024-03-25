"use strict";

const plan = 23;
const t = require('@lumjs/tests').new({module, plan});
const oq = require('../index');
const data = require('./_inc/sample_data');
const ct = require('./_inc/common_tests').new(t);
const q  = ct.Q;

t.is(oq, oq.Query, 'oquery.Query === oquery');

const ins = new oq(data);

let found;

found = ins.find(q.findBasic);
ct.findBasic(found);  

found = ins.find(q.findSing, {single: true});
ct.findSing(found);

found = ins.find(q.findFunc);
ct.findFunc(found);

found = ins.find(q.findNestSing, {single: true});
ct.findNestSing(found);

found = ins.find(q.findNestFunc);
ct.findNestFunc(found);

found = ins.find(q.findDeep1);
ct.findDeep1(found);

found = ins.find(q.findDeep2);
ct.findDeep2(found);

found = ins.find(q.findId);
ct.findId(found);

found = ins.get(q.getBasic);
ct.getBasic(found);

found = ins.pos(q.posBasic);
ct.posBasic(found);

found = ins.indexes(q.indBasic);
ct.indBasic(found);

found = ins.indexes(q.indDeep);
ct.indDeep(found);

t.done();
