// src/data.ts
export interface Producto {
  id: number;
  nombre: string;
  precio: string;
  img: string;
}

// Productos por categoría
export const productosPorCategoria: { [key: string]: Producto[] } = {
  Auriculares: [
    { id: 1, nombre: 'Auriculares Sony', precio: 'Bs250', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGVsQm_Fw_Ja3NQxpJJsVxLvkzZM7l9K-3sw&s' },
    { id: 2, nombre: 'Auriculares Bose', precio: 'Bs400', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGVsQm_Fw_Ja3NQxpJJsVxLvkzZM7l9K-3sw&s' },
    { id: 3, nombre: 'Auriculares JBL', precio: 'Bs300', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGVsQm_Fw_Ja3NQxpJJsVxLvkzZM7l9K-3sw&s' },
    { id: 4, nombre: 'Auriculares Xiaomi', precio: 'Bs150', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGVsQm_Fw_Ja3NQxpJJsVxLvkzZM7l9K-3sw&s' },
    { id: 5, nombre: 'Auriculares Apple', precio: 'Bs450', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGVsQm_Fw_Ja3NQxpJJsVxLvkzZM7l9K-3sw&s' },
  ],
  Teclados: [
    { id: 1, nombre: 'Teclado Mecánico Razer', precio: 'Bs550', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz15rOzKX5L-sOJhQkbnbAaHx5nkgG-7ZMKg&s' },
    { id: 2, nombre: 'Teclado Mecánico Corsair', precio: 'Bs600', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz15rOzKX5L-sOJhQkbnbAaHx5nkgG-7ZMKg&s' },
    { id: 3, nombre: 'Teclado Logitech', precio: 'Bs300', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz15rOzKX5L-sOJhQkbnbAaHx5nkgG-7ZMKg&s' },
    { id: 4, nombre: 'Teclado Redragon', precio: 'Bs200', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz15rOzKX5L-sOJhQkbnbAaHx5nkgG-7ZMKg&s' },
    { id: 5, nombre: 'Teclado SteelSeries', precio: 'Bs500', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz15rOzKX5L-sOJhQkbnbAaHx5nkgG-7ZMKg&s' },
  ],
  Parlantes: [
    { id: 1, nombre: 'Parlante Bluetooth JBL', precio: 'Bs450', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQka0CgfTuGhnwXJThjF_o47CMAlGBmnupqKQ&s' },
    { id: 2, nombre: 'Parlante Sony Extra Bass', precio: 'Bs500', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQka0CgfTuGhnwXJThjF_o47CMAlGBmnupqKQ&s' },
    { id: 3, nombre: 'Parlante Bose SoundLink', precio: 'Bs850', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQka0CgfTuGhnwXJThjF_o47CMAlGBmnupqKQ&s' },
    { id: 4, nombre: 'Parlante Anker Soundcore', precio: 'Bs350', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQka0CgfTuGhnwXJThjF_o47CMAlGBmnupqKQ&s' },
    { id: 5, nombre: 'Parlante Marshall Emberton', precio: 'Bs950', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQka0CgfTuGhnwXJThjF_o47CMAlGBmnupqKQ&s' },
  ],
  Monitores: [
    { id: 1, nombre: 'Monitor Samsung 24"', precio: 'Bs1200', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXrM1SxcpVJaeZaPwc8sIMjb4WAe2mrb6gYA&s' },
    { id: 2, nombre: 'Monitor LG Ultrawide', precio: 'Bs1500', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXrM1SxcpVJaeZaPwc8sIMjb4WAe2mrb6gYA&s' },
    { id: 3, nombre: 'Monitor Dell 27"', precio: 'Bs1800', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXrM1SxcpVJaeZaPwc8sIMjb4WAe2mrb6gYA&s' },
    { id: 4, nombre: 'Monitor HP 22"', precio: 'Bs900', img: 'https://example.com/monitor-hp.jpg' },
    { id: 5, nombre: 'Monitor AOC 24"', precio: 'Bs1000', img: 'https://example.com/monitor-aoc.jpg' },
  ],
  Mouse: [
    { id: 1, nombre: 'Mouse Logitech G502', precio: 'Bs350', img: 'https://m.media-amazon.com/images/I/61hzuoXwjqL._AC_UF1000,1000_QL80_.jpg' },
    { id: 2, nombre: 'Mouse Razer DeathAdder', precio: 'Bs400', img: 'https://example.com/mouse-razer.jpg' },
    { id: 3, nombre: 'Mouse Corsair Harpoon', precio: 'Bs250', img: 'https://m.media-amazon.com/images/I/61hzuoXwjqL._AC_UF1000,1000_QL80_.jpg' },
    { id: 4, nombre: 'Mouse SteelSeries Rival', precio: 'Bs450', img: 'https://example.com/mouse-steelseries.jpg' },
    { id: 5, nombre: 'Mouse HyperX Pulsefire', precio: 'Bs320', img: 'https://m.media-amazon.com/images/I/61hzuoXwjqL._AC_UF1000,1000_QL80_.jpg' },
  ],
  Cámaras: [

  ],
  Micrófonos: [
    { id: 1, nombre: 'Micrófono Blue Yeti', precio: 'Bs850', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN5LnONYVtZuCMrSqs086S6UTap4zKIWH-2w&s' },
    { id: 2, nombre: 'Micrófono Shure SM7B', precio: 'Bs2000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN5LnONYVtZuCMrSqs086S6UTap4zKIWH-2w&s' },
    { id: 3, nombre: 'Micrófono Rode NT1-A', precio: 'Bs1800', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN5LnONYVtZuCMrSqs086S6UTap4zKIWH-2w&s' },
    { id: 4, nombre: 'Micrófono Audio-Technica AT2020', precio: 'Bs1200', img: 'https://example.com/microfono-audio-technica.jpg' },
    { id: 5, nombre: 'Micrófono Samson Meteor', precio: 'Bs600', img: 'https://example.com/microfono-samson.jpg' },
  ],
};
