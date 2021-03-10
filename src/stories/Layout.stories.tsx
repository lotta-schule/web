import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { Box } from "../component/general/layout/Box";
import { Page } from "../component/general/layout/Page";
import { Navigation } from "../component/general/navigation/Navigation";
import { NavigationButton } from "component/general/button/NavigationButton";
import { Banner } from "component/general/layout/Banner";
import { UserMenu } from "component/general/navigation/UserMenu";
import { Favorite, CalendarToday, Fingerprint } from "@material-ui/icons";

const loremIpsumContent = (
  <>
    <Box marginTop>
      <img src="https://picsum.photos/300/200" />
      <Box noMargin>
        <h2>Boxtitel</h2>
        <div>Boxinhalt</div>
      </Box>
    </Box>
    <Box marginTop>
      <img src="https://picsum.photos/300/200" />
      <Box noMargin>
        <h2>Boxtitel</h2>
        <div>Boxinhalt</div>
      </Box>
    </Box>
    <Box marginTop>
      <img src="https://picsum.photos/300/200" />
      <Box noMargin>
        <h2>Boxtitel</h2>
        <div>Boxinhalt</div>
      </Box>
    </Box>
  </>
);

export default {
  title: "Layout/Page",
  component: Page,
  argTypes: {},
} as Meta;

const Template: Story = ({ children, ...args }) => (
  <Page>
    <Navigation
      primaryButtons={[
        <NavigationButton key={"start"}>Start</NavigationButton>,
        <NavigationButton key={"BLA"}>Bla</NavigationButton>,
        <NavigationButton key={"blub"}>Blub</NavigationButton>,
        <NavigationButton key={"aksdjf"}>Test</NavigationButton>,
      ]}
    />
    {children}
  </Page>
);

export const WithSidebar = Template.bind({});
WithSidebar.args = {
  children: (
    <>
      <main>
        <Banner>
          <Box marginTop>
            <Box noMargin fullWidth>
              <h1>Ich bin ein Banner.</h1>
              <UserMenu />
            </Box>
          </Box>
        </Banner>
        {loremIpsumContent}
      </main>
      <aside>
        <Box marginTop>
          <Box fullWidth noMargin>
            <Navigation
              primaryButtons={[
                <NavigationButton>
                  <Favorite />
                </NavigationButton>,
                <NavigationButton>
                  <CalendarToday />
                </NavigationButton>,
                <NavigationButton>
                  <Fingerprint />
                </NavigationButton>,
              ]}
            />
          </Box>
          <div>Ich bin eine Seitenleiste</div>
        </Box>
      </aside>
    </>
  ),
};

export const SingleColumn = Template.bind({});
SingleColumn.args = {
  children: (
    <main>
      {" "}
      <Banner>
        <Box marginTop>
          <h1>Ich bin ein Banner.</h1>
          <UserMenu />
        </Box>
      </Banner>
      {loremIpsumContent}
    </main>
  ),
};
