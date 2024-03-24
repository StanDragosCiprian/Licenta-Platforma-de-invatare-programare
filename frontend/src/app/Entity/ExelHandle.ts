import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";
export class ExelHandle {
  public readExcel = (
    file: any,
    setItems: Dispatch<SetStateAction<never[]>>
  ) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, {
          type: "buffer",
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        let data: any = XLSX.utils.sheet_to_json(ws, { header: 1 });
        data = data[0].map((_: any, i: any) => data.map((row: any) => row[i]));
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d: any) => {
      setItems(d);
    });
  };
  public readExcelEmail = (
    file: any,
    setItems: Dispatch<SetStateAction<never[][]>>
  ) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const firstColumn = data.map((row: any) => row[0]); // Extract the first column
        const c = firstColumn.filter((value: any) => value !== undefined);
        resolve(c);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d: any) => {
      const c = d.filter((value: any) => value !== undefined);
      console.log('c: ', c);
      setItems(c);
    });
  };
}
