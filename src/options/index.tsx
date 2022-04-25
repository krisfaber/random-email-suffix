import React from 'react';
import { render } from 'react-dom';

import { ChakraProvider, Box, Container, Heading } from '@chakra-ui/react';

import Options from './options';

render(
  <ChakraProvider>
    <Container maxW="md">
      <Box pt={'5'} pb={'10'}>
        <Heading>Options</Heading>
      </Box>
      <Options />
    </Container>
  </ChakraProvider>,
  window.document.querySelector('#app')
);
