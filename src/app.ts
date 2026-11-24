import express from "express";

// 01. Creational
import singletonRoute from "./01-creational/01-singleton/route.js";
import factoryMethodRoute from "./01-creational/02-factory-method/route.js";
import abstractFactoryRoute from "./01-creational/03-abstract-factory/route.js";
import builderRoute from "./01-creational/04-builder/route.js";
import prototypeRoute from "./01-creational/05-prototype/route.js";

// 02. Structural
import adapterRoute from "./02-structural/06-adapter/route.js";
import bridgeRoute from "./02-structural/07-bridge/route.js";
import compositeRoute from "./02-structural/08-composite/route.js";
import decoratorRoute from "./02-structural/09-decorator/route.js";
import facadeRoute from "./02-structural/10-facade/route.js";
import flyweightRoute from "./02-structural/11-flyweight/route.js";
import proxyRoute from "./02-structural/12-proxy/route.js";

// 03. Behavioral
import chainRoute from "./03-behavioral/13-chain-of-responsibility/route.js";
import commandRoute from "./03-behavioral/14-command/route.js";
import interpreterRoute from "./03-behavioral/15-interpreter/route.js";
import iteratorRoute from "./03-behavioral/16-iterator/route.js";
import mediatorRoute from "./03-behavioral/17-mediator/route.js";
import mementoRoute from "./03-behavioral/18-memento/route.js";
import observerRoute from "./03-behavioral/19-observer/route.js";
import stateRoute from "./03-behavioral/20-state/route.js";
import strategyRoute from "./03-behavioral/21-strategy/route.js";
import templateMethodRoute from "./03-behavioral/22-template-method/route.js";
import visitorRoute from "./03-behavioral/23-visitor/route.js";

const app = express();
app.use(express.json());

// Creational (5)
app.use("/api/singleton", singletonRoute);
app.use("/api/factory-method", factoryMethodRoute);
app.use("/api/abstract-factory", abstractFactoryRoute);
app.use("/api/builder", builderRoute);
app.use("/api/prototype", prototypeRoute);

// Structural (7)
app.use("/api/adapter", adapterRoute);
app.use("/api/bridge", bridgeRoute);
app.use("/api/composite", compositeRoute);
app.use("/api/decorator", decoratorRoute);
app.use("/api/facade", facadeRoute);
app.use("/api/flyweight", flyweightRoute);
app.use("/api/proxy", proxyRoute);

// Behavioral (11)
app.use("/api/chain-of-responsibility", chainRoute);
app.use("/api/command", commandRoute);
app.use("/api/interpreter", interpreterRoute);
app.use("/api/iterator", iteratorRoute);
app.use("/api/mediator", mediatorRoute);
app.use("/api/memento", mementoRoute);
app.use("/api/observer", observerRoute);
app.use("/api/state", stateRoute);
app.use("/api/strategy", strategyRoute);
app.use("/api/template-method", templateMethodRoute);
app.use("/api/visitor", visitorRoute);

app.get("/", (_req, res) => {
  res.json({
    handbook: "Gang of Four (GoF) Design Patterns in Node.js + TypeScript",
    totalPatterns: 23,
    categories: {
      creational: [
        "GET  /api/singleton/status",
        "POST /api/singleton/query",
        "POST /api/factory-method/send",
        "POST /api/abstract-factory/process-media",
        "POST /api/builder/create",
        "GET  /api/prototype/templates",
        "POST /api/prototype/clone",
      ],
      structural: [
        "POST /api/adapter/process",
        "POST /api/bridge/alert",
        "POST /api/composite/budget",
        "POST /api/decorator/fetch",
        "POST /api/facade/checkout",
        "POST /api/flyweight/render",
        "GET  /api/proxy/report",
      ],
      behavioral: [
        "POST /api/chain-of-responsibility/process",
        "POST /api/command/create | /undo | /redo",
        "POST /api/interpreter/evaluate",
        "GET  /api/iterator/demo",
        "POST /api/mediator/login",
        "POST /api/memento/save | /undo | /redo",
        "POST /api/observer/order-placed",
        "POST /api/state/reset | /pay | /ship | /deliver",
        "POST /api/strategy/calculate",
        "POST /api/template-method/import",
        "POST /api/visitor/invoice",
      ],
    },
  });
});

export default app;
