import { DEFAULT_UA } from '@APM/utils/BiliFetch';

chrome.action.onClicked.addListener(() => {
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
      id: 5,
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
            value: DEFAULT_UA,
          },
        ],
      },
      condition: {
        domains: [chrome.runtime.id],
        urlFilter: 'api.bilibili',
        resourceTypes: ['xmlhttprequest'],
      },
    },
    {
      id: 6,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          {
            header: 'Referer',
            operation: 'set',
            value: 'https://www.youtube.com',
          },
          {
            header: 'Origin',
            operation: 'set',
            value: 'https://www.youtube.com',
          },
          {
            header: 'User-Agent',
            operation: 'set',
            value: DEFAULT_UA,
          },
        ],
      },
      condition: {
        domains: [chrome.runtime.id],
        urlFilter: 'www.youtube.com',
        resourceTypes: ['xmlhttprequest'],
      },
    },
    {
      id: 7,
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
            value: DEFAULT_UA,
          },
        ],
      },
      condition: {
        domains: [chrome.runtime.id],
        urlFilter: 'member.bilibili.com',
        resourceTypes: ['xmlhttprequest'],
      },
    },
    {
      id: 8,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          {
            header: 'Referer',
            operation: 'set',
            value: 'https://music.youtube.com',
          },
          {
            header: 'Origin',
            operation: 'set',
            value: 'https://music.youtube.com',
          },
          {
            header: 'User-Agent',
            operation: 'set',
            value: DEFAULT_UA,
          },
        ],
      },
      condition: {
        domains: [chrome.runtime.id],
        urlFilter: 'music.youtube.com',
        resourceTypes: ['xmlhttprequest'],
      },
    },
  ];

  chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
    const previousRuleIds = previousRules.map((rule) => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: previousRuleIds,
      // @ts-ignore
      addRules: rules,
    });
  });
});

export {}; // stops ts error that the file isn't a module
