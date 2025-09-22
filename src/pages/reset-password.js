import AuthResetForm from "@/components/AuthResetForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";

const ResetPasswordPage = () => {
  return (
    <div>
      <AuthResetForm />
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

export default ResetPasswordPage;
