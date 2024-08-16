"use client";

import ArchivedTransactions from "@/components/screens/ArchivedTransactions";
import { TransactionsTable } from "@/components/screens/TransactionsPage";
import { withAuth } from "@/hoc/withAuth"; // Import your withAuth HOC

//refactoring this to invoice
function Transactions() {
  return (
  
        
          <ArchivedTransactions />
    
   
  );
}
export default withAuth(Transactions);