import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import withAuth from "@/components/withAuth";
import StoreComponent from "@/components/Store/StoreComponent";
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Modal from "@/components/Modals/Modal";
import PaymentSuccess from "@/components/paymentSuccess";

const StorePage = () => {
  const router = useRouter();
  console.log( Object.keys(router?.query).length);

  const data = [router?.query];

  // // query check if subscription plan is bought

  // if (router?.query?.subscription_id) {
  //   console.log(router?.query?.subscription_id);
  // }

  const [setsubscriptionSuccess, setSetsubscriptionSuccess] = useState(false);

  useEffect(() => {
    console.log(Object.keys(router?.query).length);
    console.log(data);
    if (Object.keys(router?.query).length > 0) {
      setSetsubscriptionSuccess(true);
    }else{
      setSetsubscriptionSuccess(false);
    }
  }, [data, router]);

  return (
    <div>
      <div className="container mx-auto p-4 flex justify-center">
        <div
          className="max-w-[70rem] w-full mx-auto p-8 bg-white shadow-lg rounded-lg shadow-2xl"
          style={{
            backgroundColor: "rgb(248 241 219 / var(--tw-bg-opacity, 1))",
          }}
        >
          <StoreComponent />
        </div>
      </div>
      {setsubscriptionSuccess && (
        <Modal
          isShowCloseButton={true}
          onClose={() => (
            setSetsubscriptionSuccess(false), router.replace("/store")
          )}
        >
          <PaymentSuccess
            data={data}
            onClose={() => (
              setSetsubscriptionSuccess(false), router.replace("/store")
            )}
          />
        </Modal>
      )}
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

export default withAuth(StorePage);
