import React from "react";
import styles from "../../pedido/steps_1/form.module.css";

interface Paso1Props {
  formData: {
    nombre: string;
    ci: string;
    celular: string;
    departamento: string;
    provincia: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  formSubmitted: boolean;
}

const departamentos = {
  "Santa Cruz": ["Santa Cruz de la Sierra", "Montero", "Camini"],
  "La Paz": ["Yungas", "Caranavi", "Recojo en tienda"],
  Cochabamba: ["Cochabamba"],
  Potosí: ["Potosi", "Tupiza", "Villazón", "Uyuni", "Llallagua"],
  Oruro: ["Oruro"],
  Chuquisaca: ["Sucre"],
  Tarija: ["Tarija", "Yacuiba", "Villa Montes", "Bermejo"],
  Beni: [
    "Trinidad",
    "Riberalta",
    "Guayaramerín",
    "San Borja",
    "Santa Rosa",
    "Santa Ana del Yacuma",
    "Rurrenabaque",
  ],
  Pando: ["Cobija", "Puerto Rosa"],
};

const Paso1 = ({ formData, onChange, formSubmitted }: Paso1Props) => {
  const [provincias, setProvincias] = React.useState<string[]>([]);
  const [selectedDep, setSelectedDep] = React.useState<string>("");

  const [showModal, setShowModal] = React.useState(false);

  const handleDepartamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    onChange(e);
    setSelectedDep(value);
    setProvincias(
      (departamentos[value as keyof typeof departamentos] || []).filter(
        (prov) => prov !== undefined
      )
    );

    onChange({ target: { name: "provincia", value: "" } } as any);

    if (value === "La Paz") {
      setShowModal(true);
    }
  };

  const handleProvinciaClick = (provincia: string) => {
    const concatenado = `${selectedDep} - ${provincia}`;
    onChange({ target: { name: "provincia", value: provincia } } as any);
    onChange({ target: { name: "departamento", value: concatenado } } as any);
  };

  const hasError = (field: string) =>
    formSubmitted && !formData[field as keyof typeof formData]?.trim();

  return (
    <div>
      <h2 className={styles.title}>Información Personal Para su Pedido</h2>

      {/* Nombre */}
      <div
        className={`${styles.field} ${hasError("nombre") ? styles.error : ""}`}
      >
        <label className={styles.label}>
          Nombre Completo
          <span className={styles.example}> (Ejemplo: Juan Pérez)</span>
        </label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={onChange}
          className={`${styles.input} ${
            hasError("nombre") ? styles.inputError : ""
          }`}
          required
        />
        {hasError("nombre") && (
          <p className={styles.errorMessage}>
            ⚠ Por favor, ingrese su nombre.
          </p>
        )}
      </div>

      {/* CI */}
      <div className={`${styles.field} ${hasError("ci") ? styles.error : ""}`}>
        <label className={styles.label}>
          Cédula de Identidad
          <span className={styles.example}>Ejemplo: 12345678</span>
        </label>
        <input
          name="ci"
          value={formData.ci}
          onChange={onChange}
          className={`${styles.input} ${
            hasError("ci") ? styles.inputError : ""
          }`}
          required
        />
        {hasError("ci") && (
          <p className={styles.errorMessage}>
            ⚠ Por favor, ingrese su cédula de identidad.
          </p>
        )}
      </div>

      {/* Celular */}
      <div
        className={`${styles.field} ${hasError("celular") ? styles.error : ""}`}
      >
        <label className={styles.label}>
          Celular
          <span className={styles.example}>Ejemplo: 71234567</span>
        </label>
        <input
          name="celular"
          value={formData.celular}
          onChange={onChange}
          className={`${styles.input} ${
            hasError("celular") ? styles.inputError : ""
          }`}
          required
        />
        {hasError("celular") && (
          <p className={styles.errorMessage}>
            ⚠ Por favor, ingrese su número de celular.
          </p>
        )}
      </div>

      {/* Departamento */}
      <div
        className={`${styles.field} ${
          hasError("departamento") ? styles.error : ""
        }`}
      >
        <label className={styles.label}>Departamento</label>
        <select
          name="departamento"
          value={selectedDep}
          onChange={handleDepartamentoChange}
          className={`${styles.input} ${styles.select} ${
            hasError("departamento") ? styles.inputError : ""
          }`}
          required
        >
          <option value="" className={styles.optionDefault}>
            Seleccione un departamento
          </option>
          {Object.keys(departamentos).map((dep) => (
            <option key={dep} value={dep} className={styles.option}>
              {dep}
            </option>
          ))}
        </select>
        {hasError("departamento") && (
          <p className={styles.errorMessage}>
            ⚠ Por favor, seleccione un departamento.
          </p>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(20, 10, 40, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #5a189a, #7b2cbf)",
              borderRadius: "1.5rem",
              padding: "2rem",
              color: "white",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              position: "relative",
              border: "2px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "none",
                fontSize: "1.2rem",
                fontWeight: "bold",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              ¡ATENCIÓN!
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                marginBottom: "1rem",
              }}
            >
              Tienes <strong>5 días</strong> para recoger tu pedido.
              <br />
              En caso contrario, comunícate con el número:
            </p>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                padding: "0.6rem 1rem",
                borderRadius: "1rem",
                display: "inline-block",
                fontWeight: "bold",
                fontSize: "1.1rem",
                marginBottom: "1.5rem",
              }}
            >
              📞 +591 70621016
            </div>
            <div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "linear-gradient(135deg, #9d4edd, #c77dff)",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "1rem",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provincia */}
      {provincias.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label}>
            Seleccione una provincia o ciudad
          </label>
          <div className={styles.provinciaButtons}>
            {provincias.map((prov) => (
              <button
                type="button"
                key={prov}
                onClick={() => handleProvinciaClick(prov)}
                className={`${styles.provinciaBtn} ${
                  formData.provincia === prov
                    ? styles.provinciaSelected
                    : ""
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>
      )}

      {formData.departamento && formData.provincia && (
        <div className={styles.field}>
          <label className={styles.label}>Destino seleccionado:</label>
          <p className={styles.concatenado}>{formData.departamento}</p>
        </div>
      )}
    </div>
  );
};

export default Paso1;
