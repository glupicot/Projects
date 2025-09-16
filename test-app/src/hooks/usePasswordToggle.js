import { useState } from 'react';

const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return [visible ? 'text' : 'password', toggleVisibility];
};

export default usePasswordToggle;