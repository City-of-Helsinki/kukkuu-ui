import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  MyMarketingSubscriptionsDocument,
  MyMarketingSubscriptionsQuery,
} from '../../api/generatedTypes/graphql';
import SimpleFormPageLayout from '../../app/layout/SimpleFormPageLayout';
import ManageSubscriptionsForm from './ManageSubscriptionsForm';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import { isAuthenticatedSelector } from '../../auth/state/AuthenticationSelectors';

const ManageSubscriptions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const authToken = searchParams.get('authToken');
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const {
    data: subscriptionsData,
    loading,
    error,
  } = useQuery<MyMarketingSubscriptionsQuery>(
    MyMarketingSubscriptionsDocument,
    { variables: { authToken } }
  );

  if (error) {
    // Navigate to unauthorized ("the login") view
    // if not an auth token was used while the user was not logged in.
    if (!isAuthenticated) {
      toast.error(t('subscriptions.manage.form.query.authTokenErrorMessage'), {
        toastId: 'MyMarketingSubscriptionsQuery',
        delay: 0,
        // close automatically if an auth token has been used.
        autoClose: isAuthenticated ? false : 5000,
      });
      navigate(`/unauthorized?next=${location.pathname}`);
    } else {
      toast.error(
        t('subscriptions.manage.form.query.authenticatedErrorMessage'),
        {
          toastId: 'MyMarketingSubscriptionsQuery',
          delay: 3000,
          // don't close if the user is authenticated.
          autoClose: false,
        }
      );
    }
  }

  const { firstName, hasAcceptedMarketing } =
    subscriptionsData?.myMarketingSubscriptions ?? {
      firstName: undefined,
      hasAcceptedMarketing: true,
    };

  const initialValues = {
    hasAcceptedMarketing,
    authToken,
  };

  return (
    <SimpleFormPageLayout
      title={t('subscriptions.manage.title')}
      description={t('subscriptions.manage.description', {
        firstName,
      })}
      form={
        <LoadingSpinner isLoading={loading || !subscriptionsData}>
          <ManageSubscriptionsForm initialValues={initialValues} />
        </LoadingSpinner>
      }
    />
  );
};

export default ManageSubscriptions;