import { Component, OnInit } from '@angular/core';
import { SERVERS } from 'src/db-data';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // servers = SERVERS;
  servers: any = [];
  searchedServer: any;

  constructor(
    private http: HttpClient) {}

  ngOnInit() {
    // this.searchedServer = this.servers;
    console.log("hola")
    this.getServers().subscribe(res => {
      console.log("Res", res)
      this.servers = res;
      this.searchedServer = this.servers;
    })
  }

  getServers() {
    return this.http
    .get("assets/files/servers.json")
    .pipe(
      map((res:any) => {
        return res.data;
      })
    )
  }

  searchServer(event:any) {
    const textToSearch = event.target.value;
    this.searchedServer = this.servers;
    if(textToSearch && textToSearch.trim() != '') {
      // this.searchedServer = this.searchedServer.filter((server:any) => {
      //   return (server.hostname.toLowerCase().indexOf(textToSearch.toLowerCase())) > -1
      // })
      this.searchedServer = this.searchedServer.filter((server:any) => {
        return (server.ip.toLowerCase().indexOf(textToSearch.toLowerCase())) > -1 ||
        (server.hostname.toLowerCase().indexOf(textToSearch.toLowerCase())) > -1 ||
        (server.url.toLowerCase().indexOf(textToSearch.toLowerCase())) > -1
      })
    }
  }

  doRefresh(event:any) {
    this.getServers();
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
