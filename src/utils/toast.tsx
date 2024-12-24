import { toast } from 'react-toastify';

interface Props {
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
  autoclose?: number;
  message: string | string[];
}

const ReactToast = (Props: Props) => {
  const { message, position, autoclose } = Props;

  if (typeof message === 'string') {
    // Show a single toast
    toast(message, {
      position: position ?? 'top-center',
      autoClose: autoclose ?? 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "light",
    });
  } else {
    // Show multiple toasts every second
    message.forEach((msg, index) => {
      setTimeout(() => {
        toast(msg, {
          position: position ?? 'top-center',
          autoClose: autoclose ?? 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "light",
        });
      }, index * 1000); // Display each toast after 1-second delay
    });
  }
};

export default ReactToast;
