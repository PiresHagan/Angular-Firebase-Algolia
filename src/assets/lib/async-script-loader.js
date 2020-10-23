(function () {
  const jquerySrc = 'assets/lib/scripts/jquery.js';

  window.addEventListener('load', function () {
    fetch(jquerySrc).then(res => res.text()).then(res => {
      eval(res);

      // asynchronously loads other scripts to prevent page slowing down
      const scripts = [
        'assets/lib/hljs/highlight.pack.js',
        'https://api.cloudsponge.com/widget/i8PjRDPE-dGlkLjFchRiog.js',
        '//app.leadfox.co/js/api/leadfox.js',
        'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
        'https://adxbid.info/mytrendingstories.js',
      ];

      setTimeout(() => {
        scripts.forEach(src => {
          const script = document.createElement('script');
          script.src = src;
          script.type = 'text/javascript';
          script.async = 'true';

          document.body.appendChild(script);
        });

        initiateAds();
      }, 1000);
    });
  });
})();

function initiateAds() {
  const gtag = window.googletag;

  if (gtag && gtag.apiReady) {
    const definedSlots = []; // re-usable references

    const allGoogleAdSpaces = [
      { slot: '/107720708/adxp_mytrendingstories_billboard', size: [970, 250], id: 'div-gpt-ad-1599554495707-0', },
      { slot: '/107720708/adxp_mytrendingstories_billboard', size: [970, 250], id: 'div-gpt-ad-home-0', },
      { slot: '/107720708/adxp_mytrendingstories_billboard', size: [970, 250], id: 'div-gpt-ad-home-1', },
      { slot: '/107720708/adxp_mytrendingstories_billboard', size: [970, 250], id: 'div-gpt-ad-home-2', },
      { slot: '/107720708/adxp_mytrendingstories_superLeaderboard', size: [970, 90], id: 'div-gpt-ad-1599554517756-0' },
      { slot: '/107720708/adxp_mytrendingstories_Leaderboard', size: [728, 90], id: 'div-gpt-ad-1599554538840-0' },
      { slot: '/107720708/adxp_mytrendingstories_mRectangle', size: [300, 250], id: 'div-gpt-ad-1599554575619-0' },
      { slot: '/107720708/adxp_mytrendingstories_halfpage', size: [300, 600], id: 'div-gpt-ad-1599554597929-0' },
      { slot: '/107720708/adxp_mytrendingstories_skyscraper', size: [160, 600], id: 'div-gpt-ad-1599554619443-0' },
      { slot: '/107720708/adxp_mytrendingstories_SmartphoneBanner', size: [320, 50], id: 'div-gpt-ad-1599554668927-0' },
      { slot: '/107720708/adxp_mytrendingstories_smartphoneBanner_1', size: [320, 50], id: 'div-gpt-ad-1599554708106-0' },
    ];

    // programmatically creates 'x' number of ad slots for categories infinite scroll
    const size = 20;
    for (let i = 0; i < size; i++) {
      // for desktop
      allGoogleAdSpaces.push(
        { slot: '/107720708/adxp_mytrendingstories_billboard', size: [970, 250], id: `desktop_category_ad_${i}` }
      );

      // for mobile
      allGoogleAdSpaces.push(
        { slot: '/107720708/adxp_mytrendingstories_mRectangle', size: [300, 250], id: `mobile_category_ad_${i}` }
      );
    }

    // define slots and push to google tag commands
    googletag.cmd.push(function () {
      for (const slt of allGoogleAdSpaces) {
        const slot = googletag.defineSlot(slt.slot, slt.size, slt.id).addService(googletag.pubads());
        definedSlots.push({ ref: slot, data: slt });
      }

      // initializes ads placeholders after defining slots
      googletag.pubads().disableInitialLoad();
      googletag.pubads().collapseEmptyDivs();
      googletag.enableServices();

      // create global property to be reused within angular application
      window.allGoogleAdSlots = definedSlots;
    });
  } else {
    setTimeout(() => {
      initiateAds();
    }, 1000);
  }
}
