// @ts-nocheck
export class GridGame<T> {
    table: HTMLElement;
    customTiles = new Array<T>();
  
    ac(type_: string, father: HTMLElement): HTMLElement {
      return father.appendChild(document.createElement(type_));
    }
    ael(type_: string, id: string, callback: EventListenerOrEventListenerObject) {
      document.getElementById(id).addEventListener(type_, callback);
    }
  
    constructor(public width: number, public height: number, callback?: (i: number, x:number, y:number, td: HTMLElement) => T, parentElement=document.body) {
      document.body.oncontextmenu = function () { return false };
      this.table = this.ac("table", parentElement);
      for (var y = 0; y < height; y++) {
        var tr = this.ac("tr", this.table);
        for (var x = 0; x < width; x++) {
          var td = this.ac("td", tr);
          td.tabIndex = x + y * width; // lil hijack
          if( callback)
            this.customTiles.push(callback(td.tabIndex, x, y, td));
        }
      }
    }
    
    toXY(i: number): [number, number] {
      return [i%this.width, i/this.width|0];
    }
  
    isInBounds(x: number, y: number): boolean {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return false;
      return true;
    }
  
    getTD(x: number, y: number): HTMLTableCellElement {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return null;
      return this.table.getElementsByTagName("tr")[y].getElementsByTagName("td")[x];
    }
  
    getTile(x: number, y: number): T {
      return this.customTiles[x + y * this.width];
    }
  
    addClass(x: number, y: number, class_: string) {
      this.getTD(x, y)?.classList.add(class_);
    }
  
    removeClass(x: number, y: number, class_: string) {
      this.getTD(x, y)?.classList.remove(class_);
    }
  
    setClass(x: number, y: number, class_: string) {
      if(this.isInBounds(x, y))
        this.getTD(x, y).className = class_;
    }
  
    toggleClass(x: number, y: number, class_: string) {
      this.getTD(x, y)?.classList.toggle(class_);
    }
  
    hasClass(x: number, y: number, class_: string) {
      return this.getTD(x, y)?.classList.contains(class_);
    }
  
    /** @deprecated use hasClass instead */
    isPressed(x: number, y: number) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return true;
      return this.getTD(x, y).classList.contains("off");
    }
  
    /** @deprecated use toggleClass instead */
    toggleButton(x: number, y: number) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return;
      this.toggleClass(x,y,"off");
      //bc = window.getComputedStyle(td).backgroundColor;
      //this.getTD(x,y).style.borderStyle = (bs=='inset'?'outset':'inset');
    }
  
    getAllNeighbours(x: number, y: number, includeThyself=false): number[][] {
      var array1 = [y - 1, y, y + 1].map(y => [x - 1, x, x + 1].map(x => [x, y]));
      var array2 = Array.prototype.concat.apply([], array1); // flatMap
      if( !includeThyself)
        array2.splice(4, 1); // remove center [x,y] since it is not a neighbour
      var array3 = array2.filter(([x,y])=>x>=0&&x<this.width&&y>=0&&y<this.height)
      return array3;
    }
  
    getAllNeighboursTD(x: number, y: number, includeThyself=false): HTMLElement[] {
      return this.getAllNeighbours(x,y,includeThyself).map( ([x,y]) => this.getTD(x,y));
    }
  
    removeAllNeighbours(x: number, y: number, includeThyself=false) {
      this.getAllNeighboursTD(x,y,includeThyself).forEach((td) => td.style.visibility = "hidden");
    }
  
    /** @deprecated use the new class changing methods instead */
    remove(x: number, y: number) {
      this.getTD(x,y).style.visibility = "hidden";
    }
  
    /** @deprecated use the new class changing methods instead */
    setHidden(x: number, y: number, trueOrFalse: boolean) {
      if(trueOrFalse)
        this.hide(x,y);
      else
        this.show(x,y);
    }
  
    /** @deprecated use the new class changing methods instead */
    hide(x: number, y: number) {
      var td = this.getTD( x,y );
      td.style.backgroundColor = "white";
      //td.style.borderStyle = "";
    }
  
    /** @deprecated use the new class changing methods instead */
    show(x,y) {
      this.getTD(x, y).style.backgroundColor = null;
    }
  
    /** @deprecated use the new class changing methods instead */
    isHidden(x,y) {
      // return this.getTD(x, y).classList.length != 0
      return this.getTD(x, y).style.backgroundColor == "white";
    }
  
    /** @deprecated use the new class changing methods instead */
    reveal(x: number, y: number, backgroundColor: string, text: string, borderStyle = 'inset') {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return;
      var td = this.getTD(x, y);
      td.style.backgroundColor = backgroundColor;
      td.style.borderStyle = borderStyle;
      td.innerHTML = text;
    }
  
    setTextForList(list: [[number, number]], text: string) {
      for( var tuple of list) {
        this.setText( tuple[0], tuple[1], text);
      }
    }
  
    setText(x: number, y: number, text: string) {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return;
      var td = this.getTD(x, y);
      td.innerHTML = text;
    }
  
    getText(x: number, y: number): string {
      if (x < 0 || x >= this.width || y < 0 || y >= this.height)
        return;
      var td = this.getTD(x, y);
      return td.innerHTML;
    }
  
    shuffleTiles() {
      var a = this.customTiles;
      for (var i = a.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
  
    forEachTD(callback: (x: number, y: number, td: HTMLTableCellElement) => void) {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          if( callback)
            callback( x, y, this.getTD(x,y));
        }
      }
    }
  
    print(...args: any[]) {
      var content = document.createTextNode("[" + args.join(", ") + "]");
      var div = document.createElement("div");
      div.appendChild(content);
      document.body.appendChild(div);
    }
  
    onClick(callback: (x: number, y: number, button: number) => void) {
      var that = this;
      this.table.addEventListener("mousedown", function (event: MouseEvent) {
        var td = event.target as HTMLElement;
        if (td.tabIndex >= 0) {
          callback(td.tabIndex % that.width, td.tabIndex / that.width | 0, event.button);
        }
      });
    }
  }
  
  // Returns a random integer between min (inclusive) and max (inclusive)
  export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  export function arrayEquals( array1, array2) {
      if (!array1||!array2||(array1.length != array2.length))
          return false;
      for (var i = 0, l=array1.length; i < l; i++) {
          // Check if we have nested arrays
          if (array1[i] instanceof Array && array2[i] instanceof Array) {
              // recurse into the nested arrays
              if (!arrayEquals(array1[i], array2[i]))
                  return false;       
          } else if (array1[i] != array2[i]) { 
              // Warning - two different object instances will never be equal: {x:20} != {x:20}
              return false;   
          }           
      }       
      return true;
  }
  
  export const cloneArray = (items) => items.map(item => Array.isArray(item) ? cloneArray(item) : item);
  
  
  