
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

interface ProductFormData {
  quantity: string;
  date: Date | string ; // Vous pouvez également utiliser le type Date si vous préférez
  // Ajoutez d'autres champs de données du produit ici si nécessaire
}


export { FormDataLogin, FormDataRegister, ProductFormData}