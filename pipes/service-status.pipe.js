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
module.exports = () => ({
    // schema: {
    //     schemas: [
    //         require("../schemas/service-options.schema"),
    //         require("../schemas/service-status.schema"),
    //     ],
    // },
    exec: (status) => {
        let _msg = "undefined";
        if (status["message"]) {
            _msg = (`[31m${status["message"]}`);
        } else {
            _msg = `[32m${JSON.stringify(status, null, 2)}`;
            // _msg = `[32mwf-express-server started successfully in ${status.exec_duration}\n[${status.express_app_settings.$SERVER_ID}] ${status.host_url}`;
            // if (status.options.verboseOutput) {
            //     _msg += `\n${JSON.stringify(status, null, 2)}`;
            // }
        }

        console.log(`\n\x1b${_msg}\x1b[0m`);
        return status;
    },
});
