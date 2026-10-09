import test from 'node:test';
import assert from 'node:assert/strict';
import { nearestObservances, validCalendarDate } from './nearestObservances.ts';
const fixtures = [
  {slug:'december',title:'December observance',category:'Observances',dateRule:{occurrences:[{date:'2026-12-31',weekday:'Thursday'}]}},
  {slug:'january',title:'January observance',category:'Public Holidays',dateRule:{occurrences:[{date:'2027-01-01',weekday:'Friday'},{date:'2027-01-01',weekday:'Friday'}]}},
  {slug:'stone',title:'Birthstone',category:'Birthstones',dateRule:{occurrences:[{date:'2027-01-01',weekday:'Friday'}]}},
];
test('cross-year lookup includes exact day and next year, excludes other categories and duplicates',()=>{
 const result=nearestObservances('2026-12-31',fixtures);
 assert.deepEqual(result.on.map(x=>x.slug),['december']);
 assert.deepEqual(result.after.map(x=>x.slug),['january']);
 assert.equal(result.before.length,0);
});
test('keeps all ties on exact day and orders both sides by calendar date',()=>{
 const data=Array.from({length:9},(_,i)=>({slug:`day${i}`,title:`Day ${i}`,category:'Observances',dateRule:{occurrences:[{date:`2027-01-0${i+1}`,weekday:'unused'}]}}));
 const result=nearestObservances('2027-01-05',data);
 assert.deepEqual(result.before.map(x=>x.date),['2027-01-02','2027-01-03','2027-01-04']);
 assert.deepEqual(result.after.map(x=>x.date),['2027-01-06','2027-01-07','2027-01-08']);
 assert.equal(result.on.length,1);
});
test('rejects empty, normalized impossible dates, abbreviated input and huge years',()=>{
 for (const date of ['', '2027-02-29','2026-02-30','2027-1-01','999999999-01-01']) {
  assert.equal(validCalendarDate(date),false);
  assert.throws(()=>nearestObservances(date,fixtures),RangeError);
 }
 assert.equal(validCalendarDate('2028-02-29'),true);
});
test('empty data and outside coverage return no invented occurrences',()=>{
 assert.deepEqual(nearestObservances('2027-01-01',[]),{before:[],on:[],after:[],firstDate:null,lastDate:null});
 assert.equal(nearestObservances('2035-01-01',fixtures).after.length,0);
 assert.equal(nearestObservances('2020-01-01',fixtures).before.length,0);
});
