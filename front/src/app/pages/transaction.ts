export class Transaction{ 
  id?: number ;
  idUserExp?: number ;
  idUserDest?: number  ;
  destName?: string ; 
  destSurname?: string; 
  expName?: string; 
  expSurname?: string; 
  destNumber?: number;
  expNumber?: number; 
  amount?: number;
  created_at?: Date;
  type?: string;
  reversed?: boolean;
  clicked?: boolean;
  isDestinaire?: boolean;
constructor(){}

}