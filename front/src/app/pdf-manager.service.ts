import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from './pages/transaction';

@Injectable({
  providedIn: 'root'
})
export class PdfManagerService {
  private doc: jsPDF;
  private lineHeight = 8;
  private fontSizeTitle = 16;
  private data!: any[];

  constructor() {
    this.doc = new jsPDF();
    this.doc.setFont('Courier', 'normal');
  }

  private capitalizeWords(text: string): string {
    return text.replace(/\b\w/g, char => char.toUpperCase());
  }

  private addText(text: string, x: number, y: number, fontSize: number, fontStyle: string, color: string = '#000000'): void {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('Courier', fontStyle);
    this.doc.setTextColor(color);
    this.doc.text(text, x, y);
  }

  private addLine(text: string, x: number, y: number, fontSize: number, fontStyle: string, color: string = '#000000'): number {
    this.addText(text, x, y, fontSize, fontStyle, color);
    return y + this.lineHeight;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  async generateReceipt(transaction: Transaction): Promise<void> {
    try {
      const logo = await this.loadImage('./assets/logo.png');
      this.doc.addImage(logo, 'PNG', 0, 0, 50, 50);
    } catch (error) {
      console.error("Erreur de chargement de l'image", error);
    }

    let y = 50;

    this.doc.setFillColor('#0fb58b');
    this.doc.rect(0, y, this.doc.internal.pageSize.width, 20, 'F');
    this.addText(`Reçu pour la transaction ${transaction.id}`, 60, y + 15, this.fontSizeTitle, 'bold', '#ffffff');

    y += 40;

    if (transaction.type === 'transfert') {
      this.data = [
        ['Expéditeur', this.capitalizeWords(`${transaction.expName} ${transaction.expSurname}`)],
        ['Numéro expéditeur', `${transaction.expNumber}`],
        ['Destinataire', this.capitalizeWords(`${transaction.destName} ${transaction.destSurname}`)],
        ['Numéro destinataire', `${transaction.destNumber}`],
        ['Montant', `${transaction.amount} FCFA`],
        ['Date de transaction', `${transaction.created_at}`],
        ['Type de transaction', `${transaction.type}`],
        ['Transaction inversée', `${transaction.reversed ? 'Oui' : 'Non'}`],
        ['Destinataire de la transaction', `${transaction.isDestinaire ? 'Oui' : 'Non'}`],
      ];
    } else {
      this.data = [
        ['Montant', `${transaction.amount} FCFA`],
        ['Date de transaction', `${transaction.created_at}`],
        ['Type de transaction', `${transaction.type}`],
      ];
    }

    const filteredData = this.data.filter(row => row[1] !== undefined && row[1] !== null);

    autoTable(this.doc, {
      startY: y,
      head: [['Transaction', `${transaction.id}`]],
      body: filteredData,
      theme: 'grid',
      headStyles: {
        fillColor: '#0fb58b',
        textColor: '#ffffff',
      },
      bodyStyles: {
        fillColor: '#f0f0f0',
        textColor: '#000000',
      },
      alternateRowStyles: {
        fillColor: '#ffffff',
      },
      styles: {
        fontSize: 12,
        font: 'Courier',
        lineColor: '#0fb58b',
        lineWidth: 0.5,
      }
    });

    this.doc.save(`Transaction_n_${transaction.id}.pdf`);
  }
}
