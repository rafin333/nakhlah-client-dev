import React, { useContext, useEffect, useState } from "react";
import { useGetUserInfoQuery } from "@/redux/features/auth/authApi";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
import { useSelector } from "react-redux";
import ThemeContext from "@/components/context/themeContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const { registeredUser } = useSelector((state) => state.userStore);
  const [formData, setFormData] = useState({});
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    createdAt: "",
  });
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("Update Profile");
  const { t } = useTranslation("profile");
  const { data } = useGetUserInfoQuery({});
  const context = useContext(ThemeContext);
  const { token } = context;
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("https://devapi.nakhlah.xyz/api/faqs");
        const data = await response.json();
        if (response.ok) {
          setFaqs(data?.data || []);
        } else {
          console.error("Failed to fetch FAQs");
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  useEffect(() => {
    if (data) {
      setProfile({
        username: data?.username,
        email: data?.email,
        createdAt: data?.createdAt,
      });
    }
  }, [data]);

  useEffect(() => {
    setImage(
      registeredUser?.profilePicture?.url
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA}${registeredUser?.profilePicture?.url}`
        : ""
    );
    setFormData({
      firstName: registeredUser?.firstName || "",
      lastName: registeredUser?.lastName || "",
      address: registeredUser?.address || "",
      age: registeredUser?.age || "",
      gender: registeredUser?.gender || "",
      contactNumber: registeredUser?.contactNumber || "",

    });
  }, [registeredUser]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const profileData = new FormData();
    const fileInput = document.getElementById("idInputFile");
    const file = fileInput?.files[0];
  
    if (file) {
      profileData.append("files.profilePicture", file);
    }
    profileData.append("data", JSON.stringify(formData));
  
    try {
      const response = await fetch("https://devapi.nakhlah.xyz/api/registereds", {
        method: "PATCH",
        body: profileData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!");
  
        if (file) {
          setImage(URL.createObjectURL(file)); 
        }
      } else {
        throw new Error(result?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
  });

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.passwordConfirmation) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    try {
      const response = await fetch("https://devapi.nakhlah.xyz/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          password: passwordData.password,
          passwordConfirmation: passwordData.passwordConfirmation,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          password: "",
          passwordConfirmation: "",
        });
      } else {
        throw new Error(result?.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const renderProfileHeader = () => (
  //   <div className="flex items-center gap-4 p-4 rounded-lg ml-11 mr-11 " style={{ backgroundColor: 'rgb(203, 143, 21)' }}>

  //     <div className="flex-shrink-0">
  //       <Image
  //         src={image || "/default-profile.png"}
  //         alt="Profile Picture"
  //         width={100}
  //         height={100}
  //         className="rounded-full border border-gray-300"
  //       />
  //     </div>

  //     <div>
  //       <h1 className="text-2xl font-bold text-gray-800">{profile.username || "User"}</h1>
  //       <h1 className="text-l font-bold text-gray-800">{profile.username || "Status"}</h1>
  //     </div>
  //   </div>
  // );

  const [planName, setPlanName] = useState('Loading...');
  const [profilePicture, setProfilePicture] = useState('/default-profile.png'); 

  useEffect(() => {
    const fetchSubscriptionAndProfile = async () => {
      try {
        const { token } = context;

        const subscriptionResponse = await fetch('https://devapi.nakhlah.xyz/api/subscriptions?populate=*', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!subscriptionResponse.ok) {
          throw new Error(`Subscription HTTP error! Status: ${subscriptionResponse.status}`);
        }

        const subscriptionData = await subscriptionResponse.json();
        const fetchedPlanName = subscriptionData?.data?.subscription_plan?.planName || 'No Plan';
        setPlanName(fetchedPlanName);

        const profileResponse = await fetch('https://devapi.nakhlah.xyz/api/registereds?populate=*', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          throw new Error(`Profile HTTP error! Status: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        const pictureUrl = profileData?.data?.profilePicture?.url
          ? `https://devapi.nakhlah.xyz${profileData.data.profilePicture.url}`
          : '/default-profile.png';

        setProfilePicture(pictureUrl);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPlanName('Error fetching plan');
      }
    };

    fetchSubscriptionAndProfile();
  }, []);
  
  const renderProfileHeader = () => {

    return (
      <div
        className="flex items-center gap-4 p-4 rounded-lg ml-11 mr-11"
        style={{ backgroundColor: 'rgb(203, 143, 21)' }}
      >
        <div className="flex-shrink-0">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-[rgb(251,214,135)]">
            <Image
              src={image || "/image/user 1.png"}
              alt="Profile Picture"
              width={100}
              height={100}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
  
        <div>
          <h1 className="text-2xl font-bold text-gray-800 pb-1">
            {profile?.username || 'User'}
          </h1>
          <h1 className="text-l font-bold text-gray-800 pt-1">
            Status: {planName}
          </h1>
        </div>
      </div>
    );
  };

  const [feedbackData, setFeedbackData] = useState({
    feedback: "",
  });

  const handleFeedbackInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackData.feedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    try {
      const response = await fetch("https://devapi.nakhlah.xyz/api/feedbacks?populate=*", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            details: feedbackData.feedback,
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Thank you for your feedback!");
        setFeedbackData({ feedback: "" });
      } else {
        throw new Error(result?.message || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderFAQTab = () => (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions (FAQ)</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="p-4 border border-gray-300 rounded-lg bg-white shadow-md"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleFAQ(faq.id)}
            >
              <div className="flex items-start">
                <span className="text-red-500 text-xl font-bold mr-2">Q:</span>
                <p className="text-lg font-bold">{faq.attributes.question}</p>
              </div>
              <button>
                {openFAQ === faq.id ? (
                  <span className="text-gray-600 text-lg font-bold">-</span>
                ) : (
                  <span className="text-gray-600 text-lg font-bold">+</span>
                )}
              </button>
            </div>
            {openFAQ === faq.id && (
              <div className="mt-2">
                <div className="flex items-start">
                  <span className="text-gray-600 text-xl font-bold mr-2">A:</span>
                  <p className="text-gray-600">{faq.attributes.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const [openFAQ, setOpenFAQ] = React.useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ((prev) => (prev === id ? null : id));
  };


  const renderTabContent = () => {
    switch (activeTab) {

      case "Update Profile":
        return (
          <div>
            <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
              <div>
                <label className="block font-bold">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-bold">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-bold">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-bold">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block font-bold mb-2">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block font-bold">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-bold">Profile Picture</label>
                <input
                  type="file"
                  id="idInputFile"
                  name="profilePicture"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none popbuttonWarning"
              >
                Update Profile
              </button>
            </form>
          </div>       
        );

      case "Reset Password":
        return <div>
          <form onSubmit={handlePasswordChange} className="mt-8 space-y-6">
            <div>
              <label className="block font-bold">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold">New Password</label>
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-bold">Confirm Password</label>
              <input
                type="password"
                name="passwordConfirmation"
                value={passwordData.passwordConfirmation}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none popbuttonWarning"
            >
              Change Password
            </button>
          </form>
        </div>

      case "FAQ":
        return renderFAQTab();

      case "Feedback":
        return <div>
          <form onSubmit={handleFeedbackSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block font-bold mb-2">Anything else you would like to share?</label>
              <textarea
                name="feedback"
                value={feedbackData.feedback}
                onChange={handleFeedbackInputChange}
                rows="8"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Write your feedback here..."
              />
            </div>
            <button
              type="submit"
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none popbuttonWarning pb-22"
            >
              Submit Feedback
            </button>
          </form>
        </div>

      default:
        return null;
    }
  };

  return (

    <div className="mx-auto p-11 bg-[#f8f1db]">
      <div className="max-w-[70rem] w-full mx-auto">

        {renderProfileHeader()}

        <div className="mx-auto p-4 flex justify-center bg-[#f8f1db] mb-10">

          <div className="max-w-[70rem] w-full mx-auto p-8 mb-10">
            <div className="tabs flex gap-4 mb-6">
              {["Update Profile", "Reset Password", "FAQ", "Feedback"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-grow px-4 py-2 rounded-md text-center ${activeTab === tab
                    ? "bg-[rgb(203,143,21)] text-white"
                    : "bg-[rgb(251,214,135)] text-black"

                    }`}

                  onClick={() => setActiveTab(tab)}
                >
                  {t(tab)}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>
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

export default ProfilePage;