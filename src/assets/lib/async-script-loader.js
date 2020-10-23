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
    googletag.cmd.push(function () {
      // prgrammatically creates 'x' number of ad slots for categories infinite scroll
      const size = 50;
      for (let i = 0; i < size; i++) {
        // for desktop
        googletag.defineSlot('/107720708/adxp_mytrendingstories_billboard', [970, 250], `desktop_category_ad_${i}`)
          .addService(googletag.pubads());

        // for mobile
        googletag.defineSlot('/107720708/adxp_mytrendingstories_mRectangle', [300, 250], `mobile_category_ad_${i}`)
          .addService(googletag.pubads());
      }

      googletag.defineSlot('/107720708/adxp_mytrendingstories_billboard', [970, 250], 'div-gpt-ad-1599554495707-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_billboard', [970, 250], 'div-gpt-ad-home-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_billboard', [970, 250], 'div-gpt-ad-home-1').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_billboard', [970, 250], 'div-gpt-ad-home-2').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_superLeaderboard', [970, 90], 'div-gpt-ad-1599554517756-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_Leaderboard', [728, 90], 'div-gpt-ad-1599554538840-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_mRectangle', [300, 250], 'div-gpt-ad-1599554575619-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_halfpage', [300, 600], 'div-gpt-ad-1599554597929-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_skyscraper', [160, 600], 'div-gpt-ad-1599554619443-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_SmartphoneBanner', [320, 50], 'div-gpt-ad-1599554668927-0').addService(googletag.pubads());
      googletag.defineSlot('/107720708/adxp_mytrendingstories_smartphoneBanner_1', [320, 50], 'div-gpt-ad-1599554708106-0').addService(googletag.pubads());

      googletag.pubads().disableInitialLoad();
      // googletag.pubads().enableSingleRequest();
      // googletag.pubads().collapseEmptyDivs();
      googletag.enableServices();
    });
  } else {
    setTimeout(() => {
      initiateAds();
    }, 1000);
  }
}