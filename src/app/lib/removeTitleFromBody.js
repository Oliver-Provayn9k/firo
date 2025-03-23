// lib/removeTitleFromBody.js

/**
 * Normalizuje reťazec:
 * - odstráni interpunkciu (.,!?)
 * - zmení na malé písmená
 * - odstráni nadbytočné medzery
 */
function normalizeString(str) {
  return str.replace(/[.,!?]/g, "").toLowerCase().trim();
}

/**
 * Ak je začiatok textu (po normalizácii) rovnaký ako nadpis (po normalizácii),
 * odstráni z textu prvú časť zodpovedajúcu dĺžke nadpisu.
 *
 * @param {string} title - Nadpis článku
 * @param {string} body - Text článku
 * @returns {string} Upravený text článku bez duplikovaného nadpisu
 */
export function removeTitleFromBody(title, body) {
  const normTitle = normalizeString(title);

  // Zoberieme z body prvých (title.length + pár znakov navyše) pre pokrytie interpunkcie, medzier atď.
  const snippet = body.slice(0, title.length + 5);
  const normBodyStart = normalizeString(snippet);

  // Ak začína rovnakým textom, odstránime túto časť
  if (normBodyStart.startsWith(normTitle)) {
    return body.slice(title.length).trimStart();
  }

  return body;
}
