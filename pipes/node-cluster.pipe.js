/* ############################################################################
The MIT License (MIT)

Copyright (c) 2019 Van Schroeder
Copyright (c) 2019 Webfreshener, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

############################################################################ */
const {TxPipe} = require("txpipe");
const _cluster = require("cluster");
const _cpus = require('os').cpus();
module.exports = (options = {size: _cpus.length}) => {
    const _workers = (
        new Array(
            (options.size) && (options.size <= _cpus.length) ?
                options.size : _cpus.length
        ).fill(null)
    );

    return new TxPipe(
        // input validator
        {
            $id: "http://schemas.webfreshener.com/pipes/node-cluster/input#",
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            additionalProperties: false,
            required: ["worker"],
            properties: {
                master: {},
                worker: {},
            },
        },
        // clustering executor
        (config) => {
            if (_cluster.isMaster) {
                _workers.forEach(_cluster.fork);
                if (config["master"]) {
                    config.master();
                }
                return false;
            }
            config.worker();
            return {
                pid: process.pid,
                workerCount: _workers.length,
            };
        },
        // output validator
        {
            $id: "http://schemas.webfreshener.com/pipes/node-cluster/output#",
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            required: ["pid", "workerCount"],
            properties: {
                pid: {
                    type: "number",
                },
                workerCount: {
                    type: "number",
                },
            },
        }
    );
};
