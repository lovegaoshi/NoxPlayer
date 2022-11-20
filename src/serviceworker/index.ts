
chrome.action.onClicked.addListener(function (tab) {
    //console.log('onClicked')
    chrome.tabs.create({
        'url': chrome.runtime.getURL("popup.html")
    });
});

// 牛批！！！！
// https://stackoverflow.com/questions/72736806/use-declarativenetrequest-to-set-the-referer-header-when-using-fetch-in-a-ch
chrome.runtime.onInstalled.addListener(async () => {
    const rules = [{
      id: 3,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [{
          header: 'Referer',
          operation: 'set',
          value: "https://www.bilibili.com/",
        },
        {
          header: 'Origin',
          operation: 'set',
          value: "https://www.bilibili.com/",
        },
        {
            header: 'User-Agent',
            operation: 'set',
            value: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
          }],
      },
      condition: {
        domains: [chrome.runtime.id],
        urlFilter: 'api.bilibili',
        resourceTypes: ['xmlhttprequest'],
      },
    }];
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(r => r.id),
      addRules: rules,
    });
  });

export { }; // stops ts error that the file isn't a module
