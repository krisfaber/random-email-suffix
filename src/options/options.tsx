import React, { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  CircularProgress,
  Code,
  Select,
} from '@chakra-ui/react';
import * as Yup from 'yup';

import { STORAGE_KEYS } from '../utils/storage-keys';
import { generate, GenerationMethod } from '../utils/generate-email';

const { sync } = chrome.storage;

const PreferencesSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  generationMethod: Yup.number().required('Suffix type is required'),
  idLength: Yup.number().when('generationMethod', {
    is: GenerationMethod.randID,
    then: Yup.number()
      .min(1, 'ID length must at least be 1')
      .required('ID length is required'),
  }),
});

interface Props {}

interface PreferencesFormValues {
  email: string;
  idLength: number;
  generationMethod: GenerationMethod;
}

const Options: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  const initialValues: PreferencesFormValues = {
    email: '',
    idLength: 8,
    generationMethod: GenerationMethod.randID,
  };

  const handleSubmit = async (values: PreferencesFormValues) => {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.email]: values.email,
      [STORAGE_KEYS.id_length]: values.idLength,
      [STORAGE_KEYS.generation_method]: values.generationMethod,
    });
  };

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    ...formik
  } = useFormik({
    validationSchema: PreferencesSchema,
    initialValues,
    onSubmit: handleSubmit,
  });

  const sampleEmail = useMemo(() => {
    if (isValid && values.idLength && values.generationMethod) {
      return generate(values.email, values.idLength, values.generationMethod);
    }

    return '';
  }, [values, isValid]);

  useEffect(() => {
    setLoading(true);


    (async () => {
      const data = await sync.get([
        STORAGE_KEYS.email,
        STORAGE_KEYS.id_length,
        STORAGE_KEYS.generation_method,
      ]);
      const email = data[STORAGE_KEYS.email] || '';
      const idLength = data[STORAGE_KEYS.id_length] || 8;
      const generationMethod =
        data[STORAGE_KEYS.generation_method] || GenerationMethod.randID;

      await setFieldValue('email', email, true);
      await setFieldValue('idLength', idLength, true);
      await setFieldValue('generationMethod', generationMethod, true);

      setLoading(false);
    })();
  }, [setLoading, setFieldValue]);

  return (
    <Container maxW="md">
      <Box pt={'5'} pb={'10'}>
        <Heading>Options</Heading>
      </Box>
      <Box position={'relative'}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl isInvalid={!!errors.email && touched.email} mb={'8'}>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              id="email"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!errors.idLength && touched.idLength}
            mb={'8'}
          >
            <FormLabel htmlFor="generationMethod">Suffix Type</FormLabel>

            <Select
              id="generationMethod"
              placeholder="Select option"
              onChange={(e) => {
                const { value } = e.currentTarget;
                setFieldValue('generationMethod', +value, true);
              }}
              onBlur={handleBlur}
              value={values.generationMethod}
            >
              <option value={GenerationMethod.randID}>Random ID</option>
              <option value={GenerationMethod.timestamp}>Timestamp</option>
            </Select>
            <FormErrorMessage>{errors.generationMethod}</FormErrorMessage>
          </FormControl>

          {values.generationMethod === GenerationMethod.randID && (
            <FormControl
              isInvalid={!!errors.idLength && touched.idLength}
              mb={'8'}
            >
              <FormLabel htmlFor="idLength">ID length</FormLabel>
              <Input
                id="idLength"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.idLength}
              />
              <FormErrorMessage>{errors.idLength}</FormErrorMessage>
            </FormControl>
          )}

          <Box my="8">
            <Code
              colorScheme={'blackAlpha'}
              children={`example email: ${sampleEmail}`}
              variant="solid"
            />
          </Box>

          <Button
            type="submit"
            colorScheme="blue"
            disabled={isSubmitting || !isValid}
          >
            Save Preferences
          </Button>
        </form>
        {loading && (
          <Box
            position={'absolute'}
            top={0}
            left={0}
            height="100%"
            width="100%"
            display="flex"
            alignItems={'center'}
            justifyContent={'center'}
            backgroundColor="rgba(255, 255, 255, 0.5)"
          >
            <CircularProgress isIndeterminate color="blue.300" />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Options;
