/* L'Atelier Volant — fonctionnement du site.
   Les textes, prix, départements et coordonnées se modifient dans config.js, pas ici. */
(() => {
"use strict";

const S = window.SITE;
const E = S.entreprise;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const NB = " ";
const euro = (n) => `${n}${NB}€`;
const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const slug = (s) => norm(s).replace(/ /g, "-");
const pad = (n) => String(n).padStart(2, "0");
document.documentElement.lang = "fr";

/* ------------------------------------------------------------------ */
/* Icônes                                                              */
/* ------------------------------------------------------------------ */
const ICONS = {
  arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  back: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  chev: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  maison: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.8 9.4V20h12.4V9.4"/><path d="M10 20v-5.2h4V20"/>',
  outil: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.4 1.4 0 0 1 0 2l-6.2 6.2a1.4 1.4 0 0 1-2 0z"/><circle cx="8" cy="8" r="1.4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  tel: '<path d="M5.2 3.5h3.3l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 6.9 6.9l1.4-2.1 4.2 1.6v3.3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.2 5.7a2 2 0 0 1 2-2.2z"/>',
  wa: '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5 5 16.2a8.5 8.5 0 1 1 15.5-4.6z"/><path d="M9.2 8.4c-.4 2.9 3.4 6.7 6.3 6.3l.9-1.5-2-1-.9.8a4.6 4.6 0 0 1-2.6-2.6l.8-.9-1-2z"/>',
  bouclier: '<path d="M12 3 19 5.8v5.6c0 4.4-2.9 7.9-7 9.6-4.1-1.7-7-5.2-7-9.6V5.8z"/><path d="m8.9 12.1 2.2 2.2 4.1-4.3"/>',
  diag: '<circle cx="10.5" cy="10.5" r="6.8"/><path d="m15.5 15.5 5 5M6.6 10.6h1.8l1.1-2.2 1.9 4.3 1.1-2.1h1.3"/>',
  chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  euro: '<path d="M17.5 6.6a7 7 0 1 0 0 10.8"/><path d="M4.5 10.3h9M4.5 13.7h9"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.3"/><circle cx="17" cy="17" r="2.3"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  flash: '<path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.1"/>'
};
const icon = (name, cls = "") =>
  `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
const star = (on) =>
  `<svg class="ico ${on ? "" : "off"}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS.star}</svg>`;

/* ------------------------------------------------------------------ */
/* Données et prix                                                     */
/* ------------------------------------------------------------------ */
const PANNES = S.pannes;
const PANNE = Object.fromEntries(PANNES.map((p) => [p.id, p]));
const TIERS = S.qualitesEcran;
const BRANDS = S.marques;
const BRAND = Object.fromEntries(BRANDS.map((b) => [b.id, b]));
const MODELS = {};
BRANDS.forEach((b) => (b.series || []).forEach((se) => se.modeles.forEach((m) => {
  const id = `${b.id}-${slug(m[0])}`;
  MODELS[id] = { id, brand: b.id, name: m[0], prices: m.slice(1) };
})));
const modelId = (b, m) => `${b.id}-${slug(m[0])}`;

// Index des prix dans chaque ligne de modèle : 0-2 = écran par qualité, puis une case par autre panne.
const PIDX = {};
PANNES.filter((p) => p.id !== "ecran").forEach((p, i) => { PIDX[p.id] = 3 + i; });
const listOf = (m) => (m && m.prices ? m.prices : S.prixIndicatifs);
const screenPrice = (m, tierId) => listOf(m)[TIERS.findIndex((t) => t.id === tierId)];
const screenFrom = (m) => { const v = listOf(m).slice(0, 3).filter((x) => x != null); return v.length ? Math.min(...v) : null; };
const priceOf = (m, id) => (id === "ecran" ? screenFrom(m) : listOf(m)[PIDX[id]]);
const tierName = (t) => t.nom.replace("{marque}", (D.model && BRAND[D.model.brand] && BRAND[D.model.brand].marque) || "constructeur").trim();
const minScreen = Math.min(...Object.values(MODELS).map((m) => screenFrom(m)).filter((v) => v != null));

/* État du devis */
const D = {
  brand: "apple", model: null, query: "", customOpen: false, customText: "", sousMarque: "",
  pannes: [], tier: null, dept: null, prenom: "", tel: "", ref: "", auto: false,
  via: "", fPrenom: "", fTel: "", fSent: null
};
const isCustom = () => !!(D.model && !D.model.prices);
const modelName = () => (D.model ? D.model.name : "");
const deptTxt = () => {
  if (!D.dept) return "";
  if (D.dept === "hors") return "Hors " + E.region;
  const d = S.zone.departements.find((x) => x[0] === D.dept);
  return d ? `${d[1]} (${d[0]})` : D.dept;
};

/* Petits outils de texte et de date */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

/* D'où vient le client : ?via=tiktok dans le lien, sinon le navigateur intégré de l'appli, sinon le site d'origine */
function detectVia() {
  let v = "";
  try { const q = new URLSearchParams(location.search); v = (q.get("via") || q.get("utm_source") || "").toLowerCase().trim(); } catch (err) { /* rien */ }
  if (!v) {
    const ua = navigator.userAgent || "";
    if (/Instagram/i.test(ua)) v = "insta";
    else if (/BytedanceWebview|musical_ly|TikTok|trill_/i.test(ua)) v = "tiktok";
    else if (/Snapchat/i.test(ua)) v = "snap";
    else if (/FBAN|FBAV|FB_IAB/i.test(ua)) v = "facebook";
  }
  if (!v) {
    const r = document.referrer || "";
    if (/google\./i.test(r)) v = "google";
    else if (/instagram/i.test(r)) v = "insta";
    else if (/tiktok/i.test(r)) v = "tiktok";
    else if (/snapchat/i.test(r)) v = "snap";
    else if (/facebook/i.test(r)) v = "facebook";
  }
  try {
    if (v) sessionStorage.setItem("atelier-via", v);
    else v = sessionStorage.getItem("atelier-via") || "";
  } catch (err) { /* rien */ }
  return v;
}
const viaTxt = () => (D.via ? (S.sources && S.sources[D.via]) || cap(D.via) : "");

/* Reprise d'un devis commencé (stocké seulement sur le téléphone du client) */
const DRAFT = "atelier-volant-devis";
function saveDraft() {
  if (!D.model || D.ref || page === "devis") return;
  try {
    localStorage.setItem(DRAFT, JSON.stringify({
      ts: Date.now(), day: todayIso(), brand: D.brand,
      modelId: D.model.prices ? D.model.id : null,
      custom: D.model.prices ? null : { brand: D.model.brand, name: D.model.name },
      pannes: D.pannes, tier: D.tier, dept: D.dept, prenom: D.prenom
    }));
  } catch (err) { /* stockage indisponible : tant pis */ }
}
function clearDraft() { try { localStorage.removeItem(DRAFT); } catch (err) { /* rien */ } }
function loadDraft() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(DRAFT) || "null"); } catch (err) { return; }
  if (!d || Date.now() - d.ts > 14 * 864e5) return;
  D.brand = BRAND[d.brand] ? d.brand : "apple";
  D.model = d.modelId ? MODELS[d.modelId] || null : d.custom ? { id: "custom", brand: d.custom.brand, name: d.custom.name, prices: null } : null;
  if (!D.model) return;
  D.pannes = (d.pannes || []).filter((id) => PANNE[id] || id === S.diagnostic.id);
  D.tier = d.tier || null;
  D.dept = d.dept || null;
  D.prenom = d.prenom || "";
}
function resetDevis() {
  Object.assign(D, { model: null, query: "", customOpen: false, customText: "", sousMarque: "", pannes: [], tier: null, dept: null, ref: "", auto: false });
  clearDraft();
}
const resumeTarget = () => {
  if (!D.model) return "modele";
  if (!D.pannes.length) return "pannes";
  if (D.pannes.includes("ecran") && !D.tier) return "qualite";
  if (!D.dept) return "zone";
  return "numero";
};

