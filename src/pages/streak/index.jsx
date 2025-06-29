
import React from 'react'
import withAuth from "@/components/withAuth";
import { TRANSLATION_NAMESPACES_LIST } from '@/constants/translationNamespaces';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import StreakComponent from '@/components/Streak/StreakComponent';
const Streak = () => {

return (
        <div>
            <div className="container mx-auto p-4 flex justify-center">
                <div className="max-w-[70rem] w-full mx-auto p-8 bg-white shadow-lg rounded-lg shadow-2xl" style={{ backgroundColor: "#FBD687" }}>
                   
                <StreakComponent/>
                </div>
            </div>
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
export default withAuth(Streak);