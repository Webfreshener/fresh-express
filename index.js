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
'use strict';

const {TxPipe} = require("txpipe");
const txCluster = require("./pipes/node-cluster.pipe");
const expressAppInit = require("./pipes/express-app-init.pipe");
const _writeStatus = require("./pipes/write-server-status.pipe")();
const _default = require("./default.config");
const serviceOptionsSchema = require("./schemas/service-options.schema");
const _serviceStatus = new TxPipe(
    require("./pipes/service-status.pipe")()
);

/**
 *
 * @param pipesOrSchemas
 * @returns {{exec: (function(*=): *)}}
 * @private
 */
const __ = (...pipesOrSchemas) => new TxPipe(
    serviceOptionsSchema,
    (options = {}) => {
        options = Object.assign({}, _default, options);
        if (options.cluster !== false) {
            return txCluster(options).txWrite({
                worker: () => {
                    const _expressApp = expressAppInit(...pipesOrSchemas);
                    const _sub = _expressApp.subscribe({
                        error: (e) => {
                            _sub.unsubscribe();
                            throw e;
                        },
                    });
                }
            });
        }
        return expressAppInit(...pipesOrSchemas).exec(options);
    }
);

/**
 *
 * @param pipesOrSchemas
 * @returns {{serve: (function(*=): (app|{app,router,options)}}
 */
module.exports = Object.defineProperties(__, {
    mount: {
        /**
         *
         * @param path
         * @param module
         * @returns {function(...[*]): {serve: (function(*=): *)}}
         */
        value: (path, module) => {
            _service.app.use(path, module);
            return __;
        },
        enumerable: true,
        configurable: false,
    },
    mountPoint: {
        value: (options) => __.exec(Object.assign({}, options, {})),
        enumerable: true,
        configurable: false,
    },
    cluster: {
        value: require("./pipes/node-cluster.pipe"),
        enumerable: true,
        configurable: false,
    },
});

process.on('uncaughtException', (e) => {
    const _msg = (Array.isArray(e)) ?
        `wf-express-server failed. Check your server options.\n\n${JSON.stringify({error_stack: e}, null, 2)}` :
        `wf-express-server failed.\n\n${JSON.stringify({error_stack: e.stack}, null, 2)}`;
    _serviceStatus.txWrite({message: _msg});
    process.exit(1);
});
