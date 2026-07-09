import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Element } from '../model/element';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  servers: Element[] = [];
  searchedServer: Element[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchServers();
  }

  fetchServers(event?: any) {
    this.http.get<{data: Element[]}>("assets/files/servers.json").pipe(
      map(res => res.data)
    ).subscribe({
      next: (res) => {
        this.servers = res;
        this.searchedServer = this.servers;
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error(err);
        if (event) event.target.complete();
      }
    });
  }

  searchServer(event: any) {
    const textToSearch = event.target.value;
    this.searchedServer = this.servers;
    if(textToSearch && textToSearch.trim() != '') {
      this.searchedServer = this.searchedServer.filter((server: Element) => {
        return (server.ip.toLowerCase().indexOf(textToSearch.toLowerCase())) > -1 ||
        (server.hostname.toLowerCase().indexOf(textToSearch.toLowerCase())) > -1 ||
        (server.url.toLowerCase().indexOf(textToSearch.toLowerCase())) > -1;
      });
    }
  }

  doRefresh(event: any) {
    this.fetchServers(event);
  }
}
