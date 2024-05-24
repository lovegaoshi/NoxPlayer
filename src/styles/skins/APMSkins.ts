import steriaJson from '@APM/components/styles/steria.json';
import steriaGarb from '@APM/components/styles/steriaGarb.json';
import AzusaTheme from '@APM/components/styles/AzusaTheme';
import NoxTheme from '@APM/components/styles/NoxTheme';

const APMSkins: { [key: string]: NoxTheme.Style } = {
  [AzusaTheme.metaData.themeName]: AzusaTheme,
  [NoxTheme.metaData.themeName]: NoxTheme,
};

// @ts-ignore
[...steriaJson, ...steriaGarb].forEach((val: NoxTheme.Style) => {
  APMSkins[val.metaData.themeName] = val;
});

export default APMSkins;
