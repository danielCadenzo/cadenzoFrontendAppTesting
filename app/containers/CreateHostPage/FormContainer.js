import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-form';
import { PAGE_STEPS } from './constants';
import DetailedInformation from './DetailedInformation';
import BasicInformation from './BasicInformation';
import MediaInformation from './MediaInformation';

function FormContainer({
  defaultFormValues,
  onSubmit,
  onPageChange,
  activePage,
}) {
  const defaultValues = useMemo(
    () => ({
      preferredPerformances: [],
      anemities: [],
      images: [],
      spaceType: 'BAR',
      ...defaultFormValues,
      exactCapacity: defaultFormValues.exactCapacity
        ? defaultFormValues.exactCapacity
        : null,
    }),
    [],
  );

  const { Form, values, setFieldValue } = useForm({
    defaultValues,
    onSubmit,
  });

  const renderFormStep = useCallback(() => {
    switch (activePage) {
      case PAGE_STEPS.BASIC_INFO:
        return (
          <BasicInformation
            onPageChange={onPageChange}
            setFieldValue={setFieldValue}
            values={values}
          />
        );
      case PAGE_STEPS.DETAILED_INFO:
        return (
          <DetailedInformation
            onPageChange={onPageChange}
            setFieldValue={setFieldValue}
          />
        );
      case PAGE_STEPS.MEDIA_INFO:
        return (
          <MediaInformation
            onPageChange={onPageChange}
            setFieldValue={setFieldValue}
            values={values}
          />
        );
      default:
        return (
          <BasicInformation
            onPageChange={onPageChange}
            setFieldValue={setFieldValue}
            values={values}
          />
        );
    }
  }, [activePage]);

  return <Form>{renderFormStep()}</Form>;
}

export default FormContainer;
