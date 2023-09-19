
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
  quantity: number;
  [key: number]: string | Date;
}

interface ProductFormData {
  name: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  expirationDates: (string | Date)[];
  notifications: {
    responsesByDate : {
      [key: string]: string[]
    }
  };
  imageUrl: string;
  quantity: string;
  // Ajoutez d'autres propriétés de produit ici
}



export { FormDataLogin, FormDataRegister, ProductFormDataScan,ProductFormData,Product}