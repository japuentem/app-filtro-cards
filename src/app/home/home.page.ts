import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ServerItem } from '../model/element';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  servers: ServerItem[] = [];
  searchedServer: ServerItem[] = [];
  isLoading: boolean = true;
  
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(private http: HttpClient, private toastController: ToastController) {}

  ngOnInit() {
    this.fetchServers();
    
    // Configurar el debounce para la búsqueda
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(textToSearch => {
      this.filterServers(textToSearch);
    });
  }
  
  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  fetchServers(event?: Event) {
    this.isLoading = true;
    this.http.get<{data: ServerItem[]}>("assets/files/servers.json").pipe(
      map(res => res.data)
    ).subscribe({
      next: (res) => {
        this.servers = res;
        this.searchedServer = this.servers;
        this.isLoading = false;
        if (event) {
          const target = event.target as unknown as { complete: () => void };
          if(target.complete) target.complete();
        }
      },
      error: async (err) => {
        console.error(err);
        this.isLoading = false;
        if (event) {
          const target = event.target as unknown as { complete: () => void };
          if(target.complete) target.complete();
        }
        
        const toast = await this.toastController.create({
          message: 'Error al cargar los servidores. Intenta recargar.',
          duration: 3000,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        });
        toast.present();
      }
    });
  }

  searchServer(event: Event) {
    const customEvent = event as CustomEvent;
    const textToSearch = customEvent.detail.value;
    this.searchSubject.next(textToSearch);
  }
  
  private filterServers(textToSearch: string) {
    if(textToSearch && textToSearch.trim() !== '') {
      const lowerCaseText = textToSearch.toLowerCase();
      this.searchedServer = this.servers.filter((server: ServerItem) => {
        return (server.ip?.toLowerCase().includes(lowerCaseText)) ||
               (server.hostname?.toLowerCase().includes(lowerCaseText)) ||
               (server.url?.toLowerCase().includes(lowerCaseText));
      });
    } else {
      this.searchedServer = this.servers;
    }
  }

  doRefresh(event: Event) {
    this.fetchServers(event);
  }
}
