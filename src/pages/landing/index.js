import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { TRANSLATION_NAMESPACES_LIST } from '@/constants/translationNamespaces';
import Landing from '@/components/Landing/landing';


function landingPage() {
  return (
    <div>
      <Landing />
    </div>
  )

  
}
export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
        // Will be passed to the page component as props
      },
    };
  }
export default landingPage
