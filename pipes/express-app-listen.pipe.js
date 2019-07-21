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
const _writeStatus = require("./write-server-status.pipe")();
module.exports = async (service) => {
    return await new Promise((res, rej) => {
        service.app.listen(service.options.port, service.options.host, (e) => {
            if (e) {
                rej(e);
            }
            // return false;
            Object.defineProperty(service, "duration", {
                value: (
                    (process.hrtime(service.launchTimer)[0] * 1000 + process.hrtime(service.launchTimer)[1] / 1000000) * 0.001
                ).toFixed(4),
                enumerable: true,
                configurable: false,
            });
            _writeStatus.exec(service);
            res(service);
        });
    });
};
