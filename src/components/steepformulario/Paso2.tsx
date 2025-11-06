import React, { useState } from "react";
import { styles } from "./Styles";

interface Paso2Props {
  nombre: string;
  setNombre: (value: string) => void;
  ci: string;
  setCi: (value: string) => void;
  celular: string;
  setCelular: (value: string) => void;
  departamentoMunicipio: string;
  setDepartamentoMunicipio: (value: string) => void;
  errors: { [key: string]: string };
}

type Field = "nombre" | "ci" | "celular" | "departamentoMunicipio";

const Paso2: React.FC<Paso2Props> = ({
  nombre,
  setNombre,
  ci,
  setCi,
  celular,
  setCelular,
  departamentoMunicipio,
  setDepartamentoMunicipio,
  errors,
}) => {
  const [touched, setTouched] = useState({
    nombre: false,
    ci: false,
    celular: false,
    departamentoMunicipio: false,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleBlur = (field: Field) => {
    setTouched((prevState) => ({ ...prevState, [field]: true }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: Field
  ) => {
    const { value } = e.target;
    switch (field) {
      case "nombre":
        setNombre(value);
        break;
      case "ci":
        setCi(value);
        break;
      case "celular":
        setCelular(value);
        break;
      case "departamentoMunicipio":
        setDepartamentoMunicipio(value);
        break;
    }
  };

  const isFieldEmpty = (field: Field) => {
    const value = { nombre, ci, celular, departamentoMunicipio }[field];
    return !value || (touched[field] && !value.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      isFieldEmpty("nombre") ||
      isFieldEmpty("ci") ||
      isFieldEmpty("celular") ||
      isFieldEmpty("departamentoMunicipio")
    ) {
      setFormError("Por favor, llene todos los campos obligatorios.");
    } else {
      setFormError(null);
    }
  };

  const renderField = (field: Field, label: string, example: string) => (
    <div style={styles.formGroup}>
      <label style={{ ...styles.label, color: "#000" }}>{label}:</label>
      <p style={{ ...styles.exampleText, color: "#555" }}>Ejemplo: {example}</p>
      <input
        style={{
          ...styles.input,
          borderColor: isFieldEmpty(field) ? "red" : "#000",
          color: "#000",
        }}
        type="text"
        value={{ nombre, ci, celular, departamentoMunicipio }[field]}
        onChange={(e) => handleInputChange(e, field)}
        onBlur={() => handleBlur(field)}
        required
      />
      {isFieldEmpty(field) && touched[field] && (
        <p style={{ ...styles.errorText, color: "red" }}>
          Este campo es obligatorio.
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.step}>
        <h2 style={{ ...styles.title, color: "#000" }}>
          Paso 2: Información personal
        </h2>

        {formError && (
          <p style={{ ...styles.errorText, color: "red" }}>{formError}</p>
        )}

        {renderField("nombre", "Nombre Completo", "Juan Pérez")}
        {renderField("ci", "Cédula de Identidad", "12345678")}
        {renderField("celular", "Celular", "+591 70621016")}
        {renderField(
          "departamentoMunicipio",
          "Departamento o Municipio",
          "Santa Cruz, Montero"
        )}
      </div>
    </form>
  );
};

export default Paso2;
