/// <reference types="cypress" />

// Copyright (c) 2023 Heiko Lübbe
// This software is licensed under the MIT License.
// For the full license text, see the LICENSE file in the project root or visit https://opensource.org/licenses/MIT
//
// Cypress automated Joomla module test, install.cy.js (respective install3.ca.js) must have run once beforehand
// Is working for Joomla versions 3, 4 and 5.

// using doAdministratorLogin() from npm joomla-cypress, but most by Cypress 'native' as also supporting Joomla 3
import "joomla-cypress";
import * as TestHelpers from "./testHelper";

describe(`Test module zitat-service.de for Joomla ${Cypress.env(
  "joomla_version"
)}`, () => {

  // https://github.com/muhme/quote_joomla/issues/2 "backend translation of the modules is broken"
  describe("Backend I18N translation", () => {

    const description = {
      en: "Displays a random quote",
      de: "Zeigt ein zufälliges Zitat",
      es: "Muestra una cita aleatoria",
      ja: "ランダムな引用",
      uk: "Відображає випадкову цитату"
    }
    // five tests for the five locales
    TestHelpers.LOCALES.forEach((locale) => {
      it(`verify module translation for ${locale} on Module tab`, function () {
        TestHelpers.doLogin(locale);
        TestHelpers.openModule();
        cy.contains('h2', 'zitat-service.de').should('exist');
        cy.contains(description[locale.substring(0, 2)]).should('be.visible');
        cy.get('body').then($body => {
          if ($body.text().includes('MOD_ZITAT_')) {
            throw new Error('String "MOD_ZITAT_" found on Module tab');
          }
        });
      });
    });

    const queryMethod = {
      en: "Query Method",
      de: "Abfragemethode",
      es: "Método de Consulta",
      ja: "クエリ方法",
      uk: "Метод запиту"
    }
    // five tests for the five locales
    TestHelpers.LOCALES.forEach((locale) => {
      it(`verify module translation for ${locale} on Advanced tab`, function () {
        TestHelpers.doLogin(locale);
        TestHelpers.openModule();
        cy.contains('h2', 'zitat-service.de').should('exist');
        if (Cypress.env("joomla_version") === "3") {
          // Joomla 3 uses the Bootstrap 2.x framework for its admin UI
          cy.get('a[href="#attrib-advanced"]').click({ force: true });
        } else {
          cy.get(
            'div[role="tablist"] button[aria-controls="attrib-advanced"]'
          ).click();
        }
        cy.contains(queryMethod[locale.substring(0, 2)]).should('be.visible');
        cy.get('body').then($body => {
          if ($body.text().includes('MOD_ZITAT_')) {
            throw new Error('String "MOD_ZITAT_" found on Advanced tab');
          }
        });
      });
    });
  });

  // zitat-service user 'heikoAdmin' (id 1) has exactly one quote in each language
  interface TestData {
    quotation: string;
    quotationLink: string;
    source: string;
    sourceLink?: string;
    author?: string;
    authorLink?: string;
  }
  interface LanguageTestData {
    [key: string]: TestData;
  }
  const heikoAdminTestData: LanguageTestData = {
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

  describe("JavaScript-based and set user and frontend multi-language test", () => {
    // choose zitat-service user 'heikoAdmin' (id 1) as this one has exactly one quote in each language
    it("prepare multi-language test with choosing zitat-service user 'heikoAdmin'", function () {
      TestHelpers.setOption({ "#jform_params_user": "1" });
    });

    Object.entries(heikoAdminTestData).forEach(
      ([
        lang,
        { quotation, quotationLink, source, sourceLink, author, authorLink },
      ]) => {
        it(`check the presence of quote elements in ${lang}`, () => {
          TestHelpers.myVisit("/index.php/" + lang);

          // <div id="zitat-service"> only from JavaScript
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

  describe("Joomla-based and set user and frontend multi-language test", () => {
    // choose zitat-service user 'heikoAdmin' (id 1) as this one has exactly one quote in each language
    it("prepare multi-language test with choosing zitat-service user 'heikoAdmin' and query method 'from Joomla'", function () {
      TestHelpers.setOption(
        { "#jform_params_user": "1" },
        {
          'input[type="radio"][name="jform[params][script]"][value="0"]':
            "check",
        }
      );
    });

    Object.entries(heikoAdminTestData).forEach(
      ([
        lang,
        { quotation, quotationLink, source, sourceLink, author, authorLink },
      ]) => {
        it(`check the presence of quote elements in ${lang}`, () => {
          TestHelpers.myVisit("/index.php/" + lang);

          // <div id="zitat-service"> only from JavaScript
          cy.get("#zitat-service").should("not.exist");

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
      TestHelpers.setOption({ "#jform_params_author": "36" });
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
    TestHelpers.languages().forEach((lang) => {
      it(`check ${testData[lang] ? "the presence of quote for author" : "error"
        } in ${lang}`, () => {
          TestHelpers.myVisit(`/index.php/${lang}`);
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
      TestHelpers.setOption({ "#jform_params_category": "305" });
    });

    // expected results
    const testData = {
      de: {
        quotation:
          "Treffen sich zwei Ameisen. Fragt die eine: „Und – was machen Sie so?” Sagt die andere: „Sie meinen beruflich?”",
      },
    };

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check ${testData[lang] ? "the presence of quote for category" : "error"
        } in ${lang}`, () => {
          TestHelpers.myVisit(`/index.php/${lang}`);
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
      TestHelpers.setOption({
        "#jform_params_category": "305",
        "#jform_params_language": "all",
      });
    });

    // expected result
    const quote =
      "Treffen sich zwei Ameisen. Fragt die eine: „Und – was machen Sie so?” Sagt die andere: „Sie meinen beruflich?”";

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check the presence of quote in ${lang}`, () => {
        TestHelpers.myVisit(`/index.php/${lang}`);
        cy.get("#zitat-service").should("exist");
        cy.get("#zitat-service .quote").should("exist");
        cy.get(".quote .quotation").should("exist").contains(quote);
      });
    });
  });

  describe("set one language 'de' option", () => {
    // category 'Ant' (id 305) has one quote in German
    it("prepare category test with choosing category 'Ant' and language 'de'", function () {
      TestHelpers.setOption({
        "#jform_params_category": "305",
        "#jform_params_language": "de",
      });
    });

    // expected result
    const quote =
      "Treffen sich zwei Ameisen. Fragt die eine: „Und – was machen Sie so?” Sagt die andere: „Sie meinen beruflich?”";

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check the presence of quote in ${lang}`, () => {
        TestHelpers.myVisit(`/index.php/${lang}`);
        cy.get("#zitat-service").should("exist");
        cy.get("#zitat-service .quote").should("exist");
        cy.get(".quote .quotation").should("exist").contains(quote);
      });
    });
  });

  const target = "quoteCypressTest";

  describe("JavaScript-based and no target for all links", () => {
    it("prepare reset to all defaults", function () {
      TestHelpers.setOption({});
    });

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check there is no target in any link for ${lang} in ${lang}`, () => {
        TestHelpers.myVisit(`/index.php/${lang}`);
        cy.get(".quote a").each(($el) => {
          // for each link found inside a .quote div, check that the target attribute is 'quoteCypressTest'
          cy.wrap($el).should("not.have.attr", "target", "quoteCypressTest");
        });
      });
    });
  });

  describe("JavaScript-based and set target for all links", () => {
    it("prepare with target for HTML links", function () {
      TestHelpers.setOption({}, { "#jform_params_target": target });
    });

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check target is set for all links in ${lang}`, () => {
        TestHelpers.myVisit(`/index.php/${lang}`);
        cy.get(".quote a").each(($el) => {
          // for each link found inside a .quote div, check that the target attribute is 'quoteCypressTest'
          cy.wrap($el).should("have.attr", "target", "quoteCypressTest");
        });
      });
    });
  });

  describe("Joomla-based and no target for all links", () => {
    it("prepare query method 'from Joomla'", function () {
      TestHelpers.setOption(
        {},
        {
          'input[type="radio"][name="jform[params][script]"][value="0"]':
            "check",
        }
      );
    });

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check there is no target in any link in ${lang}`, () => {
        TestHelpers.myVisit(`/index.php/${lang}`);
        cy.get(".quote a").each(($el) => {
          // for each link found inside a .quote div, check that the target attribute is 'quoteCypressTest'
          cy.wrap($el).should("not.have.attr", "target", "quoteCypressTest");
        });
      });
    });
  });

  describe("Joomla-based and set target for all links", () => {
    it("prepare query method 'from Joomla' and set target for all links", function () {
      TestHelpers.setOption(
        {},
        {
          "#jform_params_target": target,
          'input[type="radio"][name="jform[params][script]"][value="0"]':
            "check",
        }
      );
    });

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check target is set for all links in ${lang}`, () => {
        TestHelpers.myVisit(`/index.php/${lang}`);
        cy.get(".quote a").each(($el) => {
          // for each link found inside a .quote div, check that the target attribute is 'quoteCypressTest'
          cy.wrap($el).should("have.attr", "target", "quoteCypressTest");
        });
      });
    });
  });

  describe("set advanced option min-height", () => {
    const minHeight = "234px";
    it("prepare min-height test with setting height", function () {
      TestHelpers.setOption({}, { "#jform_params_height": minHeight });
    });

    // five tests in the five languages
    TestHelpers.languages().forEach((lang) => {
      it(`check min-height in ${lang}`, () => {
        TestHelpers.myVisit(`/index.php/${lang}`);
        cy.get(".quote a").each(($el) => {
          cy.get("#zitat-service").should(($div) => {
            const style = window.getComputedStyle($div[0]);
            expect(style.minHeight).to.equal(minHeight);
          });
        });
      });
    });
  });
});
