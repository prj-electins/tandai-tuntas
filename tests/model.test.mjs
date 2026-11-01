import test from 'node:test';
import assert from 'node:assert/strict';
import {blankVideo,videoProgress,stagePercent,budget,scriptStats,videoSchema,addDays} from '../lib/model.ts';
test('demo production is 60% and budget is calculated',()=>{const v=blankVideo('',true);assert.equal(videoProgress(v),60);assert.equal(stagePercent(v,'broll'),50);assert.equal(budget(v).total,1017500);assert.equal(scriptStats(v).timeline,60)});
test('shot completion changes weighted progress immediately',()=>{const v=blankVideo('',true);v.shots[1].done=true;assert.equal(videoProgress(v),62.5);v.shots=v.shots.map(s=>({...s,done:true}));assert.equal(videoProgress(v),70)});
test('disabled stages normalize weights, zero denominator is safe',()=>{const v=blankVideo('',true);v.stages.forEach(s=>s.active=s.id==='hook');assert.equal(videoProgress(v),100);v.stages.forEach(s=>s.weight=0);assert.equal(videoProgress(v),0)});
test('empty checklists never report complete',()=>{const v=blankVideo();v.shots=[];v.checks=[];assert.equal(stagePercent(v,'broll'),0);assert.equal(stagePercent(v,'qc'),0);assert.equal(videoProgress(v),0)});
test('equipment uses quantity, days, rate and contingency',()=>{const v=blankVideo();v.equipment=[{id:'e',title:'Lampu',category:'gear',quantity:2,days:3,rate:100000,ready:false}];v.contingency=10;assert.equal(budget(v).total,660000)});
test('validation rejects duplicate stages and negative costs',()=>{const v=blankVideo();v.stages[1].id='brief';assert.equal(videoSchema.safeParse(v).success,false);const v2=blankVideo('',true);v2.equipment[0].rate=-1;assert.equal(videoSchema.safeParse(v2).success,false)});
test('calendar navigation handles month boundaries',()=>{assert.equal(addDays('2026-10-31',1),'2026-11-01');assert.equal(addDays('2026-12-31',1),'2027-01-01')});

test("invalid dates are rejected",()=>{const v=blankVideo();v.targetDate="2026-02-30";assert.equal(videoSchema.safeParse(v).success,false)});
