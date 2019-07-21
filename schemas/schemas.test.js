const {TxPipe} = require("txpipe");

describe("Schemas Test Suite", () => {
    describe("Service Options Schema Tests", () => {
        const _data = require("../default.config");
        const _schema = require("./service-options.schema");
        it("should validate with json-schema", (done) => {
            const __ = new TxPipe(_schema);
            const _sub = __.subscribe({
                next: (d) => {
                    expect(JSON.stringify(d)).toEqual(JSON.stringify(_data));
                    _sub.unsubscribe();
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(JSON.stringify(e));
                },
            });
            __.txWrite(_data);
        })
    });

    describe("Add Route Schema Tests", () => {
        const _data = {
            path: "/",
            method: "all",
            handler: (req, res) => {
                res.send("ok");
            }
        };
        const _schema = require("./add-route.schema");
        it("should validate with json-schema", (done) => {
            const __ = new TxPipe(_schema);
            const _sub = __.subscribe({
                next: (d) => {
                    _sub.unsubscribe();
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                },
            });
            __.txWrite(_data);
        })
    });

    describe("Express Service Schema Tests", () => {
        const _data = {
            app: {},
            router: {},
            options: require("../default.config"),
        };
        const _schema = require("./express-service.schema");
        it("should validate with json-schema", (done) => {
            const __ = new TxPipe(_schema);
            const _sub = __.subscribe({
                next: (d) => {
                    _sub.unsubscribe();
                    done();
                },
                error: (e) => {
                    _sub.unsubscribe();
                    done(e);
                },
            });
            __.txWrite(_data);
        })
    });
});
