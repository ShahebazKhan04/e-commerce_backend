import DataURIParser from "datauri/parser.js";
import path from "path";

export const getDataUri = (file) => {
  const parser = new DataURIParser(); // it is a utility from data.uri // which provides methods to convert files into Data URIs.
  const extName = path.extname(file.originalname).toString(); // It extracts the file extension (like .png or .jpg) from the file’s name
  return parser.format(extName, file.buffer);   // method from DataURIParser converts the file into a Data URI.
};
