const _nodeEvent = require("./express-event.pipe");
const EventEmitter = require("events");
const _emitter = new EventEmitter();
const _cb = jest.fn();
describe.skip("Node Event Test Pipe", () => {
    let _tx = _nodeEvent.txWrite({
        on: {
            events: ["event"],
            emitter: _emitter,
        }
    });

    it("should handle events", (done) => {
        _tx.subscribe({
            next: () => {
                _cb();
            },
            error: (e) => {
                expect(e).toEqual("an error occurred");
                done();
            }
        });
        _emitter.emit("event", {data: "ok"});
        _emitter.emit("event", {data: false});
        expect(_cb).toHaveBeenCalledTimes(2);
        expect((typeof _tx.txTap().subscribe)).toEqual("function");
        expect((typeof _tx.txTap().events)).toEqual("object");
        expect(_tx.txTap().events[0]).toEqual("error");
        expect(_tx.txTap().events[1]).toEqual("event");
        _nodeEvent.txWrite({
            off: {
                events: ["event"],
                emitter: _emitter,
            }
        });
        _emitter.emit("event", {data: false});
        expect(_cb).toHaveBeenCalledTimes(2);
    });
});
