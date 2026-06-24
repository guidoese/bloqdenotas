import React, { useState } from "react";
function useForm(initial_form_state, submitFn) {
  const [formState, setFormState] = useState(initial_form_state);

  function handleChange(event) {
    const field_name = event.target.name;
    const field_value = event.target.value;
    setFormState((prevState) => {
      return {
        ...prevState,
        [field_name]: field_value,
      };
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
    submitFn(formState); //funcion submit nos los pasan en el useForm
  }
  return {
    formState,
    handleChange,
    handleSubmit,
  };
}

export default useForm;
