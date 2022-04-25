import React from 'react';

import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import Options from '../options/options';
import History from '../history/history';

const Popup = () => {
  return (
    <Box minWidth={'320px'}>
      <Tabs isFitted isLazy variant="enclosed" pb={'4'} size="sm">
        <TabList mb="1em">
          <Tab>Options</Tab>
          <Tab>History</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Options size="small" />
          </TabPanel>
          <TabPanel>
            <History />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Popup;
