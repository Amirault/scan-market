import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Barcode, ScanSettings } from 'scandit-sdk';

@Component({
  selector: 'app-scandit',
  template:
    '<div><h1>Real</h1><scandit-sdk-barcode-picker [scanSettings]="this.settings" (scan)="onScan($event)"></scandit-sdk-barcode-picker></div>',
})
export class ScanditComponent implements OnInit {
  @Output()
  code = new EventEmitter<string>();

  readonly settings = new ScanSettings({
    enabledSymbologies: [Barcode.Symbology.EAN13],
  });

  constructor() {}

  onScan(s) {
    console.log(JSON.stringify(s));
    const barcodes = s?.barcodes ?? [];
    const codeRead = barcodes[0]?.data;
    if (codeRead) {
      this.code.emit(codeRead);
    }
  }

  ngOnInit(): void {}
}
/*

{"barcodes":[{"symbology":"ean13","data":"3257971309114","rawData":{"0":51,"1":50,"2":53,"3":55,"4":57,"5":55,"6":49,"7":51,"8":48,"9":57,"10":49,"11":49,"12":52},"location":{"topLeft":{"x":827,"y":303},"topRight":{"x":611,"y":301},"bottomRight":{"x":611,"y":230},"bottomLeft":{"x":827,"y":230}},"compositeFlag":1,"isGs1DataCarrier":false,"encodingArray":[{"encoding":"ASCII","startIndex":0,"endIndex":13}]}],"imageData":{"0":7,"1":0,"2":0,"3":255,"4":8,"5":0,"6":0,"7":255,"8":7,"9":0,"10":0,"11":255,"12":11,"13":0,"14":0,"15":255,"16":4,"17":0,"18":0,"19":255,"20":4,"21":0,"22":0,"23":255,"24":0,"25":0,"26":0,"27":255,"28":0,"29":0,"30":0,"31":255,"32":0,"33":0,"34":0,"35":255,"36":0,"37":0,"38":0,"39":255,"40":0,"41":0,"42":0,"43":255,"44":0,"45":0,"46":0,"47":255,"48":0,"49":0,"50":0,"51":255,"52":0,"53":0,"54":0,"55":255,"56":0,"57":0,"58":0,"59":255,"60":0,"61":0,"62":0,"63":255,"64":0,"65":0,"66":0,"67":255,"68":8,"69":0,"70":0,"71":255,"72":1,"73":0,"74":0,"75":255,"76":6,"77":0,"78":0,"79":255,"80":0,"81":0,"82":0,"83":255,"84":0,"85":0,"86":0,"87":255,"88":0,"89":0,"90":0,"91":255,"92":0,"93":0,"94":0,"95":255,"96":0,"97":0,"98":0,"99":255,"100":0,"101":0,"102":0,"103":255,"104":1,"105":0,"106":0,"107":255,"108":3,"109":0,"110":0,"111":255,"112":0,"113":0,"114":0,"115":255,"116":3,"117":0,"118":0,"119":255,"120":5,"121":0,"122":0,"123":255,"124":1,"125":0,"126":0,"127":255,"128":0,"129":0,"130":0,"131":255,"132":3,"133":0,"134":0,"135":255,"136":0,"137":0,"138":0,"139":255,"140":0,"141":0,"142":0,"143":255,"144":4,"145":0,"146":0,"147":255,"148":6,"149":0,"150":0,"151":255,"152":0,"153":0,"154":0,"155":255,"156":0,"157":0,"158":0,"159":255,"160":0,"161":0,"162":0,"163":255,"164":0,"165":0,"166":0,"167":255,"168":0,"169":0,"170":0,"171":255,"172":1,"173":0,"174":0,"175":255,"176":6,"177":0,"178":0,"179":255,"180":10,"181":0,"182":0,"183":255,"184":3,"185":0,"186":0,"187":255,"188":3,"189":0,"190":0,"191":255,"192":3,"193":0,"194":0,"195":255,"196":0,"197":0,"198
 */
