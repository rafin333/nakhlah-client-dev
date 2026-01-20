import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import StoreComponent from "@/components/Store/StoreComponent";
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Modal from "@/components/Modals/Modal";
import PaymentSuccess from "@/components/paymentSuccess";

const PublicStorePage = () => {
  const router = useRouter();
  const data = [router?.query];

  const [setsubscriptionSuccess, setSetsubscriptionSuccess] = useState(false);

  useEffect(() => {
    if (Object.keys(router?.query).length > 0) {
      setSetsubscriptionSuccess(true);
    } else {
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
          {/* PASSED isPublic PROP HERE */}
          <StoreComponent isPublic={true} />
        </div>
      </div>
      {setsubscriptionSuccess && (
        <Modal
          isShowCloseButton={true}
          onClose={() => (
            setSetsubscriptionSuccess(false), router.replace("/public-store")
          )}
        >
          <PaymentSuccess
            data={data}
            onClose={() => (
              setSetsubscriptionSuccess(false), router.replace("/public-store")
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
    },
  };
}

export default PublicStorePage;