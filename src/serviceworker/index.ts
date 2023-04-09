
chrome.action.onClicked.addListener(function (tab) {
    //console.log('onClicked')
    chrome.tabs.create({
        'url': chrome.runtime.getURL("popup.html")
    });
});

// https://stackoverflow.com/questions/72736806/use-declarativenetrequest-to-set-the-referer-header-when-using-fetch-in-a-ch
// this is only executed after the extension is reloaded.
chrome.runtime.onInstalled.addListener(async () => {
  const rules = [
    {
      id: 3,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          {
            header: 'Referer',
            operation: 'set',
            value: "https://www.bilibili.com",
          },
          {
            header: 'Origin',
            operation: 'set',
            value: "https://www.bilibili.com",
          },
        ],
      },
      condition: {
        domains: [chrome.runtime.id],
        urlFilter: 'api.bilibili',
        resourceTypes: ['xmlhttprequest'],
      },
    },
  ];
  
  chrome.declarativeNetRequest.getDynamicRules(previousRules => {
    const previousRuleIds = previousRules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds, addRules: rules});
  });
});

export { }; // stops ts error that the file isn't a module