function calc() {
  const lines = D.pannes.map((id) => {
    if (id === S.diagnostic.id) return { id, nom: S.diagnostic.court, meta: S.diagnostic.note, prix: S.diagnostic.prix, diag: true };
    const p = PANNE[id];
    if (id === "ecran") {
      const t = TIERS.find((x) => x.id === D.tier) || TIERS[0];
      return { id, nom: tierName(t), meta: `Garantie ${t.garantie} mois`, prix: screenPrice(D.model, t.id), garantie: t.garantie };
    }
    return { id, nom: p.court, meta: `Garantie ${p.garantie} mois`, prix: priceOf(D.model, id), garantie: p.garantie };
  });
  const paid = lines.filter((l) => !l.diag && l.prix != null).sort((a, b) => b.prix - a.prix);
  paid.forEach((l, i) => {
    l.remise = i === 0 ? 0 : i === 1 ? S.remises.deuxieme : S.remises.suivantes;
    l.final = Math.round(l.prix * (1 - l.remise / 100));
  });
  lines.forEach((l) => {
    if (l.diag) { l.final = paid.length ? 0 : l.prix; l.meta = paid.length ? "Offert avec la réparation" : S.diagnostic.note; }
    if (l.prix == null && !l.diag) l.final = null;
  });
  const total = lines.reduce((s, l) => s + (l.final || 0), 0);
  const save = lines.reduce((s, l) => s + (l.remise ? l.prix - l.final : 0), 0);
  const onQuote = lines.some((l) => l.final == null);
  const gar = lines.filter((l) => l.garantie).map((l) => l.garantie);
  return { lines, total, save, onQuote, garMin: gar.length ? Math.min(...gar) : null, garMax: gar.length ? Math.max(...gar) : null };
}

/* Numéro de téléphone */
const telDigits = (s) => {
  let d = String(s || "").replace(/\D/g, "");
  if (d.startsWith("0033")) d = d.slice(4);
  else if (d.startsWith("33") && d.length >= 11) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d;
};
const telValid = (s) => /^[1-9]\d{8}$/.test(telDigits(s));
const telNational = (s) => `0${telDigits(s)}`.replace(/(\d{2})(?=\d)/g, "$1 ");
const telIntl = (s) => `33${telDigits(s)}`;
const formatTyping = (v) => {
  const d = v.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  return d.slice(0, 10).replace(/(\d{2})(?=\d)/g, "$1 ");
};

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */
const waLink = (text, num = E.whatsapp) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
const makeRef = () => { const d = new Date(); return `${E.prefixeDemande}-${pad(d.getDate())}${pad(d.getMonth() + 1)}-${Math.floor(1000 + Math.random() * 9000)}`; };
const lineTxt = (l) => {
  if (l.final == null) return `• ${l.nom} : sur devis`;
  if (l.diag && l.final === 0) return `• ${l.nom} : offert`;
  return `• ${l.nom} : ${euro(l.final)}${l.remise ? ` (au lieu de ${euro(l.prix)}, −${l.remise} %)` : ""}`;
};

