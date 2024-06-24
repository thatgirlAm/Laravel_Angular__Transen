import { Injectable } from '@angular/core';
import { jsPDF, } from 'jspdf';
import { Transaction } from './pages/transaction';

@Injectable({
  providedIn: 'root'
})
export class PdfManagerService {
  private doc: jsPDF;
  private lineHeight = 8;
  private fontSizeTitle = 16;

  constructor() {
    this.doc = new jsPDF();
    this.doc.setFont('Courrier', 'normal');
  }

  private addText(text: string, x: number, y: number, fontSize: number, fontStyle: string): void {
    this.doc.setFontSize(fontSize);
    this.doc.text(text, x, y);
  }

  private addLine(text: string, x: number, y: number, fontSize: number, fontStyle: string): number {
    this.addText(text, x, y, fontSize, fontStyle);
    return y + this.lineHeight;
  }

  generateReceipt(transaction: Transaction): void {
    let y = 20;


    this.addText(`Reçu pour la transaction ${transaction.id}`, 60, y, this.fontSizeTitle, 'bold');

    y += 30; 

    if (transaction.idUserExp) {
      y = this.addLine(`Expéditeur: ${transaction.expName} ${transaction.expSurname}`, 15, y, 12, 'normal');
      y = this.addLine(`Numéro expéditeur: ${transaction.expNumber}`, 15, y, 12, 'normal');
    } else {
      y -= this.lineHeight;
    }

    if (transaction.idUserDest) {
      y = this.addLine(`Destinataire: ${transaction.destName} ${transaction.destSurname}`, 15, y, 12, 'normal');
      y = this.addLine(`Numéro destinataire: ${transaction.destNumber}`, 15, y, 12, 'normal');
    } else {
      y -= this.lineHeight;
    }

    y = this.addLine(`Montant: ${transaction.amount} FCFA`, 15, y, 12, 'normal');
    y = this.addLine(`Date de transaction: ${transaction.created_at}`, 15, y, 12, 'normal');
    y = this.addLine(`Type de transaction: ${transaction.type}`, 15, y, 12, 'normal');
    y = this.addLine(`Transaction inversée: ${transaction.reversed ? 'Oui' : 'Non'}`, 15, y, 12, 'normal');
    y = this.addLine(`Destinataire de la transaction: ${transaction.isDestinaire ? 'Oui' : 'Non'}`, 15, y, 12, 'normal');

    this.doc.save(`Transaction_n_${transaction.id}.pdf`);
  }
}
