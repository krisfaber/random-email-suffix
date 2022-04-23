import React from 'react';
import { render } from 'react-dom';

import { ChakraProvider } from '@chakra-ui/react';

import Options from './options';

render(
  <ChakraProvider>
    <Options />
  </ChakraProvider>,
  window.document.querySelector('#app')
);
