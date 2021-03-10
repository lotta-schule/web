import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Box } from '../component/general/layout/Box';
import { Page } from '../component/general/layout/Page';
import { Navigation,  } from '../component/general/navigation/Navigation';
import { NavigationButton } from 'component/general/button/NavigationButton';

const loremIpsumContent = (
  <>
    <Box noMargin>
      <div>
        <img src="https://picsum.photos/300/200" />
        <div>Ich bin eine Box mit Inhalt</div>
      </div>
    </Box>
    <Box noMargin>
      <div>
        <img src="https://picsum.photos/300/200" />
        <div>Ich bin eine Box mit Inhalt</div>
      </div>
    </Box>
    <Box noMargin>
      <div>
        <img src="https://picsum.photos/300/200" />
        <div>Ich bin eine Box mit Inhalt</div>
      </div>
    </Box>
    <Box noMargin>
      <div>
        <img src="https://picsum.photos/300/200" />
        <div>Ich bin eine Box mit Inhalt</div>
      </div>
    </Box>
    <Box noMargin>
      <div>
        <img src="https://picsum.photos/300/200" />
        <div>Ich bin eine Box mit Inhalt</div>
      </div>
    </Box>
  </>
)

export default {
  title: 'Layout/Page',
  component: Page,
  argTypes: {
  },
} as Meta;

const Template: Story = ({children, ...args}) => (
  <Page>
    <Navigation primaryButtons={[
      <NavigationButton key={'start'}>Start</NavigationButton>,
      <NavigationButton key={'BLA'}>Bla</NavigationButton>,
      <NavigationButton key={'blub'}>Blub</NavigationButton>,
      <NavigationButton key={'aksdjf'}>Test</NavigationButton>
    ]} />
    {children}
  </Page>
  );
  
  export const WithSidebar = Template.bind({});
  WithSidebar.args = {
    children: (
      <>
        <main>
          {loremIpsumContent}
        </main>
        <aside>
          <Box noMargin>
            <div>Ich bin eine Seitenleiste</div>
          </Box>
        </aside>
      </>
    )
  };
    
  export const SingleColumn = Template.bind({});
  SingleColumn.args = {
    children: (
      <main>
        {loremIpsumContent}
      </main>
    )
  };