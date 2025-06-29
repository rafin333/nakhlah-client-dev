import React from "react";
import ReactDOM from "react-dom";
import { IoMdClose } from "react-icons/io";

const Modal = ({ children, onClose, isShowCloseButton = false }) => {
  function closeHandler() {
    onClose(false);
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0   flex justify-center items-center p-4 "
      onClick={onClose}
    >
      <div
        // className="relative bg-white p-6 rounded-xl shadow-lg max-w-lg w-full mx-auto"
        // className=  "relative bg-white p-6 rounded-xl shadow-lg w-full max-w-[80%] max-h-[80vh] overflow-auto mx-auto"
        className="relative bg-white rounded-xl shadow-lg w-full max-w-[90%] max-h-[90vh] overflow-hidden mx-auto"
        style={{
          // background: "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "670px",
          maxHeight: "800px",

          transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
          transform: "translateY(-15px)",
          borderColor: "#462288",
          boxShadow: "0 14px 18px rgba(60, 7, 129, 0.89)",
        }}
      >
        {/* <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-1000  bg-transparent"
          aria-label="Close"
        > */}
        {/* <AiTwotoneCloseCircle className="text-2xl" /> */}
        {/* </button> */}

        {isShowCloseButton && (
          <button
            onClick={() => closeHandler()}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-1000  hover:shadow-md hover:border hover:rounded-xl"
            aria-label="Close"
          >
            <IoMdClose className="text-2xl" />
          </button>
        )}

        <div
          className="p-6 max-h-[70vh] overflow-auto"
          style={{ maxHeight: "800px", maxWidth: "700px" }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
