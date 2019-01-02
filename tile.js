class Tile
{
  constructor(tileNumber)
  {
    this.tileNumber = tileNumber;
    this.isDown = false;
  }

  dropTile()
  {
    this.isDown = true;
  }
}

class Die
{
  constructor(number,wt,ht)
  {
    this.number = number;
    this.xpos = Math.floor(Math.random() * wt * 0.80 + (wt * 0.10));
    this.ypos = Math.floor((Math.random() * ht * 0.50) + (ht * 0.40))
    this.w = (wt * 0.08);
  }
}
