import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import {
  UpdateMyMarketingSubscriptionsDocument,
  UpdateMyMarketingSubscriptionsMutation,
  UpdateMyMarketingSubscriptionsMutationInput,
} from '../../api/generatedTypes/graphql';
import CheckboxField from '../../../common/components/form/fields/checkbox/CheckboxField';
import Button from '../../../common/components/button/Button';

const schema = yup.object().shape({
  hasAcceptedMarketing: yup.boolean(),
});

type ManageSubscriptionsFormProps = {
  initialValues: UpdateMyMarketingSubscriptionsMutationInput;
};

const ManageSubscriptionsForm = ({
  initialValues,
}: ManageSubscriptionsFormProps) => {
  const { t } = useTranslation();

  const [updateMySubscriptions] =
    useMutation<UpdateMyMarketingSubscriptionsMutation>(
      UpdateMyMarketingSubscriptionsDocument
    );

  const onSubmit = async ({
    hasAcceptedMarketing,
    authToken,
  }: UpdateMyMarketingSubscriptionsMutationInput) => {
    try {
      await updateMySubscriptions({
        variables: { input: { hasAcceptedMarketing, authToken } },
      });
      toast.success(
        t('subscriptions.manage.form.submit.submitMutation.successfulMessage')
      );
    } catch (error) {
      toast.error(
        t('subscriptions.manage.form.submit.submitMutation.errorMessage')
      );
      Sentry.captureException(error);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={schema}
    >
      <Form>
        <CheckboxField
          id={'hasAcceptedMarketing'}
          name={'hasAcceptedMarketing'}
          label={t(
            'subscriptions.manage.form.fields.hasAcceptedMarketing.label'
          )}
        />
        <Button type="submit">
          {t('subscriptions.manage.form.submit.button.label')}
        </Button>
      </Form>
    </Formik>
  );
};

export default ManageSubscriptionsForm;
