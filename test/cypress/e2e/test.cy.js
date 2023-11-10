/// <reference types="cypress" />

// Copyright (c) 2023 Heiko Lübbe
// This software is licensed under the MIT License.
// For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
//
// Cypress automated Joomla module test, install.cy.js (respective install3.ca.js) must have run once beforehand
// Is working for Joomla versions 3, 4 and 5.

// using doAdministratorLogin() from npm joomla-cypress, but most by Cypress 'native' as also supporting Joomla 3
import "joomla-cypress";

describe(`Test Joomla ${Cypress.env(
  "joomla_version"
)} module zitat-service.de`, () => {

  const languages = ["de", "en", "es", "ja", "uk"];

  /**
   * Set module options with:
   *   1. backend login as admin
   *   2. open the module zitat-service.de
   *   3. set all module options back to the defaults
   *   4. set given options with #id to value
   *   5. set all advanced options back to the defaults
   *   6. set given advanced options with #id to value
   *   7. save module configuration
   */
  function setOption(options, advanced = {}) {
    // 1. backend login as admin
    if (Cypress.env("joomla_version") === "3") {
      // do admin login by own
      cy.visit("/administrator/index.php");
      cy.get("#mod-login-username").type(Cypress.env("username"));
      cy.get("#mod-login-password").type(Cypress.env("password"));
      cy.get("button.btn.btn-primary.btn-block.btn-large.login-button").click();
    } else {
      cy.doAdministratorLogin(Cypress.env("username"), Cypress.env("password"));
    }

    // 2. open the module zitat-service.de
    cy.visit("/administrator/index.php?option=com_modules");
    //cy.searchForItem("zitat-service.de") - don't use as not available for Joomla 3
    cy.contains("a", "zitat-service.de").should("be.visible").click();

    // 3. set all module options back to the defaults ('*' repective 'frontend' for language)
    cy.get("#jform_params_user")
      .invoke("val", "")
      .trigger("change", { force: true });
    cy.get("#jform_params_author")
      .invoke("val", "")
      .trigger("change", { force: true });
    cy.get("#jform_params_category")
      .invoke("val", "")
      .trigger("change", { force: true });
    cy.get("#jform_params_language").select("", { force: true });

    // 4. set given options with #id to value
    Object.entries(options).forEach(([id, value]) => {
      cy.log(`Set module parameter "${id}" to "${value}"`);
      cy.get(id).invoke('val', value).trigger('change', { force: true });
    });

    // 5. set all advanced options back to the defaults (empty values)
    // cy.contains('a', 'Advanced').click({ force: true });
    //cy.get("#jform_params_target").clear();
    // cy.get('a[data-toggle="tab"]').contains('Advanced').click();
    // cy.contains('a', 'Advanced').click();
    // cy.wait(100000);

    // // 6. set given advanced options with #id to value
    // Object.entries(advanced).forEach(([id, value]) => {
    //   cy.get(id).invoke("val", value).trigger("change", { force: true });
    // });

    // 7. save module configuration
    cy.get("button.button-save").contains("Save & Close").click();
    // Check for the success message (Joomla 3 w/o final dot)
    cy.contains(".alert-message", /Module saved\.?/, { timeout: 30000 }).should(
      "be.visible"
    );

    // ignore backend admin logout
  }

  describe("set user plus frontend multi-language test", () => {
    // choose user 'heikoAdmin' (id 1) as this one has exactly one quote in each language
    it("prepare multi-language test with choosing user 'heikoAdmin'", function () {
      setOption({ "#jform_params_user": "1" });
    });

    // expected results
    const testData = {
      de: {
        quotation: "der zankapfel schmeckt bitter",
        quotationLink: "https://www.zitat-service.de/de/quotations/1871",
        source: "Mastodon Tröt, 2023",
        sourceLink: "https://troet.cafe/@BauernHauer/109633116386811032",
        author: "SprachFleisch",
        authorLink: "https://troet.cafe/@BauernHauer",
      },
      en: {
        quotation: "Hardware eventually fails. Software eventually works.",
        quotationLink: "https://www.zitat-service.de/en/quotations/1872",
        source: "Michael Hartung",
        // no authorLink in en
      },
      es: {
        quotation:
          "No se ve bien sino con el corazón. Lo esencial es invisible a los ojos.",
        quotationLink: "https://www.zitat-service.de/es/quotations/1919",
        source: "El principito, 1943",
        sourceLink: "https://es.wikipedia.org/wiki/Antoine_de_Saint-Exupéry",
        author: "Antoine de Saint-Exupéry",
        // no authorLink in es
      },
      ja: {
        quotation: "七転び八起き",
        quotationLink: "https://www.zitat-service.de/ja/quotations/1913",
        source: "日本の慣用句",
        // no sourceLink and no authorLink in ja
      },
      uk: {
        quotation: "Лучше любить і робить, аніж писать і го­ворить.",
        quotationLink: "https://www.zitat-service.de/uk/quotations/1917",
        source: "Лист до Я. В. Тарновському, 1860",
        sourceLink: "https://uk.wikipedia.org/wiki/Шевченко_Тарас_Григорович",
        author: "Тарас Григорович Шевченко",
      },
    };

    Object.entries(testData).forEach(
      ([
        lang,
        { quotation, quotationLink, source, sourceLink, author, authorLink },
      ]) => {
        it(`check the presence of quote elements in ${lang}`, () => {
          cy.visit("/index.php/" + lang);

          cy.get("#zitat-service").should("exist");
          cy.get("#zitat-service .quote").should("exist");

          cy.get(".quote .quotation")
            .should("exist")
            .find("a")
            .should("have.attr", "href", quotationLink)
            .contains(quotation);

          cy.get(".quote .source").should("exist").contains(source);

          if (sourceLink) {
            cy.get(".quote .source")
              .find('a[href="' + sourceLink + '"]')
              .should("have.attr", "href", sourceLink);
          }

          if (author) {
            cy.get(".quote .source").contains(author);

            if (authorLink) {
              cy.get(".quote .source")
                .find('a[href="' + authorLink + '"]')
                .should("have.attr", "href", authorLink);
            }
          }
        });
      }
    );
  });

  describe("set author option", () => {
    // author Mark Twain (id 36) has 20 quotes in German and English
    it("prepare author test with choosing author 'Mark Twain'", function () {
      setOption({ "#jform_params_author": "36" });
    });

    // expected results
    const testData = {
      de: {
        author: "Mark Twain",
        authorLink: "https://de.wikipedia.org/wiki/Mark_Twain",
      },
      en: {
        author: "Mark Twain",
        authorLink: "https://en.wikipedia.org/wiki/Mark_Twain",
      },
    };

    // five tests in the five languages
    languages.forEach((lang) => {
      it(`check ${
        testData[lang] ? "the presence of quote for author" : "error"
      } in ${lang}`, () => {
        cy.visit(`/index.php/${lang}`);
        cy.get("#zitat-service").should("exist");
        if (testData[lang]) {
          cy.get(".quote .source").contains(testData[lang].author);
          if (testData[lang].authorLink) {
            cy.get(".quote .source")
              .find('a[href="' + testData[lang].authorLink + '"]')
              .should("have.attr", "href", testData[lang].authorLink);
          }
        } else {
          cy.get("#zitat-service").contains(
            "Error: No quote found for given parameters"
          );
        }
      });
    });
  });

  describe("set category option", () => {
    // category 'Ant' (id 305) has one quote in German
    it("prepare category test with choosing category 'Ant'", function () {
      setOption({ "#jform_params_category": "305" });
    });

    // expected results
    const testData = {
      de: {
        quotation:
          "Treffen sich zwei Ameisen. Fragt die eine: „Und – was machen Sie so?” Sagt die andere: „Sie meinen beruflich?”",
      },
    };

    // five tests in the five languages
    languages.forEach((lang) => {
      it(`check ${
        testData[lang] ? "the presence of quote for category" : "error"
      } in ${lang}`, () => {
        cy.visit(`/index.php/${lang}`);
        cy.get("#zitat-service").should("exist");
        if (testData[lang]) {
          cy.get("#zitat-service .quote").should("exist");
          cy.get(".quote .quotation")
            .should("exist")
            .contains(testData[lang].quotation);
        } else {
          cy.get("#zitat-service").contains(
            "Error: No quote found for given parameters"
          );
        }
      });
    });
  });

  describe("set all languages option", () => {
    // category 'Ant' (id 305) has one quote in German
    it("prepare category test with choosing category 'Ant' and language 'all'", function () {
      setOption({
        "#jform_params_category": "305",
        "#jform_params_language": "all",
      });
    });

    // expected result
    const quote =
      "Treffen sich zwei Ameisen. Fragt die eine: „Und – was machen Sie so?” Sagt die andere: „Sie meinen beruflich?”";

    // five tests in the five languages
    languages.forEach((lang) => {
      it(`check the presence of quote in ${lang}`, () => {
        cy.visit(`/index.php/${lang}`);
        cy.get("#zitat-service").should("exist");
        cy.get("#zitat-service .quote").should("exist");
        cy.get(".quote .quotation").should("exist").contains(quote);
      });
    });
  });

  describe("set one language 'de' option", () => {
    // category 'Ant' (id 305) has one quote in German
    it("prepare category test with choosing category 'Ant' and language 'de'", function () {
      setOption({
        "#jform_params_category": "305",
        "#jform_params_language": "de",
      });
    });

    // expected result
    const quote =
      "Treffen sich zwei Ameisen. Fragt die eine: „Und – was machen Sie so?” Sagt die andere: „Sie meinen beruflich?”";

    // five tests in the five languages
    languages.forEach((lang) => {
      it(`check the presence of quote in ${lang}`, () => {
        cy.visit(`/index.php/${lang}`);
        cy.get("#zitat-service").should("exist");
        cy.get("#zitat-service .quote").should("exist");
        cy.get(".quote .quotation").should("exist").contains(quote);
      });
    });
  });
});
