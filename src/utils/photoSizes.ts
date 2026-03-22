export interface PhotoSize {
  id: string;
  name: string;
  nameCn: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  description: string;
}

// Standard ID photo sizes (at 300 DPI)
export const PHOTO_SIZES: PhotoSize[] = [
  {
    id: '1inch',
    name: '1 Inch',
    nameCn: '一寸',
    widthMm: 25,
    heightMm: 35,
    widthPx: 295,
    heightPx: 413,
    description: '25×35mm / 295×413px',
  },
  {
    id: '2inch',
    name: '2 Inch',
    nameCn: '二寸',
    widthMm: 35,
    heightMm: 49,
    widthPx: 413,
    heightPx: 579,
    description: '35×49mm / 413×579px',
  },
  {
    id: 'small-1inch',
    name: 'Small 1 Inch',
    nameCn: '小一寸',
    widthMm: 22,
    heightMm: 32,
    widthPx: 260,
    heightPx: 378,
    description: '22×32mm / 260×378px',
  },
  {
    id: 'small-2inch',
    name: 'Small 2 Inch',
    nameCn: '小二寸',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    description: '33×48mm / 390×567px',
  },
  {
    id: 'large-1inch',
    name: 'Large 1 Inch',
    nameCn: '大一寸',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    description: '33×48mm / 390×567px',
  },
  {
    id: 'large-2inch',
    name: 'Large 2 Inch',
    nameCn: '大二寸',
    widthMm: 35,
    heightMm: 53,
    widthPx: 413,
    heightPx: 626,
    description: '35×53mm / 413×626px',
  },
  {
    id: 'passport',
    name: 'Passport',
    nameCn: '护照',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    description: '33×48mm / 390×567px',
  },
  {
    id: '5inch',
    name: '5 Inch Print',
    nameCn: '五寸照片',
    widthMm: 89,
    heightMm: 127,
    widthPx: 1050,
    heightPx: 1499,
    description: '89×127mm / 1050×1499px',
  },
];

export interface BgColor {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

export const BG_COLORS: BgColor[] = [
  { id: 'white', name: '白色', color: '#FFFFFF', textColor: '#333' },
  { id: 'blue', name: '蓝色', color: '#438EDB', textColor: '#fff' },
  { id: 'red', name: '红色', color: '#FF0000', textColor: '#fff' },
  { id: 'gray', name: '灰色', color: '#CCCCCC', textColor: '#333' },
  { id: 'transparent', name: '透明', color: 'transparent', textColor: '#333' },
];
