import React, { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  CircularProgress,
  Code,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import * as Yup from 'yup';

import { STORAGE_KEYS } from '../utils/storage-keys';
import { generate, GenerationMethod } from '../utils/generate-email';

const { sync } = chrome.storage;

const PreferencesSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  generationMethod: Yup.number()
    .min(1, 'Suffix type is required')
    .required('Suffix type is required'),
  idLength: Yup.number().when('generationMethod', {
    is: GenerationMethod.randID,
    then: Yup.number()
      .min(6, 'ID length must at least be 6')
      .required('ID length is required'),
  }),
});

type Size = 'default' | 'small';
interface Props {
  size?: Size;
}

interface PreferencesFormValues {
  email: string;
  idLength: number;
  generationMethod: GenerationMethod;
}

const Options: React.FC<Props> = ({ size = 'default' }) => {
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
      if (values.generationMethod === GenerationMethod.randID) {
        return generate(values.email, values.generationMethod, values.idLength);
      }

      return generate(values.email, values.generationMethod);
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

  const small = size === 'small';

  return (
    <Box position={'relative'}>
      <form onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={!!errors.email && touched.email}
          mb={small ? '4' : '8'}
        >
          <FormLabel htmlFor="email" fontSize={small ? 'sm' : 'md'}>
            Email address
          </FormLabel>
          <Input
            id="email"
            type="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            size={small ? 'sm' : 'md'}
          />
          <FormErrorMessage fontSize={small ? 'sm' : 'md'}>
            {errors.email}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!errors.generationMethod && touched.generationMethod}
          mb={small ? '4' : '8'}
        >
          <FormLabel htmlFor="generationMethod" fontSize={small ? 'sm' : 'md'}>
            Suffix Type
          </FormLabel>

          <Select
            id="generationMethod"
            placeholder="Select option"
            onChange={(e) => {
              const { value } = e.currentTarget;
              setFieldValue('generationMethod', +value, true);
            }}
            onBlur={handleBlur}
            value={values.generationMethod}
            size={small ? 'sm' : 'md'}
            isRequired
          >
            <option value={GenerationMethod.randID}>Random ID</option>
            <option value={GenerationMethod.timestamp}>Timestamp</option>
          </Select>
          <FormErrorMessage fontSize={small ? 'sm' : 'md'}>
            {errors.generationMethod}
          </FormErrorMessage>
        </FormControl>

        {values.generationMethod === GenerationMethod.randID && (
          <FormControl
            isInvalid={!!errors.idLength && touched.idLength}
            mb={small ? '4' : '8'}
          >
            <FormLabel htmlFor="idLength" fontSize={small ? 'sm' : 'md'}>
              ID length
            </FormLabel>
            <NumberInput
              size={small ? 'sm' : 'md'}
              min={6}
              id="idLength"
              onChange={(_, val) => {
                setFieldValue('idLength', val, true);
              }}
              onBlur={handleBlur}
              value={values.idLength}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <FormErrorMessage fontSize={small ? 'sm' : 'md'}>
              {errors.idLength}
            </FormErrorMessage>
          </FormControl>
        )}

        <Box my={small ? '4' : '8'}>
          <Code
            maxWidth={'100%'}
            px={'2'}
            py={'2'}
            colorScheme={'blackAlpha'}
            children={`example email: ${sampleEmail}`}
            variant="solid"
          />
        </Box>

        <Button
          isLoading={isSubmitting}
          type="submit"
          colorScheme="blue"
          disabled={isSubmitting || !isValid}
          size={small ? 'sm' : 'md'}
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
  );
};

export default Options;
