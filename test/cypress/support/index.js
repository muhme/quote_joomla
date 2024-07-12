// cypress/support/index.js – Loaded automatically before the test files
//
// Copyright (c) 2023 - 2024 Heiko Lübbe
// This software is licensed under the MIT License.

// Register additional Cypress custom commands from npm module 'joomla-cypress'
import { registerCommands } from "joomla-cypress";
registerCommands();

// Handle uncaught exceptions originating from Joomla to prevent tests from failing.
// An example is "Uncaught TypeError: window.parent.jQuery is not a function".
// You can see them in Cypress GUI JavaScript console or setting ELECTRON_ENABLE_LOGGING=1.
Cypress.on("uncaught:exception", (err, runnable) => {
  console.log("err :" + err);
  console.log("runnable :" + runnable);
  return false;
});
