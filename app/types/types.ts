
type FormDataLogin = {
  email: string;
  password: string;
};

type FormDataRegister = {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
};

interface ProductFormDataScan {
  quantity: string;
  [key: string]: string | Date;
}

interface ProductFormData {
  name: string;
  quantity: string;
  date: Date;
}



export { FormDataLogin, FormDataRegister, ProductFormDataScan,ProductFormData}