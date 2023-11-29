import { useState } from "react";

const AuthSignIn = () => {
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const handleSubmit = () => {
    setIsErrorUsername(false);
    setIsErrorPassword(false);
    setErrorUsername("");
    setErrorPassword("");
    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("user name is not empty");
      return;
    }
    if (!password) {
      setIsErrorUsername(true);
      setErrorPassword("user name is not empty");
      return;
    }
    console.log("check login user >>>>>>> ", username, "pass", password);
  };
  return <>sssss</>;
};

export default AuthSignIn;
