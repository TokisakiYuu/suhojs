require("{loader}mod/jsLoader");
require("{loader}mod/htmlLoader");
const frag = require("./index.html");
const modA = require("mod/modA");
const b = require("mod/modA");
const a = require("mod/modA");
const c = require("mod/modC");
console.log(modA.result);
console.log(modA);
console.log(frag.frag);
console.log(new c())