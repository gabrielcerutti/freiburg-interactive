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
  'kollegiengebaeude-2': [
    { file: 'File:Freiburg i. Br.- Blick vom Hochhaus des Regierungspräsidiums auf neues Kollegiengebäude der Universität - LABW - Staatsarchiv Freiburg W 134 Nr. 068816b.jpeg', caption: 'The new building from a high-rise across the square, 7 May 1962: stone piers the full height of the long front, a canopy over the ground floor, people on the roof terrace, and a lawn in front. Behind it, the tower of the Kollegiengebäude I (right). Photograph by Willy Pragher.' },
    { file: 'File:Kollegiengebäude II (Freiburg im Breisgau) jm59866.jpg', caption: 'The side on Bertoldstraße in January 2018: the two end walls of red sandstone without windows, a lower front of white fins between them, and the canopy over the ground floor.' },
    { file: 'File:Kollegiengebäude II der Freiburger Uni 7.jpg', caption: 'The back, seen from the Kollegiengebäude III in June 2015: sandstone piers, and between them pale walls with rows of windows over a canopy.' },
  ],
  'kollegiengebaeude-3': [
    { file: 'File:Freiburg- Kollegiengebäude III vom Hof aus - LABW - Staatsarchiv Freiburg W 134 Nr. 112206a.jpeg', caption: 'The north end of the building across a cobbled yard, 12 March 1980: four upper floors, each a band of concrete under a ribbon of windows, over a ground floor set back behind columns; plants on the roof. On the left, a spire with corner turrets, the one the third photo’s title names as the Martinstor. Photograph by Willy Pragher.' },
    { file: 'File:Kollegiengebäude III der Uni Freiburg, im Hintergrund das KG I.jpg', caption: 'The north end in June 2015, from the lawn: bare concrete, balconies with railings at the corner, a railing around the roof, and café chairs under the building. Behind it on the right, the red Kollegiengebäude I, as the photo’s title says.' },
    { file: 'File:Kollegiengebäude III der Uni Freiburg mit Martinstor.jpg', caption: 'June 2015: the north end on the right; on the left the low wing with glass walls and a green roof, a concrete deck leading to it, and above the roofs the spire of the Martinstor.' },
  ],
  'alte-universitaet': [
    { file: 'File:Jesuitenkolleg Bertoldstraße.jpg', caption: 'The former Jesuit college seen from the east, with tram tracks in the street: the tall hipped roof, the stepped fire wall half way along it, the low gatehouse with its round archway in front, and the church at the far end. Photograph by Georg Röbcke, dated «after 1901» on Wikimedia Commons.' },
    { file: 'File:Bertoldstraße 17 (Freiburg im Breisgau) jm61169.jpg', caption: 'The same view in February 2018: pink plaster, three rows of windows, dormers on the tiled roof, the stepped fire wall, and the gatehouse on the right.' },
    { file: 'File:University College Freiburg & Uniseum (2025).jpg', caption: 'The street front in June 2025: the arched portal at the east end, the lettering «Uniseum Freiburg», a statue in a niche between the windows, and the front of the Universitätskirche at the far end.' },
  ],
  kastaniengarten: [
    { file: 'File:Freiburger Schlossberg, Kastaniengarten mit Blick auf Schwaben- und Martinstor.jpg', caption: 'In the garden in October 2005: guests at beer tables between the trunks, a price board on one of them, lamps with a brewery’s name, and over the fence the tower of the Schwabentor and the town in the haze.' },
    { file: 'File:Greiffeneggschlössle (Freiburg) 3239.jpg', caption: 'The Schlössle from below in January 2011: white walls, dark roofs with white dormers and a flag, people at the railing, and on the left the round rubble wall at the corner, overgrown with ivy.' },
    { file: 'File:Greiffeneggschlösschen (1897).jpg', caption: 'A New Year’s card, «Gruss vom Rommel’s Schlösschen»: the house on its walled spur under a flag with that name, behind it a long hall and a pavilion with two turrets, on the right the Schwabentor with its low roof, and in the oval the Münster. Lithograph by Michael Wachter, dated 1897 on Wikimedia Commons.' },
  ],
  'brauerei-ganter': [
    { file: 'File:Freiburg- Vom Schlossberg auf Ganter Brauerei - LABW - Staatsarchiv Freiburg W 134 Nr. 106457a.jpeg', caption: 'The brewery from the Schlossberg on 14 July 1976, above a row of trees: on the left the square tower lettered «Ganter Bier», then a flat roof with steel stacks, the round chimney, a stepped gable below it and a tower with a stepped roof and a pointed cap; behind them a long building with bands of windows and the sign «Ganter Bier». Photograph by Willy Pragher.' },
    { file: 'File:Brauerei Ganter.jpg', caption: 'Much the same view in May 2007, in colour: yellow walls, the tower lettered «Ganter» with glazed storeys on top, steel stacks on a flat roof, the brick chimney, the stepped slate roof with its pointed cap, and a large flat-roofed building behind.' },
    { file: 'File:Brauerei Ganter in Freiburg 2.jpg', caption: 'In the yard, April 2015: a front lettered «Brauerei Ganter» with a coat of arms between tall windows, a low white pavilion before it, the tower and steel stacks behind, the brick chimney on the left and a house with a mural on its gable on the right.' },
  ],
  'alter-hauptbahnhof': [
    { file: 'File:Freiburger Bahnhof Kolorierte Lithographie nach 1845 Augustinermuseum Freiburg Denkmaelerarchiv.jpg', caption: 'The station from the town side: the two-storey middle block with its row of arches, a slender spire on the clock turret, low wings and the long roof of the train shed behind; strollers, riders and carriages in front. Coloured lithograph, dated about 1845 on Wikimedia Commons.' },
    { file: 'File:Freiburger Hbf 1910.jpg', caption: 'The middle block with a tram before it: seven arches between pilaster strips, seven round-headed windows above, a balcony on each projecting end, chimneys on the low hipped roof and the clock turret, now without a spire. Photograph, dated 1910 on Wikimedia Commons.' },
    { file: 'File:Eisenlohr Hochbauten der badischen Bahn Freiburg 00004.jpg', caption: 'Friedrich Eisenlohr’s ground plan, «Bahnhof bei Freiburg»: the long train shed with its tracks across the top, the open court with a fountain (20) between two ranges of waiting rooms, the entrance hall behind its row of piers at the bottom, a low wing on each side, and a scale bar in Baden feet and metres.' },
  ],
  'hauptbahnhof-1949': [
    { file: 'File:Freiburg Hauptbahnhof mit Vorplatz.jpg', caption: 'The front on 30 April 1981, under a tree: tall windows between piers above a canopy, three tall windows in the plain wall beside them, a square clock turret on the tiled roof, a lower wing beyond; taxis and people in the street. Photograph by Willy Pragher.' },
    { file: 'File:Freiburg- Hauptbahnhof, Bismarckallee, von Norden - LABW - Staatsarchiv Freiburg W 134 Nr. 106747.jpg', caption: 'From the air on 8 September 1976, looking south: right of the wide street the station’s hipped roofs around a yard full of parked cars, a glazed pyramid behind the largest roof, and the long roofs over the platforms; beyond it buses on their stands, and a bridge across the tracks. Photograph by Willy Pragher.' },
    { file: 'File:Bahnhof Freiburg 27.jpg', caption: 'In 1990, across the cobbled street: pale yellow walls under red-brown tiled roofs, a two-storey part on the left with a sign for an airport bus, a lower wing to the right, flags at its far end. The photo’s description on Wikimedia Commons calls it the old station building, «inzwischen komplett abgerissen».' },
  ],
  hauptbahnhof: [
    { file: 'File:Freiburg Bahnhof-3.jpg', caption: 'From the air on 15 April 2007: the long six-storey range beside the tracks, the two towers and the lower block before it on the street side, the platform roofs, and a bridge crossing the tracks on the right.' },
    { file: 'File:Gare de Fribourg IMG 4390 retouched.jpg', caption: 'The entrance on 24 May 2009: a flat canopy on slender columns before a glass front lettered «Hauptbahnhof», bands of glass on the range behind it, and the foot of a glass tower on the right.' },
    { file: 'File:FR-HBF 011 retouched.jpg', caption: 'From the bridge south of the station on 30 July 2008: in front the hotel, brick-red and glass, with a frame of panels on its roof; behind it the taller tower, its narrow south face dark blue; Bismarckallee on the right.' },
  ],
};
