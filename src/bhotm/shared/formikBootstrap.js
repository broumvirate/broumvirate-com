import { useField } from "formik";

function BootstrapTextField(props) {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return (
        <div className="form-group">
            <label htmlFor={props.name}>
                <strong>{props.label}:</strong>
            </label>
            <input
                id={field.name}
                type={props.fieldType ? props.fieldType : "text"}
                {...field}
                className={
                    errorText === ""
                        ? "form-control"
                        : "form-control is-invalid"
                }
            />
            <div className="invalid-feedback">
                {errorText.slice(0, 1).toUpperCase() + errorText.slice(1)}
            </div>
            {props.helper ? (
                <small className="form-text text-muted">{props.helper}</small>
            ) : null}
            {props.children}
        </div>
    );
}

export { BootstrapTextField };
