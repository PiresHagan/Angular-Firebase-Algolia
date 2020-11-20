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
      { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: 'div-gpt-ad-home-0', },
      { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: 'div-gpt-ad-home-1', },
      { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: 'div-gpt-ad-home-2', },
      { slot: '/22150420070/adxp_mytrendingstories_billboard', size: [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], id: 'div-gpt-ad-1599554538840-0' },
      { slot: '/22150420070/adxp_mytrendingstories_rectangle_1', size: [[336, 280], [320, 50], [468, 60], [300, 250], [320, 100]], id: 'div-gpt-ad-1599554575619-0' },
      { slot: '/107720708/adxp_mytrendingstories_halfpage', size: [300, 600], id: 'div-gpt-ad-1599554597929-0' }, // slot size dimension is not available in new script
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
        { slot: '/22150420070/adxp_mytrendingstories_rectangle_2', size: [[320, 50], [320, 100], [300, 250], [336, 280], [468, 60]], id: `dynamic_mrectangle_ad_${i}` }
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


/**
 * Do not delete this script section even if commented out
 * It is the default script from which all ads are based off of.
 * HEAD SECTION
  <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
  <script async src="https://adxbid.info/mytrendingstories.js"></script>
  <script>
    window.googletag = window.googletag || {cmd: []};
    googletag.cmd.push(function() {
      googletag.defineSlot('/22150420070/adxp_mytrendingstories_billboard', [[970, 250], [970, 90], [300, 250], [728, 90], [320, 100], [320, 50]], 'div-gpt-ad-1605006059247-0').addService(googletag.pubads());
      googletag.defineSlot('/22150420070/adxp_mytrendingstories_rectangle_1', [[336, 280], [320, 50], [468, 60], [300, 250], [320, 100]], 'div-gpt-ad-1605006093880-0').addService(googletag.pubads());
      googletag.defineSlot('/22150420070/adxp_mytrendingstories_rectangle_2', [[320, 50], [320, 100], [300, 250], [336, 280], [468, 60]], 'div-gpt-ad-1605006147576-0').addService(googletag.pubads());
      googletag.defineSlot('/22150420070/adxp_mytrendingstories_rectangle_3', [[468, 60], [300, 250], [336, 280], [320, 50], [320, 100]], 'div-gpt-ad-1605006220128-0').addService(googletag.pubads());
      googletag.defineSlot('/22150420070/adxp_mytrendingstories_rectangle_4', [[468, 60], [300, 250], [336, 280], [320, 50], [320, 100]], 'div-gpt-ad-1605006259026-0').addService(googletag.pubads());
      googletag.defineSlot('/22150420070/adxp_mytrendingstories_side_1', [[320, 100], [320, 50], [336, 280], [300, 250]], 'div-gpt-ad-1605006363334-0').addService(googletag.pubads());
      googletag.defineSlot('/22150420070/adxp_mytrendingstories_side_2', [[320, 100], [320, 50], [336, 280], [300, 250]], 'div-gpt-ad-1605006389963-0').addService(googletag.pubads());
      googletag.pubads().disableInitialLoad();
      googletag.pubads().enableSingleRequest();
      googletag.pubads().collapseEmptyDivs();
      googletag.enableServices();
    });
  </script>
  BODY SECTION
  BILLBOARD - below horizontal navigation bar
  <!-- /22150420070/adxp_mytrendingstories_billboard -->
  <div id='div-gpt-ad-1605006059247-0'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605006059247-0'); });
    </script>
  </div>
  RECTANGLE 1 - below article image and between articles in homepage
  <!-- /22150420070/adxp_mytrendingstories_rectangle_1 -->
  <div id='div-gpt-ad-1605006093880-0'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605006093880-0'); });
    </script>
  </div>
  RECTANGLE 2 - middle of article, after 5 paragraphs and in homepage between articles
    <!-- /22150420070/adxp_mytrendingstories_rectangle_2 -->
  <div id='div-gpt-ad-1605006147576-0'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605006147576-0'); });
    </script>
  </div>
  RECTANGLE 3 - below article text and between articles in homepage
  <!-- /22150420070/adxp_mytrendingstories_rectangle_3 -->
  <div id='div-gpt-ad-1605006220128-0'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605006220128-0'); });
    </script>
  </div>
  RECTANGLE 4
  <!-- /22150420070/adxp_mytrendingstories_rectangle_4 -->
  <div id='div-gpt-ad-1605006259026-0'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605006259026-0'); });
    </script>
  </div>

  SIDE 1 - top of sidebar
  <!-- /22150420070/adxp_mytrendingstories_side_1 -->
  <div id='div-gpt-ad-1605006363334-0'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605006363334-0'); });
    </script>
  </div>
  SIDE 2 - sidebar, below content in sidebar
  <!-- /22150420070/adxp_mytrendingstories_side_2 -->
  <div id='div-gpt-ad-1605006389963-0'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1605006389963-0'); });
    </script>
  </div>
 */