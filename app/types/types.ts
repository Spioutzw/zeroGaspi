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


export { FormDataLogin, FormDataRegister}