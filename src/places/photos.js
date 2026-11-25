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
    { file: 'File:Freiburg Altes Rathaus 01.jpg', caption: 'The arch of the former passage to the courtyard, today the main entrance, 2015.' },
    { file: 'File:Freiburg im Breisgau, Turmstraße -- 2025 -- 7957.jpg', caption: 'Turmstraße in 2025, with the bridge from the Altes Rathaus (right) to the Neues Rathaus (left).' },
    { file: 'File:Altes Rathaus (Freiburg im Breisgau) 4610.jpg', caption: 'The front on Rathausplatz in 2011: on the left the gable with the clock, the eagle and two bells, over the green arch of the main entrance; along the wing a small doorway and, behind a palm, a second portal; a stepped gable at each end of the long roof.' },
  ],
  'neues-rathaus': [
    { file: 'File:Voorgevel van het Neues Rathaus te Freiburg im Breisgau Freiburg I. B. Neues Rathaus (titel op object), RP-F-00-9055.jpg', crop: [0.09, 0.12, 0.4, 0.75], caption: 'The front on Rathausplatz, five years after the conversion: a gabled house on the left and the middle wing with its three arches, balcony, clock and bell turret. One half of a stereo photograph, 1906.' },
    { file: 'File:Freiburg im Breisgau, Neues Rathaus -- 2025 -- 7964.jpg', caption: 'The clock and the green bell turret over the middle wing, from below, 2025.' },
    { file: 'File:2017-05-02 Neues Rathaus (Freiburg im Breisgau).jpg', caption: 'The courtyard, 2017.' },
    { file: 'File:Neues Rathaus (Freiburg) 4029.jpg', caption: 'The front on Rathausplatz in 2011: two gabled houses, each with an oriel on its outer corner, and between them the three arches, the balcony, the clock and the copper bell turret. On the right, the red Altes Rathaus.' },
  ],
  schlossbergturm: [
    { file: 'File:Schlossbergturm in Freiburg 7.jpg', caption: 'The tower with its tree trunks, seen from the steps below it, October 2011.' },
    { file: 'File:Schlossbergturm in Freiburg ohne Stützen 3.jpg', caption: 'July 2015, without its trunks: the stair cage and the decks stand alone, held by cables, behind a site fence.' },
    { file: 'File:Schlossbergturm (Freiburg).jpg', caption: 'The tower on its steel posts, January 2020: the stair in its round cage, a ring low down, two decks close under the top and the small pulpit above them.' },
  ],
  colombischloessle: [
    { file: 'File:Colombischlößle, Blick von der Eisenbahnstraße - Gottlieb Theodor Hase - Augustiner M Freiburg.png', crop: [0.02, 0.17, 0.96, 0.7], caption: 'The villa seen from Eisenbahnstraße, above a railing and a planted slope, with children standing in the street: a turret on the left, the porch and its balcony on the right, the lantern and its weathervane on the low roof. Photograph by Gottlieb Theodor Hase, after 1861 (shown without its edges).' },
    { file: 'File:Colombischlößchen (Freiburg) 3348.jpg', caption: 'The front in 2011, across the fountain of the park: the porch of three arches with a balcony on it, and the taller middle part between sandstone pilasters.' },
    { file: 'File:Colombischlößle (Freiburg im Breisgau) jm90430.jpg', caption: 'The south-west side in 2019: brick walls, pilasters and a plinth of red sandstone, a pierced parapet, and a turret at the back.' },
  ],
  'kollegiengebaeude-1': [
    { file: 'File:Freiburg - Synagoge - Universität - Theater - AK 1912.jpg', caption: 'The tower of the «Neue Universität» (left) and the dome of the «Neues Theater» (right) over the roofs of the town, as the card labels them. Postcard, dated 1912.' },
    { file: 'File:Kolleggebäude I Uni.Fr.jpg', caption: 'The south front in July 2009: the portal at the top of its steps between the two seated figures, and five dormers on the slate roof.' },
    { file: 'File:Uni Freiburg - KGI.jpg', caption: 'The round wing under its copper dome and the tower with its clocks behind it, January 2007.' },
  ],
  universitaetsbibliothek: [
    { file: 'File:Freiburg im Breisgau, Universitätsbibliothek -- 2025 -- 8092.jpg', caption: 'June 2025, across the tram tracks: the lower storeys lean out and mirror the square and the buildings opposite, the upper ones lean back and mirror the sky.' },
    { file: 'File:Universitätsbibliothek Freiburg.jpg', caption: 'Under a twilight sky in February 2017, with the lights on inside: the long front folded into slanted faces, and the entrance marked «UB».' },
    { file: 'File:2008-08 ehemaliger Bau der Freiburger Universitätsbibliothek von 1978, vorne der frühere Zweiradparkplatz.jpg', caption: 'The library of 1978, which stood here before: storeys clad in red-brown panels behind the trees, seen from Platz der Alten Synagoge across a parking place for bicycles and scooters. August 2008.' },
  ],
  theater: [
    { file: 'File:Hoffmann theater 01.jpg', caption: 'The theatre with strollers in front of it: the show gable over the curved front on the right, the long flank, and a dome with a lantern over the stage. Colour postcard, about 1910.' },
    { file: 'File:Stadttheater freiburg 1960.jpg', caption: 'The front in September 1960, still with its show gable: the doors, the tall windows with their balconies, the statues in front of the piers, and the pillars with figures by the steps.' },
    { file: 'File:Theater Freiburg i. Br. (2025).jpg', caption: 'June 2025, from the tram crossing: the curved front with the lettering «THEATER FREIBURG» under the cone roof, the north flank, and the stage tower behind.' },
  ],
};
