import express from "express";
import singletonRouter from "./controllers/singletonController.js";
import factoryRouter from "./controllers/factoryController.js";
import builderRouter from "./controllers/BuilderController.js";
import prototypeRouter from "./controllers/PrototypeController.js";
import abstractFactoryRouter from "./controllers/AbstractFactoryController.js";
import adapterRouter from "./controllers/adapterController.js";
import compositeRouter from "./controllers/compositeController.js";
import chainRouter from "./controllers/chainOfResponsibilityController.js";
import commandRouter from "./controllers/commandController.js";

const app = express();

app.use(express.json());

// Creational Patterns API Endpoints
app.use("/api/singleton", singletonRouter);
app.use("/api/factory-method", factoryRouter);
app.use("/api/builder", builderRouter);
app.use("/api/prototype", prototypeRouter);
app.use("/api/abstract-factory", abstractFactoryRouter);

// Structural Patterns API Endpoints
app.use("/api/adapter", adapterRouter);
app.use("/api/composite", compositeRouter);

// Behavioral Patterns API Endpoints
app.use("/api/chain-of-responsibility", chainRouter);
app.use("/api/command", commandRouter);

app.get("/", (req, res) => {
  res.json({
    project: "Production Design Patterns in Node.js / TypeScript",
    category: "All Design Patterns (Creational, Structural, Behavioral)",
    totalPatterns: 25,
    endpoints: {
      // Creational
      singleton: {
        status: "GET /api/singleton/status",
        query: "POST /api/singleton/query",
      },
      factoryMethod: {
        send: "POST /api/factory-method/send",
      },
      builder: {
        create: "POST /api/builder/create",
      },
      prototype: {
        templates: "GET /api/prototype/templates",
        clone: "POST /api/prototype/clone",
      },
      abstractFactory: {
        processMedia: "POST /api/abstract-factory/process-media",
      },

      // Structural
      adapter: {
        process: "POST /api/adapter/process",
      },
      bridge: {
        processMedia: "POST /api/bridge/process-media",
      },
      composite: {
        create: "POST /api/composite/create-article",
      },
      decorator: {
        apiData: "POST /api/decorator/api-data",
      },
      facade: {
        processMedia: "POST /api/facade/process-media",
      },
      flyweight: {
        getOrCreate: "POST /api/flyweight/asset-get-or-create",
        stats: "GET /api/flyweight/asset-stats",
      },

      // Behavioral
      "chain-of-responsibility": {
        process: "POST /api/chain-of-responsibility/process",
      },
      command: {
        create: "POST /api/command/create",
        undo: "POST /api/command/undo",
        redo: "POST /api/command/redo",
        history: "GET /api/command/history",
      },
      iterator: {
        demo: "GET /api/iterator/demo",
      },
      mediator: {
        login: "POST /api/mediator/login",
      },
      memento: {
        form: "POST /api/memento/form",
        undo: "POST /api/memento/undo",
        redo: "POST /api/memento/redo",
      },
      observer: {
        measurements: "POST /api/observer/measurements",
      },
      strategy: {
        calculate: "POST /api/strategy/calculate",
        strategies: "GET /api/strategies",
      },
      "template-method": {
        registered: "POST /api/template-method/registered",
        admin: "POST /api/template-method/admin",
        demo: "GET /api/template-method/demo",
      },
    },
  });
});

export default app;