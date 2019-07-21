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
const _expressListEndpoints = require("express-list-endpoints");
module.exports = () => ({
    schema: [
        require("./pipes-input.schema"),
        {
            type: "object",
            properties: {
                endpoints: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            path: {
                                type: "string",
                                // matches URL encoded string
                                pattern: "/^(?!%22)[!@#$%^&*]$/",
                                default: "/"
                            },
                            methods: {
                                type: "array",
                                items: {
                                    type: "string",
                                    // matches ExpressJs `route.all` method list
                                    enum: [
                                        "ACL",
                                        "BIND",
                                        "CHECKOUT",
                                        "CONNECT",
                                        "COPY",
                                        "DELETE",
                                        "GET",
                                        "HEAD",
                                        "LINK",
                                        "LOCK",
                                        "M-SEARCH",
                                        "MERGE",
                                        "MKACTIVITY",
                                        "MKCALENDAR",
                                        "MKCOL",
                                        "MOVE",
                                        "NOTIFY",
                                        "OPTIONS",
                                        "PATCH",
                                        "POST",
                                        "PROPFIND",
                                        "PROPPATCH",
                                        "PURGE",
                                        "PUT",
                                        "REBIND",
                                        "REPORT",
                                        "SEARCH",
                                        "SOURCE",
                                        "SUBSCRIBE",
                                        "TRACE",
                                        "UNBIND",
                                        "UNLINK",
                                        "UNLOCK",
                                        "UNSUBSCRIBE"
                                    ],
                                    minLength: 1,
                                },
                            },
                        },
                    },
                },
            },
        },
    ],
    /**
     * Adds output of `express-list-endpoints` to service model
     * @param service
     * @returns {any}
     */
    exec: (service) => {
        return Object.defineProperties({}, {
            endpoints: {
                value: _expressListEndpoints(service.app),
                enumerable: true,
                configurable: false,
            },
        });
    },
});
