import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { Hyperlink, Image } from '@openedx/paragon';
import sherabLogo from '../StudioFooterLogoSlot/images/logo.png'
const StudioFooterLogoSlot = () => (
  <PluginSlot id="org.openedx.frontend.layout.studio_footer_logo.v1" idAliases={['studio_footer_logo_slot']}>
    <Hyperlink destination="https://openedx.org" className="float-right">
      <Image
        width="50px"
        alt="Sherab"
        src={sherabLogo}
      />
    </Hyperlink>
  </PluginSlot>
);

export default StudioFooterLogoSlot;
