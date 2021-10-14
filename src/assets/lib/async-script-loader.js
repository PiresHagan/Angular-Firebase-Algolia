(function () {
  const jquerySrc = 'assets/lib/scripts/jquery.js';
  console.log(jquerySrc);

  fetch(jquerySrc).then(res => res.text()).then(res => {
    eval(res);

    window.tyche = {
      mode: 'tyche',
      // test config NOT to be used in production
      config: 'https://config.playwire.com/1024452/v2/websites/73198/banner.json',
      passiveMode: true, // sets passiveMode to active
      onReady: () => {
        window.tyche.initialized = true;
        console.log('Playwire is initializeed');
        console.log(tyche);

        // window.tyche.addUnits([
        //   {   // Tagged unit requires container
        //     // HTML elemment ID ie. - element#id 
        //     selectorId: 'sidebar-med-rect-atf',
        //     // Tagged unit types - med_rect_atf, med_rect_btf, 
        //     // leaderboard_atf, leaderboard_btf, sky_atf, sky_btf
        //     type: 'med_rect_atf'
        //   },
        //   {
        //     selectorId: 'sidebar-med-rect-btf',
        //     type: 'med_rect_btf'
        //   },
        //   {
        //     type: 'bottom_rail'
        //   }
        // ]).then(() => {
        //   console.log('Units created ...');

        //   window.tyche.displayUnits();
        // }).catch((e) => {
        //   // catch errors
        //   console.log(e);
        // });
      }
    };

    console.log('Tyche...');

    // asynchronously loads other scripts to prevent page slowing down
    const scripts = [
      'assets/lib/hljs/highlight.pack.js',
      'https://api.cloudsponge.com/widget/i8PjRDPE-dGlkLjFchRiog.js',
      '//app.leadfox.co/js/api/leadfox.js',
      'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
      'https://adxbid.info/mytrendingstories.js',
      'https://cdn.intergi.com/hera/tyche.js'
    ];

    console.log(scripts);

    setTimeout(() => {
      scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        // script.async = 'true';

        document.body.appendChild(script);
      });

      initiateAds();
    }, 1000);
  });
})();

function initiateAds() {
  const gtag = window.googletag;

  if (gtag && gtag.apiReady) {
    const definedSlots = []; // re-usable references

    const allGoogleAdSpaces = [
      { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: 'div-gpt-ad-1599554495707-0', },
      { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: 'div-gpt-ad-home-0', },
      { slot: '/22150420070/adxp_mytrendingstories_rectangle_1', size: [[336, 280], [320, 50], [468, 60], [300, 250], [320, 100]], id: 'div-gpt-ad-home-1', },
      { slot: '/22150420070/adxp_mytrendingstories_rectangle_1', size: [[336, 280], [320, 50], [468, 60], [300, 250], [320, 100]], id: 'div-gpt-ad-home-2', },
      { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: 'div-gpt-ad-1599554517756-0' },
      { slot: '/22150420070/adxp_mytrendingstories_rectangle_2', size: [[320, 50], [320, 100], [300, 250], [336, 280], [468, 60]], id: 'div-gpt-ad-1599554538840-0' },
      { slot: '/22150420070/adxp_mytrendingstories_rectangle_3', size: [[468, 60], [300, 250], [336, 280], [320, 50], [320, 100]], id: 'div-gpt-ad-1599554575619-0' },
      { slot: '/22150420070/adxp_mytrendingstories_side_2', size: [[320, 100], [320, 50], [336, 280], [300, 250]], id: 'div-gpt-ad-1599554597929-0' },
      // { slot: '/107720708/adxp_mytrendingstories_skyscraper', size: [160, 600], id: 'div-gpt-ad-1599554619443-0' },
      // { slot: '/107720708/adxp_mytrendingstories_SmartphoneBanner', size: [320, 50], id: 'div-gpt-ad-1599554668927-0' },
      // { slot: '/107720708/adxp_mytrendingstories_smartphoneBanner_1', size: [320, 50], id: 'div-gpt-ad-1599554708106-0' },
    ];

    // programmatically creates 'x' number of ad slots for re-usability
    const size = 20;
    for (let i = 0; i < size; i++) {
      // for billboard ads
      allGoogleAdSpaces.push(
        { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: `dynamic_billboard_ad_${i}` }
      );

      // for billboard ads
      allGoogleAdSpaces.push(
        { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: `dynamic_leaderboard_ad_${i}` }
      );

      // for mRectangle ads
      allGoogleAdSpaces.push(
        { slot: '/22150420070/adxp_mytrendingstories_rectangle_3', size: [[468, 60], [300, 250], [336, 280], [320, 50], [320, 100]], id: `dynamic_mrectangle_ad_${i}` }
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
