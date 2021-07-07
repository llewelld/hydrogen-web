/*
Copyright 2021 The Matrix.org Foundation C.I.C.

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
import {MIN_UNICODE, MAX_UNICODE} from "./common.js";

function encodeKey(roomId, targetEventId, relType, sourceEventId) {
    return `${roomId}|${targetEventId}|${relType}|${sourceEventId}`;
}

function decodeKey(key) {
    const [roomId, targetEventId, relType, sourceEventId] = key.split("|");
    return {roomId, targetEventId, relType, sourceEventId};
}

export class TimelineRelationStore {
    constructor(store) {
        this._store = store;
    }

    add(roomId, targetEventId, relType, sourceEventId) {
        return this._store.add({key: encodeKey(roomId, targetEventId, relType, sourceEventId)});
    }

    remove(roomId, targetEventId, relType, sourceEventId) {
        return this._store.delete(encodeKey(roomId, targetEventId, relType, sourceEventId));
    }

    removeAllForTarget(roomId, targetId) {
        const range = this._store.IDBKeyRange.bound(
            encodeKey(roomId, targetId, MIN_UNICODE, MIN_UNICODE),
            encodeKey(roomId, targetId, MAX_UNICODE, MAX_UNICODE),
            true,
            true
        );
        return this._store.delete(range);
    }

    async getForTargetAndType(roomId, targetId, relType) {
        // exclude both keys as they are theoretical min and max,
        // but we should't have a match for just the room id, or room id with max
        const range = this._store.IDBKeyRange.bound(
            encodeKey(roomId, targetId, relType, MIN_UNICODE),
            encodeKey(roomId, targetId, relType, MAX_UNICODE),
            true,
            true
        );
        const items = await this._store.selectAll(range);
        return items.map(i => decodeKey(i.key));
    }

    async getAllForTarget(roomId, targetId) {
        // exclude both keys as they are theoretical min and max,
        // but we should't have a match for just the room id, or room id with max
        const range = this._store.IDBKeyRange.bound(
            encodeKey(roomId, targetId, MIN_UNICODE, MIN_UNICODE),
            encodeKey(roomId, targetId, MAX_UNICODE, MAX_UNICODE),
            true,
            true
        );
        const items = await this._store.selectAll(range);
        return items.map(i => decodeKey(i.key));
    }
}