function msgReparateur() {
  const c = calc();
  const reply = `Bonjour${D.prenom ? " " + D.prenom : ""}, ici ${E.nom} 👋 Ton devis n° ${D.ref} pour ton ${modelName()} : ${c.onQuote ? "on regarde ensemble" : euro(c.total)}. Tu peux passer en boutique quand tu veux, ou dis-moi quand ça t'arrange.`;
  return [
    `🔧 Nouveau devis · ${E.nom}`,
    `N° ${D.ref}`,
    "",
    `📱 ${modelName()}${isCustom() ? " (hors grille, prix indicatif)" : ""}`,
    ...c.lines.map(lineTxt),
    `💶 Total : ${c.onQuote ? "à confirmer" : euro(c.total)}`,
    "",
    `📍 ${deptTxt()}`,
    `👤 ${D.prenom || "Client"} · ${telNational(D.tel)}`,
    viaTxt() ? `📣 Venu de : ${viaTxt()}` : "",
    "",
    `Répondre au client : ${waLink(reply, telIntl(D.tel))}`
  ].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i > 0)).join("\n");
}
function msgClient() {
  const c = calc();
  return [
    `Bonjour ${E.nom} 👋`,
    `Je viens de faire mon devis sur votre site (n° ${D.ref}).`,
    "",
    `📱 ${modelName()}`,
    ...c.lines.map(lineTxt),
    `💶 Total : ${c.onQuote ? "à confirmer" : euro(c.total)}`,
    "",
    `📍 ${deptTxt()}`,
    `👤 ${D.prenom || ""} · ${telNational(D.tel)}`.trim(),
    viaTxt() ? `📣 Je vous ai trouvé sur ${viaTxt()}` : ""
  ].filter((l, i, a) => l !== "" || i < a.length - 1).join("\n");
}

