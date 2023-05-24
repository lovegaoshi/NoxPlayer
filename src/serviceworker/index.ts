chrome.action.onClicked.addListener((tab) => {
  // console.log('onClicked')
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html'),
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
            value: 'https://www.bilibili.com',
          },
          {
            header: 'Origin',
            operation: 'set',
            value: 'https://www.bilibili.com',
          },
          {
            header: 'User-Agent',
            operation: 'set',
            value:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62',
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

  chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
    const previousRuleIds = previousRules.map((rule) => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: previousRuleIds,
      addRules: rules,
    });
  });
});

export {}; // stops ts error that the file isn't a module
