import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import {
  UpdateMyCommunicationSubscriptionsDocument,
  UpdateMyCommunicationSubscriptionsMutation,
  UpdateMyCommunicationSubscriptionsMutationInput,
} from '../../api/generatedTypes/graphql';
import CheckboxField from '../../../common/components/form/fields/checkbox/CheckboxField';
import Button from '../../../common/components/button/Button';
import graphqlClient from '../../api/client';

const schema = yup.object().shape({
  hasAcceptedCommunication: yup.boolean(),
});

type ManageSubscriptionsFormProps = {
  initialValues: UpdateMyCommunicationSubscriptionsMutationInput;
};

const ManageSubscriptionsForm = ({
  initialValues,
}: ManageSubscriptionsFormProps) => {
  const { t } = useTranslation();

  const [updateMySubscriptions] =
    useMutation<UpdateMyCommunicationSubscriptionsMutation>(
      UpdateMyCommunicationSubscriptionsDocument,
      {
        client: graphqlClient,
      }
    );

  const onSubmit = async ({
    hasAcceptedCommunication,
    authToken,
  }: UpdateMyCommunicationSubscriptionsMutationInput) => {
    try {
      await updateMySubscriptions({
        variables: { input: { hasAcceptedCommunication, authToken } },
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
      <Form aria-label={t('subscriptions.manage.title')}>
        <CheckboxField
          id={'hasAcceptedCommunication'}
          name={'hasAcceptedCommunication'}
          label={t(
            'subscriptions.manage.form.fields.hasAcceptedCommunication.label'
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