/* Envoi automatique sur le WhatsApp du réparateur (CallMeBot). Renvoie true si un envoi est parti. */
function envoyerAuto(texte) {
  const cle = S.envoiAuto && S.envoiAuto.callmebotCle;
  if (!cle) return false;
  const num = `+${(S.envoiAuto.numero || E.whatsapp).replace(/\D/g, "")}`;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(texte)}&apikey=${encodeURIComponent(cle)}`;
  try {
    fetch(url, { mode: "no-cors", keepalive: true }).catch(() => { new Image().src = url; });
  } catch (err) {
    new Image().src = url;
  }
  return true;
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
const STEP = { modele: 1, pannes: 2, qualite: 2, zone: 3, numero: 4, devis: 4 };
const STEPS = 4;
let page = "home";
let depth = 0;
let useHistory = true;

const prevOf = (p) => ({
  modele: "home", pannes: "modele", qualite: "pannes",
  zone: D.pannes.includes("ecran") ? "qualite" : "pannes",
  numero: "zone", devis: "numero", formation: "home"
})[p] || "home";

function guard(p) {
  const is = (list) => list.includes(p);
  if (is(["pannes", "qualite", "zone", "numero", "devis"]) && !D.model) return "modele";
  if (is(["qualite", "zone", "numero", "devis"]) && !D.pannes.length) return "pannes";
  if (p === "qualite" && !D.pannes.includes("ecran")) return "zone";
  if (is(["numero", "devis"]) && !D.dept) return "zone";
  if (p === "formation" && !(S.formation && S.formation.actif)) return "home";
  if (p === "devis" && !D.ref) return "numero";
  return p;
}
function go(p, replace) {
  page = guard(p);
  if (useHistory) {
    try {
      if (replace) history.replaceState({ p: page }, "");
      else { history.pushState({ p: page }, ""); depth++; }
    } catch (err) { useHistory = false; }
  }
  render();
}
function back() {
  if (useHistory && depth > 0) { history.back(); return; }
  go(prevOf(page), true);
}
window.addEventListener("popstate", (ev) => {
  depth = Math.max(0, depth - 1);
  page = guard((ev.state && ev.state.p) || "home");
  render();
});

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */
const head = (title, sub, kicker) =>
  `<div class="head">${kicker ? `<p class="kicker">${kicker}</p>` : ""}<h1 class="title" id="pageTitle" tabindex="-1">${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>`;
const stepK = (p) => `Étape ${STEP[p]} sur ${STEPS}`;

function faqHtml() {
  const fill = (s) => s.replace(/\{region\}/g, E.region).replace(/\{delai\}/g, E.delaiReponse).replace(/\{diagnostic\}/g, S.diagnostic.prix);
  return S.faq.map((f) => `<details class="qa"><summary><span>${esc(fill(f.q))}</span><span class="pm">${icon("plus", "ico--xs")}</span></summary><p class="qa__a">${esc(fill(f.r))}</p></details>`).join("");
}

const VIEWS = {
  home: () => {
    const F = S.formation;
    const deux = !!(F && F.actif);
    const n = D.pannes.length;
    const resume = D.model && !D.ref ? `
        <div class="resume">
          <span class="resume__ico">${icon("phone", "ico--s")}</span>
          <span class="resume__txt"><b>Devis en cours</b><span>${esc(modelName())}${n ? ` · ${n} réparation${n > 1 ? "s" : ""}` : ""}</span></span>
          <button type="button" class="resume__go" data-act="resume">Reprendre</button>
          <button type="button" class="resume__x" data-act="drop-draft" aria-label="Effacer ce devis">${icon("plus", "ico--xs")}</button>
        </div>` : "";
    return `
      <div class="page">
        ${resume}
        ${deux
          ? head("Qu'est-ce qui t'amène&nbsp;?", "Deux services, deux chemins. Choisis le tien.")
          : head("Ton téléphone réparé en boutique.", "Écran, batterie, charge… Vois ton prix avant même de venir.")}
        <div class="choices">
          <a class="choice choice--hi" href="#reparer" data-go="modele">
            <h2>${deux ? "Réparer mon téléphone" : "Obtenir mon devis"}</h2>
            <p>${deux ? "Ton prix en 40 secondes, sans surprise en boutique." : "Choisis ton modèle et la panne : ton prix s'affiche en 40 secondes."}</p>
            <span class="choice__foot"><span class="choice__from">Écran dès <b>${euro(minScreen)}</b> · prix fixe annoncé</span><span class="go">${icon("arrow")}</span></span>
          </a>
          ${F && F.actif ? `
          <a class="choice" href="#formation" data-go="formation">
            <span class="badge badge--line">Formation</span>
            <h2>${esc(F.titre)}</h2>
            <p>${esc(F.accroche)}</p>
            <span class="choice__foot"><span class="choice__from">${esc(F.infos.map((i) => i[1]).slice(0, 2).join(" · "))}</span><span class="go">${icon("arrow")}</span></span>
          </a>` : ""}
        </div>
        <p class="section-t">Avis clients${S.avisExemples ? " · exemples" : ""}</p>
        <div class="reviews">${S.avis.map((a) => `
          <figure class="review">
            <div class="stars" aria-label="${a.note} sur 5">${[1, 2, 3, 4, 5].map((n) => star(n <= a.note)).join("")}</div>
            <blockquote>${esc(a.texte)}</blockquote>
            <figcaption><span><b>${esc(a.prenom)} · ${esc(a.lieu)}</b><span>${esc(a.reparation)}</span></span>${S.avisExemples ? '<span class="tag">Exemple</span>' : ""}</figcaption>
          </figure>`).join("")}</div>
        <p class="section-t">Questions fréquentes</p>
        <div>${faqHtml()}</div>
      </div>`;
  },

  modele: () => {
    const b = BRAND[D.brand];
    const tabs = `<div class="tabs" role="group" aria-label="Marque">${BRANDS.map((x) => `<button type="button" class="tab" data-brand="${x.id}" aria-pressed="${x.id === D.brand}">${esc(x.onglet)}</button>`).join("")}</div>`;
    if (!b.series) {
      return `
        <div class="page">
          ${head("Quel modèle&nbsp;?", esc(b.astuce), stepK("modele"))}
          ${tabs}
          <p class="group__t">Marque</p>
          <div class="chips">${b.sousMarques.map((s) => `<button type="button" class="chip" data-sub="${esc(s)}" aria-pressed="${D.sousMarque === s}">${esc(s)}</button>`).join("")}</div>
          <div class="field"><label for="cModel">Modèle exact</label><input class="input" id="cModel" type="text" autocomplete="off" enterkeyhint="next" placeholder="ex. OnePlus 12" value="${esc(D.customText)}"></div>
          <p class="note">On n'a pas de grille pour ces marques : tu verras un prix indicatif, confirmé ensuite sur WhatsApp.</p>
        </div>`;
    }
    return `
      <div class="page">
        ${head("Quel modèle&nbsp;?", esc(b.astuce), stepK("modele"))}
        ${tabs}
        <label class="search"><span class="sr">Rechercher un modèle</span>${icon("search", "ico--s")}<input class="input" id="mSearch" type="search" autocomplete="off" enterkeyhint="search" placeholder="Rechercher ton modèle" value="${esc(D.query)}"></label>
        <div class="groups" id="mGroups">${groupsHtml()}</div>
        <button type="button" class="linkbtn" data-act="custom">Je ne trouve pas mon modèle</button>
        ${D.customOpen ? `<div class="field"><label for="cModel">Écris ton modèle</label><input class="input" id="cModel" type="text" autocomplete="off" enterkeyhint="next" placeholder="ex. ${esc(b.onglet)} 8" value="${esc(D.customText)}"></div>` : ""}
      </div>`;
  },

  pannes: () => {
    const R = S.remises;
    const rows = PANNES.map((p) => {
      const v = priceOf(D.model, p.id);
      const price = v == null ? "<small>prix</small>sur devis" : p.id === "ecran" ? `<small>dès</small>${euro(v)}` : euro(v);
      return row(p.id, p.nom, p.detail, price);
    });
    rows.push(row(S.diagnostic.id, S.diagnostic.nom, S.diagnostic.detail, `<small>diagnostic</small>${euro(S.diagnostic.prix)}`));
    return `
      <div class="page">
        ${head("Qu'est-ce qu'il faut réparer&nbsp;?", `${esc(modelName())} · choisis ce qui correspond.`, stepK("pannes"))}
        <div class="promo"><span class="promo__ico">${icon("percent", "ico--s")}</span><p>Tu peux en choisir plusieurs<b>−${R.deuxieme}&nbsp;% sur ta 2<sup>e</sup> réparation, −${R.suivantes}&nbsp;% sur les suivantes</b></p></div>
        <div class="list">${rows.join("")}</div>
        ${isCustom() ? '<p class="note">Prix indicatifs : ton modèle n\'est pas dans notre liste, on te confirme le prix sur WhatsApp.</p>' : '<p class="note">Prix comprenant la pièce et la main-d\'œuvre.</p>'}
      </div>`;
  },

  qualite: () => {
    const avail = TIERS.filter((t) => screenPrice(D.model, t.id) != null);
    const n = avail.length;
    const sub = n === 3 ? "Trois gammes, trois budgets. Toutes posées par un pro." : `${n === 2 ? "Deux" : "Une"} gamme${n > 1 ? "s" : ""} pour ce modèle. Toutes posées par un pro.`;
    return `
      <div class="page">
        ${head("Quelle qualité d'écran&nbsp;?", sub, stepK("qualite"))}
        <div class="tiers">${avail.map((t) => `
          <button type="button" class="tier" data-tier="${t.id}" aria-pressed="${D.tier === t.id}">
            <span class="tier__name">${esc(tierName(t))}${t.badge ? `<span class="badge badge--${t.ton}">${esc(t.badge)}</span>` : ""}</span>
            <span class="tier__desc">${esc(t.desc)}</span>
            <span class="tier__gar">${icon("bouclier", "ico--xs")}Garantie ${t.garantie} mois</span>
            <span class="tier__price">${euro(screenPrice(D.model, t.id))}</span>
          </button>`).join("")}</div>
        <button type="button" class="linkbtn" style="justify-self:center" data-act="diff">C'est quoi la différence&nbsp;?</button>
        <p class="note">Prix comprenant la pièce et la main-d'œuvre.${isCustom() ? " Prix indicatifs pour ton modèle." : ""}</p>
      </div>`;
  },

  zone: () => `
    <div class="page">
      ${head("Tu es dans quel département&nbsp;?", "On t'oriente vers la boutique la plus proche.", stepK("zone"))}
      <div class="depts">
        ${S.zone.departements.map(([num, nom]) => `<button type="button" class="dept" data-dept="${num}" aria-pressed="${D.dept === num}"><b>${esc(num)}</b><span>${esc(nom)}</span></button>`).join("")}
        <button type="button" class="dept dept--wide" data-dept="hors" aria-pressed="${D.dept === "hors"}">${esc(S.zone.horsZone)}</button>
      </div>
    </div>`,

  numero: () => {
    const c = calc();
    const hors = D.dept === "hors";
    return `
      <div class="page">
        ${head(hors ? "On regarde si c'est possible" : "Ton devis arrive", hors
          ? `On n'a pas encore de boutique hors ${esc(E.region)}. Laisse ton numéro : on te dit sur WhatsApp ce qu'on peut faire pour toi.`
          : `Laisse ton numéro, on t'écrit sur <b style="color:var(--ink)">WhatsApp</b> dans les ${esc(E.delaiReponse)}.`, stepK("numero"))}
        <div class="recapmini"><span class="recapmini__ico">${icon("check", "ico--s")}</span><span class="recapmini__txt"><b>${esc(modelName())}</b><span>${c.lines.length} réparation${c.lines.length > 1 ? "s" : ""} · ${esc(deptTxt())}</span></span></div>
        <form id="telForm" novalidate style="display:grid;gap:14px">
          <div class="field"><label for="fPrenom">Ton prénom <span class="opt">facultatif</span></label><input class="input" id="fPrenom" type="text" autocomplete="given-name" enterkeyhint="next" value="${esc(D.prenom)}"></div>
          <div class="field">
            <label for="fTel">Ton numéro WhatsApp</label>
            <div class="tel" id="telBox"><span class="flag" aria-hidden="true"></span><span class="tel__cc">+33</span><input id="fTel" type="tel" inputmode="tel" autocomplete="tel" enterkeyhint="send" placeholder="06 12 34 56 78" value="${esc(D.tel)}"></div>
          </div>
          <p class="err" id="telErr" hidden></p>
          <button type="submit" class="btn btn--accent" id="seeBtn">Voir mon devis</button>
          <p class="fine">Ton numéro sert uniquement à te recontacter pour ta réparation.</p>
        </form>
      </div>`;
  },

  devis: () => {
    const c = calc();
    const gar = c.garMin == null ? "Selon la pièce" : c.garMin === c.garMax ? `${c.garMax} mois` : `${c.garMin} à ${c.garMax} mois`;
    const status = D.auto
      ? `<div class="done"><span class="done__ico"><svg class="ico ico--s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span><span class="done__txt"><b>C'est transmis&nbsp;!</b><span>On t'écrit sur WhatsApp au ${esc(telNational(D.tel))} dans les ${esc(E.delaiReponse)}.</span></span></div>`
      : `<div class="done done--todo"><span class="done__ico">${icon("wa", "ico--s")}</span><span class="done__txt"><b>Dernière étape</b><span>Envoie ce devis sur WhatsApp pour réserver : on te répond dans les ${esc(E.delaiReponse)}.</span></span></div>`;
    return `
      <div class="page">
        ${head(`Voilà ton devis${D.prenom ? ", " + esc(D.prenom) : ""}`, "", `<span style="color:var(--ok)">Devis n° ${esc(D.ref)}</span>`)}
        ${status}
        <article class="ticket">
          <div class="ticket__top"><span class="tape">Devis</span><span class="ticket__ref">${esc(new Intl.DateTimeFormat("fr-FR").format(new Date()))}</span></div>
          <p class="ticket__model">${esc(modelName())}<span>${esc(deptTxt())}${isCustom() ? " · prix indicatif" : ""}</span></p>
          ${c.lines.map((l) => `
            <div class="tl">
              <span class="tl__n">${esc(l.nom)}${l.remise ? `<span class="minus">−${l.remise}&nbsp;%</span>` : ""}</span>
              <span class="tl__m">${esc(l.meta)}</span>
              <span class="tl__p">${l.final == null ? "Sur devis" : l.diag && l.final === 0 ? "Offert" : euro(l.final)}${l.remise ? `<s>${euro(l.prix)}</s>` : ""}</span>
            </div>`).join("")}
          <div class="cut"></div>
          <div class="ticket__total"><span>Total</span><b>${c.onQuote ? "À confirmer" : euro(c.total)}</b></div>
          ${c.save ? `<p class="ticket__save">Tu économises ${euro(c.save)} avec la remise multi-réparations.</p>` : ""}
        </article>
        <div class="facts">
          <div>Garantie<b>${esc(gar)}</b></div>
          <div>Durée<b>30 à 60 min</b></div>
          <div>Paiement<b>Après réparation</b></div>
        </div>
        <div class="actions">
          ${D.auto
            ? `<a class="btn btn--line" href="${waLink(msgClient())}" target="_blank" rel="noopener">${icon("wa")} Écrire sur WhatsApp maintenant</a>`
            : `<a class="btn btn--accent" href="${waLink(msgClient())}" target="_blank" rel="noopener">${icon("wa")} Envoyer mon devis sur WhatsApp</a>`}
          <button type="button" class="btn btn--line" data-go="pannes">Modifier mon devis</button>
        </div>
        <p class="section-t">Et maintenant&nbsp;?</p>
        <ol class="how">
          <li><span class="how__n">01</span><span class="how__txt"><b>On te répond sur WhatsApp</b><span>On confirme ton devis et on prépare la pièce.</span></span></li>
          <li><span class="how__n">02</span><span class="how__txt"><b>Tu passes en boutique</b><span>La plupart des réparations sont faites en moins d'une heure.</span></span></li>
          <li><span class="how__n">03</span><span class="how__txt"><b>Tu paies quand tout marche</b><span>Carte, espèces ou virement instantané.</span></span></li>
        </ol>
      </div>`;
  },

  formation: () => {
    const F = S.formation;
    const ICO = ["outil", "diag", "euro", "chat"];
    return `
      <div class="page">
        <div class="head"><span class="badge badge--line">Formation</span><h1 class="title" id="pageTitle" tabindex="-1">${esc(F.titre)}</h1><p class="sub">${esc(F.accroche)}</p></div>
        <p style="color:var(--muted)">${esc(F.intro)}</p>
        <div class="points">${F.points.map((p, i) => `<div class="point"><span class="point__ico">${icon(ICO[i % ICO.length], "ico--s")}</span><span class="point__txt"><b>${esc(p[0])}</b><span>${esc(p[1])}</span></span></div>`).join("")}</div>
        <div class="infos">${F.infos.map((x) => `<div><span>${esc(x[0])}</span><b>${esc(x[1])}</b></div>`).join("")}</div>
        <p class="section-t">Intéressé&nbsp;?</p>
        ${D.fSent == null ? `
        <form id="formForm" novalidate style="display:grid;gap:14px">
          <div class="field"><label for="ffPrenom">Ton prénom</label><input class="input" id="ffPrenom" type="text" autocomplete="given-name" value="${esc(D.fPrenom)}"></div>
          <div class="field"><label for="ffTel">Ton numéro WhatsApp</label><div class="tel" id="ffTelBox"><span class="flag" aria-hidden="true"></span><span class="tel__cc">+33</span><input id="ffTel" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78" value="${esc(D.fTel)}"></div></div>
          <p class="err" id="ffErr" hidden></p>
          <button type="submit" class="btn btn--accent">Je veux en savoir plus</button>
          <p class="fine">On t'envoie le programme et les prochaines dates sur WhatsApp.</p>
        </form>` : D.fSent
          ? `<div class="done"><span class="done__ico"><svg class="ico ico--s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span><span class="done__txt"><b>C'est noté&nbsp;!</b><span>On t'écrit sur WhatsApp dans les ${esc(E.delaiReponse)} avec le programme.</span></span></div>`
          : `<div class="done done--todo"><span class="done__ico">${icon("wa", "ico--s")}</span><span class="done__txt"><b>Dernière étape</b><span>Envoie-nous ta demande sur WhatsApp, on te répond avec le programme.</span></span></div>
             <a class="btn btn--accent" href="${waLink(msgFormation(false))}" target="_blank" rel="noopener">${icon("wa")} Envoyer sur WhatsApp</a>`}
      </div>`;
  }
};

function row(id, t, d, price) {
  const on = D.pannes.includes(id);
  return `<button type="button" class="row" data-panne="${id}" aria-pressed="${on}"><span class="box">${icon("check")}</span><span class="row__main"><span class="row__t">${esc(t)}</span><span class="row__d">${esc(d)}</span></span><span class="row__p">${price}</span></button>`;
}
function groupsHtml() {
  const b = BRAND[D.brand];
  const q = norm(D.query).replace(/ /g, "");
  const html = b.series.map((se) => {
    const items = se.modeles.filter((m) => !q || norm(m[0]).replace(/ /g, "").includes(q));
    if (!items.length) return "";
    return `<div class="group"><p class="group__t">${esc(se.nom)}</p><div class="list">${items.map((m) => {
      const id = modelId(b, m);
      const on = !!(D.model && D.model.id === id);
      return `<button type="button" class="row" data-model="${id}" aria-pressed="${on}"><span class="row__main"><span class="row__t">${esc(m[0])}</span></span>${icon(on ? "check" : "chev", "chev")}</button>`;
    }).join("")}</div></div>`;
  }).join("");
  return html || '<p class="empty">Aucun modèle ne correspond. Touche « Je ne trouve pas mon modèle » juste en dessous.</p>';
}
function msgFormation(auto) {
  return [
    auto ? `🎓 Demande formation · ${E.nom}` : `Bonjour ${E.nom} 👋`,
    auto ? "" : "La formation « Apprendre le métier » m'intéresse.",
    auto ? `👤 ${D.fPrenom || "Contact"} · ${telNational(D.fTel)}` : `👤 ${D.fPrenom} · ${telNational(D.fTel)}`,
    auto ? `Répondre : ${waLink(`Bonjour ${D.fPrenom}, ici ${E.nom} 👋 Merci pour ton intérêt pour la formation ! Voici le programme et les prochaines dates :`, telIntl(D.fTel))}` : ""
  ].filter(Boolean).join("\n");
}

/* ------------------------------------------------------------------ */
/* Rendu                                                               */
/* ------------------------------------------------------------------ */
function battery(step, full) {
  return `<span class="battery${full ? " is-full" : ""}" aria-label="Étape ${step} sur ${STEPS}"><span class="battery__body">${Array.from({ length: STEPS }, (_, k) => k + 1).map((i) => `<span class="battery__cell${i <= step ? " on" : ""}"></span>`).join("")}</span>${full ? "100 %" : `${step}/${STEPS}`}</span>`;
}
function barHtml() {
  const btn = (label, act, disabled) => `<button type="button" class="btn btn--accent" data-act="${act}"${disabled ? " disabled" : ""}>${label}</button>`;
  if (page === "pannes") {
    const c = calc();
    const n = D.pannes.length;
    const sum = !n ? "<span>Choisis une ou plusieurs pannes</span>"
      : `<span>${n} réparation${n > 1 ? "s" : ""}</span><span>${D.pannes.includes("ecran") && !D.tier ? "dès " : ""}${c.save ? `<s>${euro(c.total + c.save)}</s>` : ""}<b>${c.onQuote ? "sur devis" : euro(c.total)}</b></span>`;
    return `<div class="bar__sum">${sum}</div>${btn("Continuer", "next-pannes", !n)}`;
  }
  if (page === "modele" && (!BRAND[D.brand].series || D.customOpen)) {
    return btn("Continuer", "custom-next", !D.customText.trim());
  }
  return "";
}
function render() {
  const v = $("#view");
  v.innerHTML = VIEWS[page]();
  $("#backBtn").hidden = page === "home";
  $("#topRight").innerHTML = STEP[page]
    ? battery(STEP[page], page === "devis")
    : `<span class="pill">${esc(E.region)}</span>`;
  const bar = barHtml();
  $("#barIn").innerHTML = bar;
  $("#bar").hidden = !bar;
  document.body.classList.toggle("has-bar", !!bar);
  window.scrollTo(0, 0);
  const h = $("#pageTitle");
  if (h && page !== "home") h.focus({ preventScroll: true });
  saveDraft();
}
function refresh() {
  const top = window.scrollY;
  const focusSel = document.activeElement && document.activeElement.dataset ? Object.entries(document.activeElement.dataset)[0] : null;
  $("#view").innerHTML = VIEWS[page]().replace('class="page"', 'class="page" style="animation:none"');
  const bar = barHtml();
  $("#barIn").innerHTML = bar;
  $("#bar").hidden = !bar;
  document.body.classList.toggle("has-bar", !!bar);
  window.scrollTo(0, top);
  if (focusSel) {
    const el = $(`[data-${focusSel[0].replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}="${CSS.escape(focusSel[1])}"]`);
    if (el) el.focus({ preventScroll: true });
  }
  saveDraft();
}

/* Fenêtre « C'est quoi la différence ? » */
function openSheet() {
  const sh = $("#sheet");
  sh.innerHTML = `<div class="sheet__scrim" data-act="close-sheet"></div><div class="sheet__box" role="dialog" aria-modal="true" aria-labelledby="sheetT"><div class="sheet__grip"></div><h3 id="sheetT">C'est quoi la différence&nbsp;?</h3>${S.differenceEcrans.map(([t, p]) => `<div class="sheet__item"><b>${esc(t)}</b><p>${esc(p)}</p></div>`).join("")}<button type="button" class="btn btn--line" style="margin-top:12px" data-act="close-sheet">J'ai compris</button></div>`;
  sh.hidden = false;
  document.documentElement.classList.add("is-locked");
}
function closeSheet() {
  $("#sheet").hidden = true;
  document.documentElement.classList.remove("is-locked");
}

/* ------------------------------------------------------------------ */
/* Interactions                                                        */
/* ------------------------------------------------------------------ */
document.addEventListener("click", (ev) => {
  const t = ev.target;
  const goEl = t.closest("[data-go]");
  if (goEl) { ev.preventDefault(); if (page === "devis") { D.ref = ""; D.auto = false; } go(goEl.dataset.go); return; }
  if (t.closest("#backBtn")) { back(); return; }
  if (t.closest("#logoBtn")) { ev.preventDefault(); if (page !== "home") go("home"); return; }

  const brand = t.closest("[data-brand]");
  if (brand) { D.brand = brand.dataset.brand; D.query = ""; D.customOpen = !BRAND[D.brand].series; refresh(); return; }
  const model = t.closest("[data-model]");
  if (model) {
    const m = MODELS[model.dataset.model];
    if (!D.model || D.model.id !== m.id) { D.tier = null; }
    D.model = m;
    D.customOpen = false;
    refresh();
    setTimeout(() => go("pannes"), 170);
    return;
  }
  const sub = t.closest("[data-sub]");
  if (sub) { D.sousMarque = D.sousMarque === sub.dataset.sub ? "" : sub.dataset.sub; refresh(); return; }
  const panne = t.closest("[data-panne]");
  if (panne) {
    const id = panne.dataset.panne;
    D.pannes = D.pannes.includes(id) ? D.pannes.filter((x) => x !== id) : D.pannes.concat(id);
    refresh();
    return;
  }
  const tier = t.closest("[data-tier]");
  if (tier) { D.tier = tier.dataset.tier; refresh(); setTimeout(() => go("zone"), 200); return; }
  const dept = t.closest("[data-dept]");
  if (dept) { D.dept = dept.dataset.dept; refresh(); setTimeout(() => go("numero"), 170); return; }

  const act = t.closest("[data-act]");
  if (!act || act.disabled) return;
  switch (act.dataset.act) {
    case "custom":
      D.customOpen = !D.customOpen;
      refresh();
      if (D.customOpen) { const i = $("#cModel"); if (i) i.focus(); }
      break;
    case "custom-next": {
      const b = BRAND[D.brand];
      const txt = D.customText.trim();
      if (!txt) return;
      let prefix = "";
      if (!b.series) { if (D.sousMarque && D.sousMarque !== "Autre" && !norm(txt).startsWith(norm(D.sousMarque))) prefix = `${D.sousMarque} `; }
      else if (!norm(txt).includes(norm(b.onglet)) && !norm(txt).includes(norm(b.marque))) prefix = `${b.onglet} `;
      D.model = { id: "custom", brand: b.id, name: prefix + txt, prices: null };
      D.tier = null;
      go("pannes");
      break;
    }
    case "next-pannes":
      go(D.pannes.includes("ecran") ? "qualite" : "zone");
      break;
    case "diff":
      openSheet();
      break;
    case "close-sheet":
      closeSheet();
      break;
    case "resume":
      go(resumeTarget());
      break;
    case "drop-draft":
      resetDevis();
      refresh();
      break;
  }
});

document.addEventListener("input", (ev) => {
  const el = ev.target;
  if (el.id === "mSearch") { D.query = el.value; $("#mGroups").innerHTML = groupsHtml(); return; }
  if (el.id === "cModel") {
    D.customText = el.value;
    const b = $("#barIn [data-act='custom-next']");
    if (b) b.disabled = !D.customText.trim();
    return;
  }
  if (el.id === "fPrenom") { D.prenom = el.value.trim(); return; }
  if (el.id === "ffPrenom") { D.fPrenom = el.value.trim(); return; }
  if (el.id === "fTel" || el.id === "ffTel") {
    const f = formatTyping(el.value);
    if (f !== el.value) el.value = f;
    if (el.id === "fTel") { D.tel = el.value; $("#telBox").classList.remove("is-err"); $("#telErr").hidden = true; }
    else { D.fTel = el.value; $("#ffTelBox").classList.remove("is-err"); $("#ffErr").hidden = true; }
  }
});
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && !$("#sheet").hidden) { closeSheet(); return; }
  if (ev.key === "Enter" && ev.target.id === "cModel" && D.customText.trim()) {
    ev.preventDefault();
    const b = $("#barIn [data-act='custom-next']");
    if (b) b.click();
  }
  if (ev.key === "Enter" && ev.target.id === "mSearch") {
    ev.preventDefault();
    const rows = $$("#mGroups [data-model]");
    if (rows.length === 1) rows[0].click();
  }
});
document.addEventListener("submit", (ev) => {
  if (ev.target.id === "telForm") {
    ev.preventDefault();
    if (!telValid(D.tel)) {
      $("#telBox").classList.add("is-err");
      const e = $("#telErr");
      e.textContent = D.tel.trim() ? "Ce numéro ne semble pas complet. Exemple : 06 12 34 56 78" : "Indique ton numéro pour recevoir ton devis.";
      e.hidden = false;
      $("#fTel").focus();
      return;
    }
    const btn = $("#seeBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spin" aria-hidden="true"></span> Envoi de ton devis…';
    D.ref = makeRef();
    D.auto = envoyerAuto(msgReparateur());
    clearDraft();
    setTimeout(() => go("devis"), 650);
  }
  if (ev.target.id === "formForm") {
    ev.preventDefault();
    if (!telValid(D.fTel)) {
      $("#ffTelBox").classList.add("is-err");
      const e = $("#ffErr");
      e.textContent = "Indique un numéro complet. Exemple : 06 12 34 56 78";
      e.hidden = false;
      return;
    }
    D.fSent = envoyerAuto(msgFormation(true));
    refresh();
  }
});

/* Démarrage */
const [deb, ...fin] = E.nom.split(" ");
$("#logoTxt").innerHTML = E.nomDebut ? `${esc(E.nomDebut)} <em>${esc(E.nomFin || "")}</em>` : `${esc(deb)} <em>${esc(fin.join(" "))}</em>`;
$("#backBtn").innerHTML = icon("back");
D.via = detectVia();
loadDraft();
try { history.replaceState({ p: "home" }, ""); } catch (err) { useHistory = false; }
const start = location.hash === "#devis" || location.hash === "#reparer" ? "modele" : location.hash === "#formation" ? "formation" : "home";
if (start !== "home") go(start);
else render();
})();
