/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';

if (process.env.DEV === 'dev') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
