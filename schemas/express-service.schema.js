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
module.exports = {
    $id: "http://schemas.webfreshener.com/wf-express-server/express-service#",
    $schema: "http://json-schema.org/draft-07/schema#",
    patternProperties: {"^X\-": {}},
    type: "object",
    required: ["app", "options", "router"],
    properties: {
        options: {
            $ref: "http://schemas.webfreshener.com/express-server-options#",
        },
        app: {
            $id: "#/properties/app",
            type: "object",
            title: "Express Application"
        },
        datetime: {
            $id: "#/properties/datetime",
            type: "object",
            title: "App Start Request Time"
        },
        launchTimer: {
            $id: "#/properties/launchTimer",
            type: "object",
            title: "App Launch Timer"
        },
        router: {
            $id: "#/properties/router",
            type: "object",
            title: "Express Router"
        },
    },
};
