import test from 'node:test';import assert from 'node:assert/strict';
import {readJSON} from '../lib/request.ts';
test('bounded JSON reader rejects malformed and oversized input',async()=>{const req=s=>new Request('http://example.test',{method:'POST',headers:{'content-type':'application/json'},body:s});assert.deepEqual(await readJSON(req('{"a":1}'),100),{a:1});await assert.rejects(readJSON(req('{'),100),e=>e.status===400);await assert.rejects(readJSON(req('x'.repeat(101)),100),e=>e.status===413)});
