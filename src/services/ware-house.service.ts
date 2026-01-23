import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FolderData, FolderDataSchema } from '../schemas/schemas';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WareHouseService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:3000/api';

  getFolderStructure() {
    return this.http.get<FolderData>(`${this.baseUrl}/warehouse/folder-data/`).pipe(
      map((data) => {
        const parsedData = FolderDataSchema.safeParse(data);
        if (parsedData.error) {
          console.error(parsedData.error);
          throw new Error('Invalid folder structure data');
        } else {
          return parsedData.data;
        }
      }),
    );
  }
}
