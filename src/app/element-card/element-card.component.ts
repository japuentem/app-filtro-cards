import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ServerItem } from 'src/app/model/element';

@Component({
  selector: 'element-card',
  templateUrl: './element-card.component.html',
  styleUrls: ['./element-card.component.css']
})
export class ElementCardComponent implements OnInit {

  @Input()
  element: ServerItem | undefined;

  constructor(private toastController: ToastController) { }

  ngOnInit(): void {
  }

  async copyPassword(password: string | undefined) {
    if (!password) return;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(password);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      const toast = await this.toastController.create({
        message: 'Contraseña copiada al portapapeles',
        duration: 2000,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle'
      });
      toast.present();
    } catch (err) {
      const toast = await this.toastController.create({
        message: 'Error al copiar contraseña',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'close-circle'
      });
      toast.present();
    }
  }
}
