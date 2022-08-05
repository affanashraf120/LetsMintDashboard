import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useController } from "react-hook-form";

type Props = {
  control: any;
  name: string;
};

const TextEditor = ({ name, control }: Props) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({ name, control, defaultValue: "" });

  return (
    <>
      <Editor
        init={{
          menubar: false,
        }}
        onEditorChange={onChange}
        onBlur={onBlur}
        value={value}
        ref={ref}
      />
    </>
  );
};

export default TextEditor;
