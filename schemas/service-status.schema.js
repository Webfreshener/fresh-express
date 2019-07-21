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
    $id: "http://schemas.webfreshener.com/wf-express-server/service-status#",
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["host_address", "host_url", "endpoints"],
    additionalProperties: false,
    oneOf: [{
        $ref: "#/definitions/errorReport",
    }, {
        $ref: "#/definitions/successReport",
    }],
    definitions: {
        errorReport: {
            $id: "#/definitions/errorReport",
            type: "object",
            required: ["message"],
            properties: {
                message: {
                    type: "string"
                },
            },
        },
        successReport: {
            $id: "#/definitions/successReport",
            type: "object",
            required: [
                "$SERVER_ID", "endpoints", "exec_duration", "host_url", "options", "request_time",
            ],
            properties: {
                $SERVER_ID: {
                    type: "string",
                    pattern: "/^[a-z0-9]{8}\-+[a-z0-9]{4}\-+[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{10}$/",
                },
                endpoints: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/url",
                    },
                },
                exec_duration: {
                    type: "number",
                    title: "launch duration in milliseconds"
                },
                express_app_settings: {
                    type: "object",
                    title: "Express Application Settings",
                    type: "object",
                },
                host_url: {
                    $ref: "#/definitions/url",
                },
                options: {
                    $ref: "http://schemas.webfreshener.com/wf-express-server/service-options#",
                },
                request_time: {
                    type: "string",
                    title: "ISO Date Time of task launch"
                },
            },
        },
        url: {
            $id: "#/definitions/url",
            allOf: [{
                $ref: "#/definitions/urlencodedString",
            }, {
                minLength: 1,
                maxLength: 2048,
            }],
        },
        urlencodedString: {
            $id: "#/definitions/urlencodedString",
            type: "string",
            pattern: "/^(?!%22)[!@#$%^&*]$/",
        },
    },
};
