import { async } from 'rxjs/internal/scheduler/async';

export const getCssClassFromFile = (f: any) => {
  let ft = f;
  if (f instanceof File) {
    ft = f.type;
  }
  if (
    'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text'.indexOf(
      ft
    ) >= 0
  ) {
    return 'doc';
  } else if ('application/pdf'.indexOf(ft) >= 0) {
    return 'pdf';
  } else if ('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.indexOf(ft) >= 0) {
    return 'xls';
  } else if ('application/x-zip-compressed'.indexOf(ft) >= 0) {
    return 'zip';
  } else if (ft.indexOf('image') >= 0) {
    return 'image';
  }
  return 'file';
};

export const fileToBase64 = _file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(_file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export function base64ToFile(_base64: string, _fileName: string, _fileType: string): File {
  const blob = dataURItoBlob(_base64, _fileType);
  const file = new File([blob], _fileName, { type: _fileType });
  return file;
}

function dataURItoBlob(dataURI, _fileType: string) {
  const byteString = window.atob(dataURI);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array], { type: _fileType });
  return blob;
}
