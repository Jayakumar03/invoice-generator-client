// Invoice.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import Heading from "./Heading";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Product = {
  name: string;
  price: number;
  quantity: number;
};

const Invoice: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const userId = "65d8a111a8d535573241bea4";
  useEffect(() => {
    let total = calculateTotal();
    totalAmountCal(total);
  }, [items]);

  const addProduct = () => {
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const totalAmountCal = (total: number) => {
    const gstAmount = total * 0.18;
    setTotalAmount(Math.floor(total + gstAmount));
  };

  const calculateTotal = () => {
    const total = items.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    return total;
  };



  const submitProductData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3000/api/v1/invoice/createinvoice`, {
        items,
        totalAmount,
        userId,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.success) {
          const invoiceId = data.invoice._id;
          console.log(invoiceId);
          axios
            .get(`http://localhost:3000/api/v1/invoice/download/${invoiceId}`)
            .then((downloadResponse) => {
              // Handle the download response here
              console.log(downloadResponse);
            })
            .catch((downloadError) => {
              // Handle download errors here
              console.error(downloadError);
            });
        } else {
          // Handle the case where the invoice was not successfully created
          toast.error("Invoice creation failed.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        }
      })
      .catch((error) => {
        toast.error("Unable to create Invoice.", {
          position: "top-right",
          autoClose: 50000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        console.error(error);
      });
  };

  return (
    <>
      <Heading />
      <div className="flex justify-between align-center relative left-[20%]  ">
        <div className=" flex justify-between border border-2 border-blue-700 w-2/5 relative left-[10%] top-10 ">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Product Price</th>
                <th className="px-4 py-2">Product Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((product, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.price}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-2/5  border border-1 border-blue-200  text-center">
            <h2>Amount: {calculateTotal()}</h2>
            <h2>Gst : 18%</h2>
            <h2>TotalAmount: {totalAmount}</h2>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddProduct={setItems}
        />
      </div>
      <div className="flex w-2/5 relative top-20 my-0 mx-auto justify-between gap-5 align-center">
        <button
          onClick={addProduct}
          className="bg-blue-500 w-30 h-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 "
        >
          Add Product
        </button>

        <button
          onClick={submitProductData}
          className="bg-blue-500  w-30 h-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 "
        >
          Generate Pdf
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Invoice;
