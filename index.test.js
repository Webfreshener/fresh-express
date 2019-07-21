const express = require("express");
const fetch = require("node-fetch");
const service = require("./_index");
const _default = require("./default.config");
describe("Express Server Test Suite", () => {
    let server;
    beforeEach(() => {
        server = service({}).exec({
            port: "8888",
        })
    });

    it("should mount modules", (done) => {
        service.mount("/", (() => {
            const _app = express();
            _app["on"]("mount", () => {
                done();
            });
            _app.all("/", (req, res) => {
                res.send("ok");
            });
            return _app;
        })());
    });
    it("should serve modules over HTTP", (done) => {
        service.mount("/", (() => {
            const _app = express();
            _app["on"]("mount", () => {
                fetch(_default.hostname, {method: "GET"})
                    .then(res => res.json())
                    .then(json => {
                        console.log(json);
                        done();
                    }).catch((e) => {
                        done(e);
                });
            });
            _app.all("/", (req, res) => {
                res.send("{\"status\":\"ok\"}");
            });
            return _app;
        })());
    })
});
