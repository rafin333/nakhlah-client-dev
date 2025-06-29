import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PaymentSuccess = (data) => {
  const router = useRouter();
  const [queryData, setQueryData] = useState(null);

  useEffect(() => {
    console.log(data.data[0]);
    const x = /_/g;
    // console.log(Object.keys(data.data[0]).map((key) => [key.replace(x," "), data.data[0][key]]));
    setQueryData(Object.keys(data.data[0]).map((key) => [key.replace(x," "), data.data[0][key]]));
  }, [router])

  // useEffect(() => {
  //   queryData?.map((item) => {
  //     console.log(item[0]+" : "+item[1]);
  //   })
  // }, [queryData])
  
  function closeHandler() {
    data.onClose(false);
  }


  const handlePrint = () => {
    const printContents = document.getElementById("printable").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Bill Print</title>");
    printWindow.document.write("</head><body style='font-size: 14px; font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #ccc;'>");
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
    closeHandler();
  };

  const handleCopy = () => {
    const text =  
      queryData?.map((item,x) => 
          `${item[0]} : ${item[1]} \n`
      )

    navigator.clipboard.writeText(text);
    alert("Details copied to clipboard");
    closeHandler();

  };

  return (
    <div style={styles.container}>
      <div id="printable">
        <div style={styles.messageBox}>
          <h3>
            Your Payment successfully completed. Please check your email for
            more details
          </h3>
        </div>
        <div style={styles.detailsBox}>
          {
            queryData?.map((item,x) => {
              return (
                <p key={x}>{item[0]} : {item[1]}</p>
              )
            })

          }
          
        </div>
      </div>
      <div style={styles.buttonBox}>
        <button
          className="popbuttonSuccess"
          onClick={() => handlePrint()}
          style={styles.button}
        >
          Print Now
        </button>
        <button
          className="popbuttonWarning"
          onClick={() => handleCopy()}
          style={styles.button}
        >
          Copy
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  messageBox: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  detailsBox: {
    marginBottom: "20px",
  },
  buttonBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    // border: "1px solid #ccc",
  },
};

export default PaymentSuccess;
