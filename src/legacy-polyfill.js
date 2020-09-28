/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// polyfills needed for IE11

// TODO: don't include a polyfill for promises as we already provide one
import "core-js/stable";
import "regenerator-runtime/runtime";
import "mdn-polyfills/Element.prototype.closest";
// olm.init needs utf-16le, and this polyfill was
// the only one I could find supporting it.
// TODO: because the library sees a commonjs environment,
// it will also include the file supporting *all* the encodings,
// weighing a good extra 500kb :-(
import "text-encoding";
import Promise from "../lib/es6-promise/lib/es6-promise/promise.js";

const flush = Promise._flush;
Promise._flush = function() {
    console.log("manually flushing promise queue");
    flush();
}
    
window.Promise = Promise;

// TODO: contribute this to mdn-polyfills
if (!Element.prototype.remove) {
    Element.prototype.remove = function remove() {
        this.parentNode.removeChild(this);
    };
}
