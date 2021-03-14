import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable()
export class AppConfigService extends AppService {

    private envUrl = 'settings';
    private configSettings: any = null;

    get settings() {
        return this.configSettings;
    }

    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
          return {headerColor : '#fff',  headerTitleColor: '#000'};
        //   this.getSettings(this.envUrl).subscribe((response: any) => {
        //       console.log('response from the server:::', response);
        //       this.configSettings = response;
        //       resolve(true);
        // });
      });
    }
}
