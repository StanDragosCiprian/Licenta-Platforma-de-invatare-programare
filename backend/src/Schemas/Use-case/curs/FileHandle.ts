import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
export class FileHandle implements IFileHandle {
  filterImage(): (req: any, file: any, cb: any) => void {
    return (req, file, cb) => {
      const allowedMimeTypes = [
        'application/image',
        'application/jpegf',
        'application/msword',
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
  }
  public filterVideo(): (req: any, file: any, cb: any) => void {
    return this.filterVideoFormat();
  }
  public destinationVideo() {
    return {
      destination: this.destination(),
      filename: this.filename(),
    };
  }
  private destination() {
    return (req: Request, file, cb) => {
      const coursName = req.params.coursName;
      const professorName = req.params.professorName;
      const dest = `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\${professorName.replace(
        ' ',
        '_',
      )}\\${coursName}`;
      if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
      }
      req.body.dest = dest; // Add the destination path to the request object
      cb(null, dest);
    };
  }
  public filterDocuments() {
    return this.fd();
  }
  private fd() {
    return (req, file, cb) => {
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/msword',
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
  }
  private filename() {
    return (req, file, cb) => {
      const name = file.originalname.split('.')[0];
      const fileExtension = file.originalname.split('.')[1];
      const newFileName =
        name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
      req.body.filename = newFileName;
      cb(null, newFileName);
    };
  }

  private filterVideoFormat() {
    return (req, file, cb) => {
      const allowedMimeTypes = [
        'video/mp4',
        'video/x-msvideo',
        'video/quicktime',
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
  }
}

export interface IFileHandle {
  destinationVideo(): object;
  filterVideo(): (req: any, file: any, cb: any) => void;
  filterDocuments(): (req: any, file: any, cb: any) => void;
  filterImage(): (req: any, file: any, cb: any) => void;
}
