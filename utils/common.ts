import { is } from "ramda";

export const isStart = (state: String) => {
  return state === "start";
};

export const isSuccess = (state: String) => {
  return state === "success";
};

export const isDisabled = (state: String) => {
  return state === "disabled";
};

export const isError = (state: String) => {
  return state === "error";
};

export const isArray = is(Array);
export const isObject = is(Object);
export const isString = is(String);

export const returnTrue = () => true;
export const returnFalse = () => false;
export const returnNull = () => null;

export var objectToFormData = function (obj: any, form: any, namespace: any) {
  var fd = form || new FormData();
  var formKey;

  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + "[" + property + "]";
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File)
      ) {
        objectToFormData(obj[property], fd, property);
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
};
