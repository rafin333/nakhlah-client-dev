import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import themeContext from './context/themeContext';

export default function withAuth(Component) {
  return function WithAuth(props) {
    const context = useContext(themeContext);
    console.log("CONTEXT __ > ",context, themeContext)
    const { token } = context;
    console.log("TOKKEN __ > ",context)
    const router = useRouter();
    const isAuthenticated = token ? true : false;

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/'); // Redirect to login page if not authenticated
      }
    }, [isAuthenticated, router]);

    /*   if (!isAuthenticated) {
      return null; // Render nothing while checking authentication status
    } */

    return <Component {...props} />;
  };
}
