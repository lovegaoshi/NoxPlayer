import steriaJson from '@APM/styles/steria.json';
import steriaGarb from '@APM/styles/steriaGarb.json';
import AzusaTheme from '@APM/styles/AzusaTheme';
import NoxTheme from '@APM/styles/NoxTheme';

const APMSkins: { [key: string]: NoxTheme.Style } = {
  [AzusaTheme.metaData.themeName]: AzusaTheme,
  [NoxTheme.metaData.themeName]: NoxTheme,
};

// @ts-ignore
[...steriaJson, ...steriaGarb].forEach((val: NoxTheme.Style) => {
  APMSkins[val.metaData.themeName] = val;
});

export default APMSkins;
