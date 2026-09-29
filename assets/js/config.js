/* =========================================================
   080888.com — SITE CONFIG (edit this file only)
   ========================================================= */
window.SITE = {
  name: "080888",
  domain: "080888.com",
  tagline: "Lucky Numbers & Prosperity Intelligence",

  /* Destination for the global interest bar (top of every page) */
  interestUrl: "https://web.works/contact",

  /* Form delivery. The inbox is stored encoded and assembled only at submit time.
     It is never rendered on the page. Do not replace with a plain address. */
  _r: [125,123,119,60,126,113,105,125,115,74,57,105,135,127,120,123,131,104,117,131],
  formEndpoint: "https://formsubmit.co/ajax/",

  /* Google AdSense — replace with your publisher ID (ca-pub-XXXXXXXXXXXXXXXX) and slot IDs.
     While it stays as the placeholder, ad slots render as "Advertise here" house ads. */
  adsenseClient: "ca-pub-XXXXXXXXXXXXXXXX",
  adSlots: { top: "0000000001", inArticle: "0000000002", sidebar: "0000000003", footer: "0000000004" },

  /* Google Analytics 4 (optional) — e.g. "G-XXXXXXXXXX" */
  ga4: "",

  /* Donations / support links (replace with your own live links) */
  donate: {
    paypal: "",          // e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
    kofi: "",            // e.g. https://ko-fi.com/yourname
    buymeacoffee: "",    // e.g. https://buymeacoffee.com/yourname
    stripe: "",          // e.g. https://donate.stripe.com/XXXX
    patreon: "",         // e.g. https://patreon.com/yourname
    crypto: ""           // e.g. a public wallet address
  },

  /* YouTube channel + featured videos (IDs only). Replace with your own channel videos any time. */
  youtubeChannel: "",   // e.g. https://www.youtube.com/@yourchannel
  videos: [
    { id: "pT52hREAf18", title: "Chinese Lucky Numbers", by: "Numberphile", tag: "numbers" },
    { id: "kRgmrGHeJIc", title: "Why 8 is the luckiest number in Chinese culture", by: "YouTube", tag: "numbers" },
    { id: "wf13M4MoHS4", title: "Chinese lucky and unlucky numbers explained", by: "Learn Chinese Now", tag: "numbers" },
    { id: "sr673iAqLZY", title: "Meanings behind Chinese numbers", by: "YouTube", tag: "numbers" },
    { id: "TlXIin_7uh0", title: "Why 8, 88 and 168 bring prosperity", by: "YouTube", tag: "new-year" },
    { id: "bJag2BvLnBY", title: "The Great Race: story of the Chinese zodiac", by: "YouTube", tag: "zodiac" },
    { id: "Ec_DgpWrbWQ", title: "The 12 animals of the Chinese zodiac", by: "YouTube", tag: "zodiac" },
    { id: "soW3BfHghHg", title: "Chinese lunar calendar explained", by: "YouTube", tag: "zodiac" }
  ],

  social: { youtube: "", x: "", instagram: "", tiktok: "", facebook: "", pinterest: "" },

  /* Live fundraising goal shown on Support page (edit manually) */
  fundraising: { goal: 8888, raised: 0, currency: "USD" }
};
