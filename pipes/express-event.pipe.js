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
const {TxPipe} = require("txpipe");
const EventEmitter = require("events");
const union = require('lodash.union');
const _evtHandler = new TxPipe({
    schema: {
        $ref: "http://schemas.webfreshener.com/pipe/node-event/event#",
    },
    /**
     *
     * @param _
     * @returns {string|*}
     */
    exec: (_) => {
        if (_.name === "error") {
            return ((typeof _.data) === "object") ? JSON.stringify(_.data) : _.data;
        }
        return _;
    }
});

class EventPipe extends TxPipe {
    subscribe(handler) {
        return _evtHandler.subscribe(handler);
    }
}

const _events = ["error"];
const _eventsSchema = {
    $id: "http://schemas.webfreshener.com/pipe/node-event/event#",
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
        data: {
            $id: "#/properties/data",
            type: "object",
            properties: {},
        },
        name: {
            $id: "#/properties/name",
            type: "string",
            pattern: "/^[\w]+$/",
        },
    },
};

const _outputSchema = {
    $id: "http://schemas.webfreshener.com/pipe/node-event/output#",
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
        subscribe: {},
        events: {
            type: "array",
            items: {
                type: "string",
            },
        },
    },
};
/**
 *
 * @type {EventPipe}
 */
module.exports = new EventPipe({
    schema: [
        // input schema
        {
            schemas: [
                _eventsSchema,

            ],
        },

        // output schema
        _outputSchema,
    ],
    /**
     *
     * @param eventsOrConfigs
     * @returns {{events:[],subscribe:function}}
     */
    exec: (...eventsOrConfigs) => {
        const _addEvents = [];
        eventsOrConfigs.forEach((_eOC) => {
            if (_eOC.emitter instanceof EventEmitter) {
                union(["error"], _eOC.events).forEach((_) => {
                    _addEvents[_addEvents.length] = _;
                    _eOC.emitter.on(_, (data) => {
                        _evtHandler.txWrite({
                            name: _,
                            data: data,
                        });
                    });
                });
            }
        });

        _events.splice(0, _events.length - 1, ...union(_events, _addEvents));

        // these values will be available via txTap
        return Object.defineProperties({}, {
            subscribe: {
                value: _evtHandler.subscribe,
                enumerable: true,
                configurable: false,
            },
            events: {
                value: _events,
                enumerable: true,
                configurable: false,
            },
        });
    },
});
