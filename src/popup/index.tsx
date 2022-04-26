import React from 'react';
import { render } from 'react-dom';

import { ChakraProvider } from '@chakra-ui/react';

import Popup from './popup';
import theme from './../utils/theme';

render(
  <ChakraProvider theme={theme}>
    <Popup />
  </ChakraProvider>,
  window.document.querySelector('#app')
);
