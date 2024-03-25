const plan = 23;
const t = require('@lumjs/tests').new({module, plan});
const oq = require('../index');
const data = require('./_inc/sample_data');
const ct = require('./_inc/common_tests').new(t);
const q  = ct.Q;

t.is(oq, oq.find, 'oquery.find === oquery');

let found;

found = oq(q.findBasic, data);
ct.findBasic(found);

found = oq(q.findSing, data, {single: true});
ct.findSing(found);

found = oq(q.findFunc, data);
ct.findFunc(found);

found = oq(q.findNestSing, data, {single: true});
ct.findNestSing(found);

found = oq(q.findNestFunc, data);
ct.findNestFunc(found);

found = oq(q.findDeep1, data);
ct.findDeep1(found);

found = oq(q.findDeep2, data);
ct.findDeep2(found);

found = oq(q.findId, data);
ct.findId(found);

found = oq.get(q.getBasic, data);
ct.getBasic(found);

found = oq.pos(q.posBasic, data);
ct.posBasic(found);

found = oq.indexes(q.indBasic, data);
ct.indBasic(found);

found = oq.indexes(q.indDeep, data);
ct.indDeep(found);

t.done();
