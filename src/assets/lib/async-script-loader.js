(function () {
  const jquerySrc = 'assets/lib/scripts/jquery.js';

  // asynchronously loads other scripts to prevent page slowing down
  const scripts = [
    'assets/lib/hljs/highlight.pack.js',
    'https://api.cloudsponge.com/widget/i8PjRDPE-dGlkLjFchRiog.js',
    '//app.leadfox.co/js/api/leadfox.js',
    'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
    'https://adxbid.info/mytrendingstories.js',
  ];

  window.addEventListener('load', function () {
    fetch(jquerySrc).then(res => res.text()).then(res => {
      eval(res);

      setTimeout(() => {
        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(function () {
          googletag.defineSlot('/107720708/adxp_mytrendingstories_billboard', [970, 250], 'div-gpt-ad-1599554495707-0').addService(googletag.pubads());
          googletag.defineSlot('/107720708/adxp_mytrendingstories_superLeaderboard', [970, 90], 'div-gpt-ad-1599554517756-0').addService(googletag.pubads());
          googletag.defineSlot('/107720708/adxp_mytrendingstories_Leaderboard', [728, 90], 'div-gpt-ad-1599554538840-0').addService(googletag.pubads());
          googletag.defineSlot('/107720708/adxp_mytrendingstories_mRectangle', [300, 250], 'div-gpt-ad-1599554575619-0').addService(googletag.pubads());
          googletag.defineSlot('/107720708/adxp_mytrendingstories_halfpage', [300, 600], 'div-gpt-ad-1599554597929-0').addService(googletag.pubads());
          googletag.defineSlot('/107720708/adxp_mytrendingstories_skyscraper', [160, 600], 'div-gpt-ad-1599554619443-0').addService(googletag.pubads());
          googletag.defineSlot('/107720708/adxp_mytrendingstories_SmartphoneBanner', [320, 50], 'div-gpt-ad-1599554668927-0').addService(googletag.pubads());
          googletag.defineSlot('/107720708/adxp_mytrendingstories_smartphoneBanner_1', [320, 50], 'div-gpt-ad-1599554708106-0').addService(googletag.pubads());

          googletag.pubads().disableInitialLoad();
          googletag.pubads().enableSingleRequest();
          googletag.pubads().collapseEmptyDivs();
          googletag.enableServices();
        });

        scripts.forEach(src => {
          const script = document.createElement('script');
          script.src = src;
          script.type = 'text/javascript';
          script.async = 'true';

          document.body.appendChild(script);
        });
      }, 15000); // @TODO: Instead of timeout, when is it best to load this?
    });

    // const rurl = 'https://my-trending-stories-66f81.uc.r.appspot.com/render/https://mytrendingstories-preprod.web.app/shazia-ahmed-yjy1gk/health-benefits-of-glutathione-gobblb';
    // fetch(rurl)
    //   .then(res => res.text()).then(html => {
    //     console.log(html);
    //   });
  });
})();