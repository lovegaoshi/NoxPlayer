/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';

if (process.env.DEV === 'dev') {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
