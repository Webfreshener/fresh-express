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
const express = require("express");
const {TxPipe} = require("txpipe");

/**
 *
 * @type {{enableAWSServerless: string, templateEngine: string}}
 * @private
 */
const _extras = {
    // configures template engine and paths
    templateEngine: "./express-views.pipe",
    // enables "serverless" rendering on AWS Lambda + API Gateway
    awsLambda: "./aws-serverless.pipe",
};

/**
 * ExpressJS Setup Operations
 * @type {TxPipe[]}
 * @private
 */
const _pipeOps = [
    // creates server id
    require("./use-server-id.pipe"),
    // configures output compression
    require("./use-compression.pipe"),
    // configures express.json
    require("./use-json-encoding.pipe"),
    // configures express.static
    require("./use-static-assets.pipe"),
    // configures express.urlencoding
    require("./use-url-encoding.pipe"),
];

const _service = Object.defineProperties({}, {
    app: {
        value: express(),
        configurable: false,
        enumerable: true,
    },
});

module.exports = (...pipesOrSchemas) => {
    const _launchTimer = process.hrtime();
    return new TxPipe(
        // performs validation of service model
        require("../schemas/service-options.schema"),
        (options) => {
            Object.keys(_extras).forEach((_x) => {
                if (options[_x]) {
                    _pipeOps[_pipeOps.length - 1] = require(_extras[_x]);
                }
            });

            return Object.defineProperties(_service, {
                launchTimer: _launchTimer,
                router: {
                    value: express.Router(options["routerConfig"] || {}),
                    configurable: false,
                    enumerable: true,
                },
                options: {
                    value: options,
                    configurable: false,
                    enumerable: true,
                }
            });
        },
        (service) => {
            const __ = _pipeOps.map(_p => {
                return (typeof _p) == "function" ? _p(service.options) : _p
            });
            return (
                new TxPipe(...[...__, ...pipesOrSchemas])
            ).exec(service)
        },
        /**
         * Mounts root Router App
         * @param service
         * @returns {service}
         */
        (service) => {
            service.app.use('/', service.router);
            return service;
        },
        (service) => (!service.options.serverless) ?
            require("./express-app-listen.pipe")(service) :
            require("./aws-serverless.pipe")(service),
        // require("../schemas/express-service.schema")
    );
};


