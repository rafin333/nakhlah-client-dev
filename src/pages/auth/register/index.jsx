import RegistrationForm from '@/components/Register/Register';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TRANSLATION_NAMESPACES_LIST } from '@/constants/translationNamespaces';
const Register = () => {
    return (
        <div>
            <RegistrationForm/>
        </div>
    );
};
export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
        // Will be passed to the page component as props
      },
    };
  }
export default Register;