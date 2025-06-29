export const getTransactionIdByName = (transactions, transactionName) => {
    const transaction = transactions?.find(
      (tx) => tx.attributes.transactionName === transactionName
    );
    
    return transaction?.id;
  };
  