/*
Copyright 2020 Bruno Windels <bruno@windels.cloud>
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

import {BlobHandle} from "../../platform/web/dom/BlobHandle.js";

export interface IEncodedBody {
    mimeType: string;
    body: BlobHandle | string;
    length: number;
}

export function encodeQueryParams(queryParams?: Record<string, any>): string {
    return Object.entries(queryParams || {})
        .filter(([, value]) => value !== undefined)
        .map(([name, value]) => {
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        })
        .join("&");
}

export function encodeBody(body: Record<string, any>): IEncodedBody {
    // todo: code change here
    if (body instanceof BlobHandle) {
        const blob = body as BlobHandle;
        return {
            mimeType: blob.mimeType,
            body: blob, // will be unwrapped in request fn
            length: blob.size
        };
    } else if (typeof body === "object") {
        const json = JSON.stringify(body);
        return {
            mimeType: "application/json",
            body: json,
            // todo: code change here; body.length is a mistake?
            length: json.length
        }
    } else {
        throw new Error("Unknown body type: " + body);
    }
}
