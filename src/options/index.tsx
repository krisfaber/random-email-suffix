import React from 'react';
import { render } from 'react-dom';

import { ChakraProvider, Box, Container, Heading } from '@chakra-ui/react';

import Options from './options';
import theme from './../utils/theme';

render(
  <ChakraProvider theme={theme}>
    <Container maxW="md">
      <Box pt={'5'} pb={'10'}>
        <Heading>Options</Heading>
      </Box>
      <Options />
    </Container>
  </ChakraProvider>,
  window.document.querySelector('#app')
);
