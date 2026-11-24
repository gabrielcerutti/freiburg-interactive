// The photos of each place: which files on Wikimedia Commons, and what the caption says. tools/photos.mjs reads this
// list, downloads each file once, and writes public/photos/ (the pictures and photos.json with their author, date,
// licence and source). Only public-domain and Creative Commons files: the tool refuses anything else.
// A caption says what is in the picture and nothing the picture or its Commons page does not show.
// `crop`: [left, top, width, height] as fractions of the picture, for a stereo card or a mount to trim.
export const PHOTOS = {
  muenster: [
    { file: 'File:The cathedral, Freiburg, Baden, Germany, ca. 1895.jpg', caption: 'The Münster above the roofs of the old town, with the plain behind. Photochrom print, about 1895–1900.' },
    { file: 'File:0722 Westturm des Freiburger Münsters.jpg', caption: 'The openwork spire of the west tower, 2019.' },
  ],
  martinstor: [
    { file: 'File:Martinstor ak160z.jpg', caption: 'The gate before 1901: a low tower with a tented roof and a small bell turret. Postcard, sent in 1900.' },
    { file: 'File:Freiburg I B, Martinstor (NBY 443670).jpg', caption: 'After the rebuilding: the raised tower with its corner turrets, the second gateway beside it and a tram in the street. Painted postcard, 1903 or later.' },
    { file: 'File:Freiburg im Breisgau, Martinstor -- 2025 -- 8005.jpg', caption: 'The top of the tower in 2025: the clock, the corner turrets and the green roofs, over white plaster and sandstone.' },
  ],
  schwabentor: [
    { file: "File:Het 'Schwabentor', gezien vanuit de Salzstrasse, Freiburg, RP-F-00-6462.jpg", crop: [0.275, 0.22, 0.4, 0.55], caption: 'The gate before it was raised, seen from Salzstraße. Photograph, about 1880–1900 (shown without its mount).' },
    { file: 'File:Freiburg i. Br., Baden-Württemberg - Schwabentor und Schönberg (Zeno Ansichtskarten).jpg', caption: 'On the right, the tower with the stepped gable it had from 1901 to 1954, above the town; the Schönberg behind. Postcard, 1916.' },
    { file: 'File:Freiburg im Breisgau, Schwabentor -- 2025 -- 8031.jpg', caption: 'The tower from below in 2025: white plaster, sandstone corners and the clock under the tented roof.' },
  ],
  kaufhaus: [
    { file: 'File:The market hall, Freiburg, Baden, Germany, ca. 1895.jpg', caption: 'Market day in front of the Kaufhaus: the four arcades, the balcony, the two oriels and a stepped gable. Photochrom print, 1890s.' },
    { file: 'File:Historisches Kaufhaus Freiburg im Breisgau (2025).jpg', caption: 'The front in 2025: the red façade, the statues under their canopies and the coloured tiles of the oriels.' },
  ],
  'altes-rathaus': [
    { file: 'File:Freiburg Altes Rathaus 01.jpg', caption: 'The main portal, 2015.' },
    { file: 'File:Freiburg im Breisgau, Turmstraße -- 2025 -- 7957.jpg', caption: 'Turmstraße in 2025, with the bridge from the Altes Rathaus (right) to the Neues Rathaus (left).' },
  ],
  'neues-rathaus': [
    { file: 'File:Voorgevel van het Neues Rathaus te Freiburg im Breisgau Freiburg I. B. Neues Rathaus (titel op object), RP-F-00-9055.jpg', crop: [0.09, 0.12, 0.4, 0.75], caption: 'The front on Rathausplatz, five years after the conversion: a gabled house on the left and the middle wing with its three arches, balcony, clock and bell turret. One half of a stereo photograph, 1906.' },
    { file: 'File:Freiburg im Breisgau, Neues Rathaus -- 2025 -- 7964.jpg', caption: 'The clock and the green bell turret over the middle wing, from below, 2025.' },
    { file: 'File:2017-05-02 Neues Rathaus (Freiburg im Breisgau).jpg', caption: 'The courtyard, 2017.' },
  ],
};
